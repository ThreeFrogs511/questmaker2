# Questmaker

**Live demo:** [questmaker2.vercel.app](https://questmaker2.vercel.app)

Questmaker is a productivity app with a role-playing game layer on top. Users create a D&D-style avatar, complete real-life tasks as "quests" to earn in-game coins, and spend those coins on items for their character. A D&D campaign is also integrated, playable directly as your avatar.

> This is an MVP — all core systems are functional but content is intentionally limited (one campaign chapter, a starter item catalogue). Think of it as an open beta.

---

## Features

- **Character creation** — choose a race, class, and distribute ability scores to build a unique avatar
- **Quest system** — create tasks, complete them to earn coins, undo completions if needed
- **Rate limiting** — completion is capped at 5 quests per hour to prevent abuse
- **Shop & inventory** — spend earned coins on items that appear in your character's inventory
- **D&D campaign** — play through a text-based campaign chapter as your avatar

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | pixel-retroui |
| Relational DB | PostgreSQL via Neon (serverless) |
| NoSQL DB | MongoDB Atlas |
| State management | Zustand |
| Auth | Session-based (HTTP-only cookies) |
| Deployment | Vercel |

---

## Running locally

The app connects to a cloud PostgreSQL database and a MongoDB cluster. You will need access to the environment variables (not included in the repository) to run it locally.

If you just want to explore the project, the live demo is fully functional.

If you have the required credentials:

```bash
npm install
# add your own .env.local with DATABASE_URL, MONGODB_URI, and related variables
npm run dev
```

---

## Project structure

```
app/          # Next.js App Router pages and API routes
classes/      # Business logic (Character, Quest)
components/   # React UI components
context/      # Auth/session context provider
stores/       # Zustand state stores
server/       # Database connection
types/        # Shared TypeScript types
middlewares/  # Input validation helpers
```

---

## License

MIT
