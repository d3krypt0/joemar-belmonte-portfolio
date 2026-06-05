import { streamText, type CoreMessage } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: CoreMessage[] = body.messages ?? []

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

    return new Response(
      JSON.stringify({ error: 'No API key configured. Set GROQ_API_KEY or OPENAI_API_KEY in .env.local' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/chat]', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
