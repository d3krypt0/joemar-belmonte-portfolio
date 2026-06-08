import { streamText, type CoreMessage } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export const maxDuration = 30

const MAX_MESSAGES    = 20
const MAX_TOTAL_CHARS = 8_000
const JSON_HEADERS    = { 'Content-Type': 'application/json' }

function err400(msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status: 400, headers: JSON_HEADERS })
}
function err500() {
  return new Response(JSON.stringify({ error: 'Chat unavailable. Please try again.' }), { status: 500, headers: JSON_HEADERS })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: CoreMessage[] = Array.isArray(body.messages) ? body.messages : []

    // Guard: reject oversized payloads before touching any LLM
    if (messages.length > MAX_MESSAGES) return err400('Too many messages in context.')

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
