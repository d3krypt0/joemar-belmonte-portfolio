# Code Review

Thorough review of the AI Automation Portfolio (Next.js 16 + Vercel AI SDK).
Checklist: Security, Error Handling, Performance, Types, Testing.
Severity: **critical** (fix now) / **warning** (fix soon) / **info** (nice-to-have).

Note: security findings #1, #2, #4 from the earlier audit are already remediated
(zod role validation, per-IP rate limit, security headers). Below covers the rest.

---

## 1. Security

| Severity | Location | Finding & Fix |
|---|---|---|
| info | `app/api/chat/route.ts` (rate limiter) | In-memory limiter is **per serverless instance**, so the global cap is loose under Vercel's fan-out. Fine for a portfolio; for a hard cap move to `@upstash/ratelimit` + Vercel KV. |
| info | `lib/prompt.ts.bak` | Stale 5.8 KB backup of the system prompt sits on disk. Gitignored (`*.bak`) so not committed, but delete it to avoid clutter / accidental future commit. |
| pass | SQL injection | No database / SQL layer. N/A. |
| pass | XSS | `react-markdown` v9 default `urlTransform` strips `javascript:` URLs; no `dangerouslySetInnerHTML`; no `rehype-raw`. Safe. |
| pass | Hardcoded secrets | None. Keys read from `process.env`, server-side only, never committed. |
| pass | Auth | Public marketing site by design; only sensitive surface is `/api/chat`, now rate-limited + payload-validated. |

## 2. Error Handling

| Severity | Location | Finding & Fix |
|---|---|---|
| warning | `components/ChatApp.tsx:44` | `onError` only resets the avatar — **chat failures are invisible to the user**. On 429/500/network drop the input clears and nothing appears. Surface `useChat`'s `error` value: render an inline "Message failed — retry" row with a `reload()` button. |
| info | `app/api/chat/route.ts:21` | `await req.json()` on malformed body now caught by the outer `try` → generic 500. Acceptable, but a malformed-JSON case is really a 400, not 500. Wrap the parse and return `err400('Invalid JSON.')`. |
| pass | `components/ErrorBoundary.tsx` | Class boundary wraps the app in `app/layout.tsx:44`. Good. |
| pass | `app/api/chat/route.ts:56-60` | Full error logged server-side, generic message to client. Correct. |

## 3. Performance

| Severity | Location | Finding & Fix |
|---|---|---|
| info | `components/ChatApp.tsx:1077` | `detectProjectsInText(triggerText)` runs in the message-bubble render body, so it re-scans the full assistant text against all keywords **on every streaming re-render** (many/sec). Wrap in `useMemo(() => detect..., [triggerText, isUser])`. |
| info | `components/ChatApp.tsx:1172` | Single 1172-line client component. Heavy first-load JS. Consider splitting the project-card / nav subtrees into separate lazy `next/dynamic` chunks. |
| pass | scroll/pointer | Uses `useScroll` + `useMotionValueEvent` (`ChatApp.tsx:5`), not `useState`/`addEventListener`. Matches CLAUDE.md rules. |
| pass | icon imports | `lucide-react` named imports (`ChatApp.tsx:6`) → tree-shaken, not whole-library. |

## 4. Types

| Severity | Location | Finding & Fix |
|---|---|---|
| info | `components/ChatApp.tsx:49` | `localStorage.getItem('theme') as Theme \| null` then narrowed by the `=== 'light' \|\| 'dark'` check below — assertion is redundant but harmless. Could drop the cast and let the guard do the narrowing. |
| pass | `as any` / `@ts-ignore` | None in the codebase. |
| pass | DOM casts | `e.currentTarget as HTMLButtonElement` casts are correct and localized to event handlers. |
| pass | `tsc --noEmit` | Exit 0, clean. |

## 5. Testing

| Severity | Location | Finding & Fix |
|---|---|---|
| warning | repo-wide | **Zero tests.** The two pieces with real logic are untested: <br>• `lib/projects.ts` `detectProjectsInText` — add unit tests (keyword hit, dedup via `seen`, no-match → `[]`, case-insensitivity). <br>• `app/api/chat/route.ts` — add tests for role rejection (system → 400), oversized payload (>20 msgs / >8000 chars → 400), and rate-limit (13th call → 429). |
| info | edge cases | `detectProjectsInText` edge: empty string and very long text both fine, but worth pinning in a test so a future regex refactor can't regress silently. |

---

## Priority order
1. **warning** — surface chat errors to the user (`ChatApp.tsx:44`).
2. **warning** — add tests for `detectProjectsInText` + `/api/chat` guards.
3. **info** — `useMemo` the project detection; delete `lib/prompt.ts.bak`; 400 on malformed JSON.
