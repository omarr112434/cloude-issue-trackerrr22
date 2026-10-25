# Cloud Issue Tracker (Lab 5 complete project)

A small full-stack app: a static HTML/CSS/JS frontend, an Express REST API and a Neon Postgres database.
Both the frontend and the API deploy to Vercel.

**All the code from Lab 5 is already here.** You do not write code in this lab: you read it, run it,
and fill in the placeholders listed below.

## The only things you fill in

| When | Where | Placeholder | Put in |
|---|---|---|---|
| Part 9 | `backend/.env` | `DATABASE_URL=` (empty) | Your Neon connection string |
| Part 10 | Vercel API project → Environment Variables | `DATABASE_URL`, `CORS_ORIGINS`, `NODE_ENV` | Neon string, `http://localhost:8080`, `production` |
| Part 11 | `frontend/js/config.js` | `YOUR-API-PROJECT` | Your Vercel API domain name |
| Part 12 | Vercel API project → `CORS_ORIGINS` | add your frontend | `http://localhost:8080,https://<your-web-project>.vercel.app` |
| Part 13 | `frontend/vercel.json` | `YOUR-API-PROJECT` | The same API domain as in `config.js` |

Search the project for `YOUR-` to find every placeholder in the code.

## Where the data is stored

`backend/services/issueService.js` chooses the storage automatically:

| `DATABASE_URL` | Storage used | Lab parts |
|---|---|---|
| empty | `backend/data/issues.json` (Lab 4 version, `jsonIssueService.js`) | Parts 1 to 8 |
| set | Neon Postgres (`neonIssueService.js`) | Part 9 onwards, required on Vercel |

When the backend starts, the terminal prints which storage is in use.

## Run locally

```bash
# Terminal 1
cd backend
npm install
npm run dev               # http://localhost:3000/api/health

# Terminal 2
cd frontend
npm install
npm start                 # http://localhost:8080
```

`node --watch` does not reload after a `.env` change: stop and restart `npm run dev` after editing `.env`.

## Folders

| Folder | Purpose | Deployed as |
|---|---|---|
| `frontend/` | Browser app (`index.html`, `js/config.js`, `js/app.js`, `vercel.json`) | Vercel project, Root Directory `frontend`, Framework Preset Other |
| `backend/` | Express REST API (`server.js`, routes, controller, services) | Vercel project, Root Directory `backend` (Express detected automatically) |
| `docs/` | API contract, test plan, quick deployment guide | not deployed |
| `evidence/` | Postman collection | not deployed |

## Secrets

- `backend/.env` is listed in `.gitignore`: check `git status` before every commit; it must never appear.
- `DATABASE_URL` lives only in `backend/.env` and in the Vercel API project settings.
- Nothing in `frontend/` is secret: every visitor can read it.
