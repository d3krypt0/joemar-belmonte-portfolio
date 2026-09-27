# Interactive Portfolio

## Project

This is Joemar Belmonte's AI automation portfolio. The home page combines a conversational portfolio assistant with the static portfolio sections below it.

## Stack and commands

- Next.js App Router with React and TypeScript.
- Tailwind CSS 3 plus CSS variables in `app/globals.css`.
- Motion for UI animation; respect reduced-motion preferences.
- Vercel AI SDK v4 streams chat responses from the server.
- `npm run dev` starts the local development server.
- `npm run build` creates the production build; `npm start` serves it.
- `npm run lint` runs ESLint.
- Dependencies are managed by `package-lock.json`; use `npm ci` when a clean install is needed.

## Main paths

- `app/page.tsx`: composes `ChatApp` and `StaticSection`.
- `components/ChatApp.tsx`: chat state, welcome screen, message list, input, theme, and chat error UI.
- `app/api/chat/route.ts`: validates chat requests, rate limits by IP, selects Groq or OpenAI, and returns the AI SDK data stream.
- `lib/prompt.ts`: server-side assistant persona and portfolio facts. Keep provider secrets out of this file.
- `lib/projects.ts`: project data and project-card matching used in chat.
- `components/StaticSection.tsx`: portfolio sections; supporting visuals live in the other files under `components/`.
- `app/layout.tsx`: root metadata and local/package font setup.
- `PROJECT_MEMORY.md`: expanded architecture and design notes. Confirm details in source when they may have changed.

## Chat contract

The client uses `useChat` from `ai/react` with `POST /api/chat`. Requests contain `messages`; the server accepts only `user` and `assistant` roles, with string content. Keep the system prompt server-owned. Do not return provider errors, credentials, or SDK internals to the browser. Provider diagnostics belong in server logs, while the UI should show a safe, actionable failure message.

The route uses `GROQ_API_KEY` first and `OPENAI_API_KEY` when no Groq key is configured. Set at least one in the ignored `.env.local` file for local AI replies. `.env.example` documents the variable names. Never read secrets into logs, commits, or this guide.

## Change guidance

- Trace behavior through the client, route, and prompt before changing chat behavior.
- Keep request validation, payload limits, and rate limiting at the API boundary.
- Preserve accessibility, keyboard submission, retry behavior, and reduced-motion support.
- Use fonts already packaged or stored in `fonts/`; avoid build-time downloads of Google Fonts.
- Do not add providers, dependencies, or configuration unless the requested behavior requires them.
- Check existing project instructions in `CLAUDE.md` and consult current source when instructions and implementation disagree.
