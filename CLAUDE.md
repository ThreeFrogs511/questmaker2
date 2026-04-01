# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run test         # Run unit tests (test/unit/**/*.test.ts)
npm run test:integration  # Run integration tests (test/integration/**/*.test.ts)
npm run test:all     # Run all tests
```

Tests use the Node.js `tsx` test runner (not Jest/Vitest). Run a single test file directly: `npx tsx --test test/unit/path/to/file.test.ts`

Local development with Docker (PostgreSQL on port 5433 + MongoDB):
```bash
docker compose --env-file .env.docker up
```

## Architecture

**Full-stack Next.js 16 (App Router)** with TypeScript. Retro/pixel art RPG task manager where users manage real-life tasks as quests.

### Dual Database Setup
- **PostgreSQL (Neon)**: Users, sessions, quests (`todo`), rate limiting. Raw SQL via `postgres` client — no ORM. Connection in [server/connexion.ts](server/connexion.ts).
- **MongoDB (Atlas)**: Campaign narrative content (node-based story trees, choices, combat encounters). The `dnd_campaign_index` table in PostgreSQL maps campaign IDs to MongoDB `_id` strings.

### Data Flow & Auth
Session-based auth with HTTP-only cookies. [context/context.tsx](context/context.tsx) wraps the entire app as `UserDataProvider`, calling `/api/me` on load to rehydrate session. Protected pages check session and redirect to `/login` or `/characterCreation` if needed.

### State Management (Zustand stores in [stores/](stores/))
Six domain-specific stores:
- `useUserStore` — current user character stats, XP, coins
- `useCharacterCreationStore` — character creation draft with ability point allocation
- `useJournalStore` — quest list with pagination
- `useInventoryStore` — player items
- `useNarrationStore` — active campaign narration node state
- `useCombatStore` — turn-based combat encounter state

### Game Logic ([classes/](classes/))
Business logic is encapsulated in TypeScript classes separate from React:
- `Engine.tsx` — campaign narration orchestrator (processes nodes, ability checks, combat triggers)
- `Character.tsx` — character stat calculation and creation
- `Quest.tsx` — quest CRUD helpers
- `AbilityChecks.tsx` — D&D-style d20 ability check rolls
- `CombatSystem/` — turn-based combat with `Combat`, `Enemy`, and action hooks

### API Routes ([app/api/](app/api/))
RESTful routes with input validation middleware from [middlewares/](middlewares/). Quest completion (`/api/todo/[id]`) applies rate limiting (5 completions/hour) via a `quest_rate_limit` table using SQL transactions.

### Schema
See [db.sql](db.sql) for the full PostgreSQL schema. Key tables: `users` (character stats + profile), `sessions`, `todo` (quests), `quest_rate_limit`, `dnd_campaign_index`.

## Key Conventions
- ES modules (`"type": "module"` in package.json)
- Strict TypeScript — shared types in [types/types.tsx](types/types.tsx)
- UI built with [pixel-retroui](https://pixel-retroui.vercel.app/) component library + Tailwind CSS 4
- Audio via `use-sound` (Howler.js under the hood); sound files in [public/](public/)
