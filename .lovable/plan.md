# AI Workplace Productivity Assistant — Build Plan

A modern SaaS-style productivity dashboard with 3 AI tools wired to Lovable AI, plus stubs for the other two. localStorage-only history. Dark mode + copy/PDF export.

## Scope (first pass)
- Dashboard (home with feature cards, stats, recent activity)
- Email Generator (live AI)
- Meeting Notes Summarizer (live AI)
- AI Workplace Chatbot (live AI, streaming)
- Task Planner & Research Assistant: routed placeholder pages marked "Coming soon" so the sidebar is complete
- Settings page (theme, clear history)

## Design direction
- Modern SaaS, clean cards, soft shadows, subtle glassmorphism on header
- Palette tokens in `src/styles.css` (oklch): primary #2563EB, accent #06B6D4, success #22C55E, warning #F59E0B, slate-based neutrals; full dark mode tokens
- Typography: Inter (loaded via `<link>` in `__root.tsx` head)
- Sidebar (shadcn `Sidebar`, `collapsible="icon"`) + header with `SidebarTrigger`, dark-mode toggle, app title
- Mobile: sidebar collapses to off-canvas, single-column stacked cards

## Routes (TanStack file-based)
- `src/routes/__root.tsx` — load Inter, theme bootstrap, `SidebarProvider` shell, header, `<Outlet/>`
- `src/routes/index.tsx` — Dashboard
- `src/routes/email.tsx` — Email Generator
- `src/routes/meetings.tsx` — Meeting Summarizer
- `src/routes/tasks.tsx` — Task Planner (placeholder)
- `src/routes/research.tsx` — Research Assistant (placeholder)
- `src/routes/chatbot.tsx` — Chatbot
- `src/routes/settings.tsx` — Settings
- `src/routes/api/chat.ts` — streaming chat server route (AI SDK `streamText` → `toUIMessageStreamResponse`)

## AI integration
- Enable Lovable AI (Lovable AI Gateway). Provision `LOVABLE_API_KEY` via `lovable_api_key--create`.
- Provider helper: `src/lib/ai-gateway.server.ts` (openai-compatible, `https://ai.gateway.lovable.dev/v1`, `Lovable-API-Key` header)
- Default model: `google/gemini-3-flash-preview`
- Server functions in `src/lib/ai.functions.ts`:
  - `generateEmail({recipient, subject, purpose, tone})` → `generateText`, returns `{subject, body}` via `Output.object`
  - `summarizeMeeting({notes})` → `Output.object` with `summary`, `decisions[]`, `actionItems[]`, `deadlines[]`
- Chatbot uses `useChat` + `DefaultChatTransport({api:"/api/chat"})` against the server route; renders `message.parts`; markdown via `react-markdown`
- All AI pages show the Responsible AI disclaimer

## Components
- `src/components/app-sidebar.tsx` — sections with lucide icons
- `src/components/header.tsx` — trigger + theme toggle
- `src/components/theme-provider.tsx` + `theme-toggle.tsx` — class-based dark mode persisted in localStorage
- `src/components/output-card.tsx` — formatted output with Copy + Export PDF buttons
- `src/components/responsible-ai-notice.tsx`
- `src/components/dashboard-card.tsx`

## Persistence (localStorage only)
- `src/lib/history.ts` — namespaced keys per tool (`email-history`, `meeting-history`, `chat-thread`), capped recent N
- Dashboard "Recent Activity" reads from these
- Settings → "Clear history" button

## Extras included
- Copy-to-clipboard (navigator.clipboard) on every output
- Export PDF via `jspdf` (client-only) — `bun add jspdf`
- Dark mode toggle in header, persisted

## Dependencies to add
- `bun add ai @ai-sdk/react @ai-sdk/openai-compatible zod jspdf react-markdown lucide-react`
- (shadcn sidebar/tooltip/etc. are already present)

## Out of scope (this pass)
- Auth / cloud sync (no Lovable Cloud)
- Task Planner & Research Assistant AI logic (placeholder pages only)
- Voice input, confidence indicator, team workspace

## Verification
- Build passes; preview shows dashboard, sidebar nav, theme toggle
- Email + Meeting tools return structured AI output; Chatbot streams
- Copy + Export PDF work; history persists across reload
