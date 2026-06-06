# PROJECT_MEMORY.md
Living snapshot of the Joemar Belmonte AI Automation Portfolio. Auto-updated by the PostToolUse hook; only the Recent Changes section is machine-written. All other sections are human/agent-maintained.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2.7 (App Router) | All pages are `'use client'`; statically pre-rendered on Vercel |
| Styling | Tailwind CSS v3.4 + `@tailwindcss/typography` | Colors entirely via CSS variables; no hardcoded palette |
| Animation | `motion` v11 (`motion/react`) | UI transitions, WelcomeView chips, ChatView enter/exit |
| Icons | `lucide-react` v0.511 | ArrowUp, ArrowLeft, ArrowDown, ChevronLeft/Right, Loader2, Sun, Moon, ChevronDown |
| Fonts | Syne (display) + Geist Sans (body) + Geist Mono (mono) | All loaded via `next/font`; never `<link>` to Google Fonts |
| AI runtime | Vercel AI SDK v4 (`ai`) | Groq Llama-3.3-70B primary; OpenAI gpt-4o-mini fallback |
| AI providers | `@ai-sdk/groq` v1.2.9, `@ai-sdk/openai` v1.2.19 | Keys in `.env.local` only; set separately in Vercel dashboard |
| Markdown | `react-markdown` v9 + `remark-gfm` | Renders assistant message content |

---

## Pages & Routes

| Route | File | What it renders |
|---|---|---|
| `/` | `app/page.tsx` | Full single-page app: sticky chat section (WelcomeView / ChatView) + scrollable static portfolio below |
| `/api/chat` | `app/api/chat/route.ts` | POST streaming endpoint; Groq primary, OpenAI fallback; `maxDuration: 30` |

---

## Components

| File | Purpose |
|---|---|
| `app/page.tsx` | Root page + all inline sub-components (NavBar, ScrollNav, WelcomeView, ChatView, MessageRow, BookingCard, ChatProjectCard, ChipsScroller, InputForm, ScrollIndicator, ThemeToggle, ProfilePhoto) |
| `app/layout.tsx` | Root layout: Syne + Geist fonts via `next/font`, ErrorBoundary wrapper, global metadata |
| `app/globals.css` | CSS variable theme tokens (dark/light), Tailwind layers, marquee keyframes, Calendly responsive height |
| `components/StaticSection.tsx` | Full scrollable portfolio: Services, Projects (with ProjectCard), TechMarquee, Contact + Calendly |
| `components/CalendlyWidget.tsx` | Inline Calendly widget; `next/dynamic({ ssr: false })` to isolate SSR; dark/light theme sync via MutationObserver on `data-theme` |
| `components/ErrorBoundary.tsx` | React class error boundary wrapping entire app; shows reload prompt on uncaught render errors |
| `components/ProjectCard.tsx` | Animated project card with IntersectionObserver reveal and embedded WorkflowPreview diagram |
| `components/WorkflowPreview.tsx` | SVG-based workflow diagram; renders 6 pattern types (pipeline, hub, grid, branch, funnel, launch) |
| `components/TechMarquee.tsx` | Pure-CSS infinite marquee of tech stack icons; zero animation libraries; icons from `cdn.simpleicons.org` |
| `components/Avatar.tsx` | SVG avatar with animated idle/thinking/replying states and randomised blink timing |
| `lib/projects.ts` | `ALL_PROJECTS` array, shared types (ProjectData, PipelineNode, PatternType), `detectProjectsInText()` keyword matcher |
| `lib/prompt.ts` | `SYSTEM_PROMPT` constant defining Joemar's AI persona for the chat endpoint |

---

## Design Tokens

| Token | Dark mode | Light mode |
|---|---|---|
| `--color-bg` | `#050505` | `#f6f6f4` |
| `--color-surface` | `#0c0c0c` | `#ececea` |
| `--color-surface-2` | `#161616` | `#e1e1de` |
| `--color-border` | `#222222` | `#d2d2ce` |
| `--color-text` | `#efefef` | `#111111` |
| `--color-muted` | `#616161` | `#717171` |
| **`--color-accent`** | **`#00d4ff`** | **`#007aab`** |
| Font: display | Syne 700/800 (`--font-display`) | same |
| Font: body | Geist Sans (`--font-sans`) | same |
| Font: mono | Geist Mono (`--font-mono`) | same |
| Corner radius scale | all-soft: `rounded-full` (pills/chips/avatars), `rounded-2xl` (cards), `rounded-lg` (buttons) | same |
| Theme strategy | `data-theme` attribute on root div; CSS variable sets; toggled by ThemeToggle | — |

---

## Known Issues

- No active TODOs or FIXMEs in source. All tracked bugs resolved as of 2026-06-06.
- Calendly widget height on very short viewports may clip the booking form (CSS min-height workaround in `globals.css`).
- WelcomeView suggestion chips can trigger window scroll on short viewports in some browsers if the WelcomeView content overflows (mitigated via `onMouseDown preventDefault` on chip buttons).

---

## Recent Changes

- 2026-06-06 09:32 — page.tsx: Edit via Claude Code
- 2026-06-06 12:00 — page.tsx: fix scroll-on-chip-click + add ChipsScroller left/right arrow buttons
- 2026-06-06 10:00 — page.tsx: remove duplicate chat header logo; fix spurious project cards
- 2026-06-06 09:00 — page.tsx: resolve 8 chat interface layout issues
- 2026-06-06 08:00 — StaticSection.tsx: isolate CalendlyWidget with next/dynamic ssr:false; add ErrorBoundary
- 2026-06-06 07:00 — CalendlyWidget.tsx: replace next/script with useEffect script loader
