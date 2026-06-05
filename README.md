# Joemar Belmonte — AI Portfolio

An interactive, conversational portfolio powered by an AI avatar. Visitors chat directly with an AI that represents Joemar and answers questions about his skills, projects, and how to work together.

Inspired by [toukoum.fr](https://www.toukoum.fr/) — built on Next.js 15, Vercel AI SDK, and Motion.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Edge Runtime) |
| AI Streaming | Vercel AI SDK v4 (`ai`, `@ai-sdk/groq`, `@ai-sdk/openai`) |
| LLM | Groq Llama-3.1-70B (primary) · OpenAI GPT-4o-mini (fallback) |
| Animation | Motion (`motion/react`) |
| Styling | Tailwind CSS v3 + custom CSS |
| Fonts | Syne (display) · Geist Sans (body) · Geist Mono |
| Icons | lucide-react |
| Markdown | react-markdown + remark-gfm |
| Deploy | Vercel |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and add your API key:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in at least one key:

```env
# Groq — preferred (faster, generous free tier)
# Get key at: https://console.groq.com
GROQ_API_KEY=gsk_...

# OpenAI — fallback if no Groq key
# Get key at: https://platform.openai.com
OPENAI_API_KEY=sk-...
```

> **Priority:** if `GROQ_API_KEY` is present, Groq is used. Otherwise falls back to OpenAI.

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Updating the AI Persona

All knowledge the AI has about Joemar lives in `lib/prompt.ts`. Open it and edit the `SYSTEM_PROMPT` constant to:

- Add specific resume details (education, certifications, dates)
- Add real client names or case studies (with permission)
- Adjust the personality tone
- Add or remove services

The prompt is injected as the `system` message on every chat request. It is never exposed to the client.

---

## Deployment on Vercel

### Option A — One-click (recommended)

1. Push this repo to GitHub
2. Import to [vercel.com/new](https://vercel.com/new)
3. Add environment variables (`GROQ_API_KEY` or `OPENAI_API_KEY`) in the Vercel dashboard
4. Deploy

### Option B — CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Add the env vars when asked or via the dashboard afterward.

---

## Deployment on Render (alternative)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Environment:** Node
4. Add `GROQ_API_KEY` or `OPENAI_API_KEY` in Environment Variables
5. Deploy

> Note: Render's free tier spins down after inactivity; Vercel is faster for this use case.

---

## Project Structure

```
├── app/
│   ├── api/chat/route.ts   # Streaming AI endpoint (Edge Runtime)
│   ├── globals.css         # Tailwind base + component classes
│   ├── layout.tsx          # Root layout, font loading, metadata
│   └── page.tsx            # Main chat interface + all UI components
│
├── components/
│   └── Avatar.tsx          # Animated SVG avatar (idle/thinking/replying)
│
├── lib/
│   └── prompt.ts           # SYSTEM_PROMPT — edit this with real resume data
│
├── .env.example            # Environment variable template
├── vercel.json             # Vercel deployment config
└── tailwind.config.ts      # Design tokens (colors, fonts)
```

---

## Customization

### Colors
Edit `tailwind.config.ts` under `theme.extend.colors`. The accent color is `#00d4ff` — change it to match your brand.

### Avatar size / states
`components/Avatar.tsx` — the `size` prop controls pixel dimensions. States (`idle`, `thinking`, `replying`) drive expression changes.

### Suggestion chips
`app/page.tsx` — edit the `CHIPS` array at the top of the file.

### Adding your own image
The current avatar is pure SVG. To use a photo or Lottie animation, swap out the `<Avatar>` component with your preferred implementation.
