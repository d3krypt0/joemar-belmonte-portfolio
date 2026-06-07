# PROJECT_MEMORY.md
Living snapshot of the Joemar Belmonte AI Automation Portfolio. Auto-updated by the PostToolUse hook; only the Recent Changes section is machine-written. All other sections are human/agent-maintained.

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2.7 (App Router) | All pages are `'use client'`; statically pre-rendered on Vercel |
| Styling | Tailwind CSS v3.4 | Colors entirely via CSS variables; no hardcoded palette in components |
| Animation | `motion` v11 (`motion/react`) | UI transitions, WelcomeView chips, ChatView enter/exit via AnimatePresence |
| Icons | `lucide-react` v0.511 | ArrowUp, ArrowLeft, ArrowDown, ChevronLeft, ChevronRight, Loader2, Sun, Moon, ChevronDown |
| Fonts | Syne (display) + Geist Sans (body) + Geist Mono (mono) | All loaded via `next/font`; never `<link>` to Google Fonts |
| AI runtime | Vercel AI SDK v4 (`ai`) | `useChat` hook on client; streaming POST on server |
| AI providers | `@ai-sdk/groq` v1.2.9 (primary), `@ai-sdk/openai` v1.2.19 (fallback) | Groq Llama-3.3-70B → OpenAI gpt-4o-mini; keys in `.env.local` only |
| Markdown | `react-markdown` v9 + `remark-gfm` | Renders assistant message content in ChatView |

---

## Pages & Routes

| Route | File | What it renders |
|---|---|---|
| `/` | `app/page.tsx` | Full single-page app: sticky chat section (WelcomeView / ChatView) + scrollable static portfolio below |
| `/api/chat` | `app/api/chat/route.ts` | POST streaming endpoint; Groq primary, OpenAI fallback; `maxDuration: 30` |

---

## Components

### Inline in `app/page.tsx`
| Component | Purpose |
|---|---|
| `NavBar` | Fixed top nav; single-line, height <= 80px; logo + theme toggle + "Hire Me" CTA |
| `ScrollNav` | Floating vertical nav dots (anchored to sections); reveals after scrolling past chat |
| `WelcomeView` | Initial chat screen with avatar, greeting, and 4 WELCOME_CHIPS suggestion buttons |
| `ChatView` | Active chat UI: messages list, typing indicator, ChipsScroller, InputForm, back button |
| `MessageRow` | Single message row: user bubble or assistant bubble with react-markdown |
| `BookingCard` | Inline card injected after assistant messages mentioning booking/call intent |
| `ChatProjectCard` | Inline card injected when assistant response mentions a named project (keyword-matched) |
| `ChipsScroller` | Scrollable chip row with left/right arrow buttons; double-RAF scroll measurement; ResizeObserver |
| `InputForm` | Textarea + send button; auto-resize on typing; Enter to submit, Shift+Enter for newline |
| `ThemeToggle` | Sun/Moon icon button; toggles `data-theme` on root div |
| `ProfilePhoto` | Circular avatar photo in WelcomeView header |
| `TypingBubble` | Three-dot animated indicator shown while `isLoading` |

### External component files
| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout: Syne + Geist fonts via `next/font`, ErrorBoundary wrapper, global metadata |
| `app/globals.css` | CSS variable theme tokens (dark/light), Tailwind layers, chip/button styles, marquee keyframes, Calendly height overrides |
| `components/StaticSection.tsx` | Full scrollable portfolio; contains: `SectionDivider`, `ServicesSection` (with inline `PricingTable`), `WorkSection`, `ContactSection` |
| `components/CalendlyWidget.tsx` | Inline Calendly widget; `next/dynamic({ ssr: false })`; dark/light theme sync via MutationObserver on `data-theme`; `overflow: clip` wrapper |
| `components/ErrorBoundary.tsx` | React class error boundary wrapping entire app; shows reload prompt on uncaught render errors |
| `components/ProjectCard.tsx` | Animated project card with IntersectionObserver reveal, 3-zone layout (problem/solution/result), embedded WorkflowPreview |
| `components/WorkflowPreview.tsx` | SVG-based workflow diagram; renders 6 pattern types: `pipeline`, `hub`, `grid`, `branch`, `funnel`, `launch` |
| `components/TechMarquee.tsx` | Pure-CSS infinite marquee of tech stack icons; zero animation libraries; icons from `cdn.simpleicons.org` |
| `components/Avatar.tsx` | SVG avatar with animated idle/thinking/replying states and randomised blink timing |

