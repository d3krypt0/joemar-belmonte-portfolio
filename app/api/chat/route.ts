import { streamText, type CoreMessage } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export const maxDuration = 30

const MAX_MESSAGES    = 20
const MAX_TOTAL_CHARS = 8_000
const JSON_HEADERS    = { 'Content-Type': 'application/json' }

// Per-IP fixed-window rate limit. In-memory: scoped to a single serverless
// instance, so it is best-effort, not a hard global cap. For a strict global
// limit across instances, swap this for @upstash/ratelimit + Vercel KV.
const RATE_LIMIT      = 12          // requests
const RATE_WINDOW_MS  = 60_000      // per minute
const hits = new Map<string, { count: number; reset: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    if (hits.size > 5_000) for (const [k, v] of hits) if (now > v.reset) hits.delete(k)
    return false
  }
  rec.count += 1
  return rec.count > RATE_LIMIT
}

// Only user/assistant turns reach the model. Reject system/tool/unknown roles
// so a crafted payload cannot override SYSTEM_PROMPT (prompt injection).
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})
const BodySchema = z.object({
  messages: z.array(MessageSchema).max(MAX_MESSAGES),
})

function err400(msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: JSON_HEADERS })
}
function err429() {
  return new Response(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
    status: 429,
    headers: { ...JSON_HEADERS, 'Retry-After': '60' },
  })
}
function err500() {
  return new Response(JSON.stringify({ error: 'Chat unavailable. Please try again.' }), { status: 500, headers: JSON_HEADERS })
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    if (rateLimited(ip)) return err429()

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) return err400('Invalid request payload.')
    const messages: CoreMessage[] = parsed.data.messages

    const totalChars = messages.reduce((n, m) => n + String(m.content ?? '').length, 0)
    if (totalChars > MAX_TOTAL_CHARS) return err400('Message payload too large.')

    if (process.env.GROQ_API_KEY) {
      const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
      const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: SYSTEM_PROMPT,
        messages,
        maxTokens: 1024,
        temperature: 0.72,
      })
      return result.toDataStreamResponse()
    }

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: SYSTEM_PROMPT,
        messages,
        maxTokens: 1024,
        temperature: 0.72,
      })
      return result.toDataStreamResponse()
    }

    console.error('[/api/chat] No API key configured.')
    return err500()
  } catch (err) {
    // Log full error server-side; never forward SDK internals to the client.
    console.error('[/api/chat]', err)
    return err500()
  }
}
