# Mindful Coach — Frontend

Next.js chat UI for the FastAPI mental coach backend (`POST /api/chat`).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes `npm`)
- Backend running locally (from repo root):

```bash
uv sync
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

During `npm run dev`, requests to `/api/chat` are proxied to `http://127.0.0.1:8000` (see `next.config.ts`). Override with `BACKEND_URL` in `.env.local` if needed.

## Environment variables

| Variable | When | Purpose |
|----------|------|---------|
| `BACKEND_URL` | Local dev only | FastAPI origin for Next.js rewrites (default `http://127.0.0.1:8000`) |
| `NEXT_PUBLIC_API_URL` | Split deploy | Full backend URL if API is on another host |

Copy `.env.local.example` to `.env.local` only if you need overrides.

## Deploy on Vercel

Deploy from the **repository root** (not `frontend/` alone). Root `vercel.json` routes:

- `/api/chat` → Python `api/index.py`
- everything else → Next.js app

Set `OPENAI_API_KEY` in the Vercel project **Environment Variables**, then deploy.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