### Data & config
| File | Purpose |
|---|---|
| `lib/projects.ts` | `ALL_PROJECTS` array (7 projects), shared types (`ProjectData`, `PipelineNode`, `PatternType`), `detectProjectsInText()` keyword matcher |
| `lib/prompt.ts` | `SYSTEM_PROMPT` constant — Joemar's full AI persona, skills, projects, experience, and response guidelines |
| `.claude/settings.json` | PostToolUse hook config: runs `update_memory.ps1` after every Edit or Write tool call |
| `.claude/update_memory.ps1` | PS5.1-compatible hook script; appends timestamped entry to `## Recent Changes`; caps at 10 entries; skips PROJECT_MEMORY.md and itself |

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
| `--grid-color` | `rgba(0,212,255,0.022)` | `rgba(0,100,150,0.04)` |
| `--glow-color` | `rgba(0,212,255,0.18)` | `rgba(0,122,171,0.15)` |
| Font: display | Syne 700/800 (`--font-display`) | same |
| Font: body | Geist Sans (`--font-sans`) | same |
| Font: mono | Geist Mono (`--font-mono`) | same |
| Corner radius scale | all-soft: `rounded-full` (pills/chips/avatars), `rounded-2xl` (cards/widgets), `rounded-lg` (buttons) | same |
| Theme strategy | `data-theme` attribute on root div; CSS variable sets; toggled by ThemeToggle button | — |

---

## Key Behaviors

### Chat scroll
- `messagesContainerRef` on the `overflow-y-auto` messages container; scroll is `el.scrollTop = el.scrollHeight` (direct assignment — never `scrollTo({behavior:'smooth'})` which propagates to window on some Chromium builds).
- `setTimeout(50ms)` guard in `handleChipClick` resets `window.scrollY` if a scroll escaped during WelcomeView→ChatView transition.

### Chip click / focus scroll prevention
- All chip buttons (WelcomeView and ChipsScroller) use `onMouseDown={(e) => e.preventDefault()}` to block browser focus-on-click scroll.

### ChipsScroller arrows
- Double-RAF (`requestAnimationFrame` twice) defers initial `checkArrows` call to ensure chip flex overflow is committed before measuring `scrollWidth`.
- `ResizeObserver` + `scroll` listener keep arrow visibility in sync on resize or content change.

### Calendly widget
- Container heights: 750px (base) / 850px (sm) / 900px (lg) in `globals.css` — sized to show Calendly's full calendar + time slots + booking form without triggering the iframe's internal scrollbar.
- `overflow: clip` on wrapper (not `overflow: hidden`) — clips rounded corners visually without creating a scroll container.

### PostToolUse memory hook
- Fires after every Edit or Write tool call in Claude Code.
- Reads JSON from stdin, extracts `tool_input.file_path`, skips self-referential files.
- Prepends `- YYYY-MM-DD HH:mm — filename: toolName via Claude Code` to `## Recent Changes`.
- Caps at 10 entries. PS5.1-compatible (no `??` operator, no 3-arg `Join-Path`, em dash via `[char]0x2014`).

---

## Projects (ALL_PROJECTS)

| Name | Type | Pattern | Accent |
|---|---|---|---|
| AI Media Monitoring & PR System | Make.com Automation | pipeline | `#7C3AED` |
| n8n Lead Qualifier | CRM Automation Pipeline | branch | `#EA4B71` |
| 6-Agent AI Dropshipping System | AI Automation Architecture | hub | `#0078B8` |
| DropshipIQ: Product Intelligence Platform | Full-Stack Intelligence Platform | funnel | `#0090CC` |
| MenuCostingAI | SaaS Product — Freemium | branch | `#008060` |
| Food & Business Costing Calculator | Commercial Digital Product | grid | `#B45309` |
| DropSignal Trend-to-Store Autopilot | End-to-End eCommerce Automation | (pipeline-only) | `#7C3AED` |

---

## Pricing Tiers (PricingTable in ServicesSection)

| Tier | Price | Highlight |
|---|---|---|
| Simple Automation | $300 – $800 | no |
| Multi-Agent System | $1,000 – $3,000 | yes (accent border + tinted bg) |
| Full eCommerce Build | $2,000+ | no |

---

## Known Issues

- Calendly widget may still show an internal scrollbar on very short viewports (< 600px height) — no current workaround beyond the 750px minimum.
- `detectProjectsInText()` keyword matching is case-insensitive substring; overly broad keywords could match unintended project cards (monitor for false positives as prompt evolves).

---

## Recent Changes

- 2026-06-08 00:39 — ProjectCard.tsx: Edit via Claude Code
- 2026-06-08 00:38 — StaticSection.tsx: Edit via Claude Code
- 2026-06-08 00:32 — StaticSection.tsx: Edit via Claude Code
- 2026-06-08 00:13 — prompt.ts: Edit via Claude Code
- 2026-06-08 00:13 — projects.ts: Edit via Claude Code
- 2026-06-08 00:13 — projects.ts: Edit via Claude Code
- 2026-06-08 00:02 — projects.ts: Edit via Claude Code
- 2026-06-07 00:08 — StaticSection.tsx: Edit via Claude Code
- 2026-06-07 00:08 — StaticSection.tsx: Edit via Claude Code
- 2026-06-06 23:57 — prompt.ts: Edit via Claude Code
