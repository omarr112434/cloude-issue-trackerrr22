# Lab 5 Quick Deployment Guide: Vercel + Neon

This is a short reference for the cloud half of Lab 5 (Parts 9 to 13). The Word lab sheet has the full explanations.
Finish and verify the local version (Parts 1 to 8) first.

## Architecture

```text
Browser
  | HTTPS (HTML, CSS, JS)              | fetch() / HTTPS + JSON
  v                                    v
Vercel project: frontend             Vercel project: API
(frontend/ folder, static files)     (backend/ folder, Express as one Vercel Function)
https://<web>.vercel.app             https://<api>.vercel.app
                                       |
                                       | SQL over TLS (DATABASE_URL)
                                       v
                                     Neon Postgres (issues table)
```

One GitHub repository, two Vercel projects. The only difference between them is the **Root Directory**.

## Part 9: Neon

1. Create a Neon project (`cloud-issue-tracker`, US East region).
2. In the SQL Editor run `backend/db/schema.sql`.
3. Paste the pooled connection string into `backend/.env` after `DATABASE_URL=`.
4. Restart `npm run dev`. The terminal now prints `Issue storage: Neon Postgres`; create an issue and find it in the Neon table.

## Part 10: API project on Vercel

| Setting | Value |
|---|---|
| Project Name | `cloud-issue-tracker-api` |
| Root Directory | `backend` |
| Framework Preset | Express (detected automatically) |
| Env `DATABASE_URL` | your Neon connection string |
| Env `CORS_ORIGINS` | `http://localhost:8080` (frontend added in Part 12) |
| Env `NODE_ENV` | `production` |

Test: `https://<api>.vercel.app/api/health` returns `{"status":"ok"}` and `/api/issues` returns the Neon issues.

## Part 11: Frontend project on Vercel

1. In `frontend/js/config.js` replace `YOUR-API-PROJECT` with your API domain. Commit and push.
2. Import the same repository again:

| Setting | Value |
|---|---|
| Project Name | `cloud-issue-tracker-web` |
| Root Directory | `frontend` |
| Framework Preset | Other |
| Build / Output / Install | leave defaults |
| Environment variables | none (the frontend has no secrets) |

A CORS error at this point is expected until Part 12.

## Part 12: Connect

In the API project set `CORS_ORIGINS=http://localhost:8080,https://<web>.vercel.app`, then **Redeploy**.
Verify GET, POST and PATCH in the Network tab and open the site on a second device.

## Part 13: Security headers

In `frontend/vercel.json` replace `YOUR-API-PROJECT` in the CSP `connect-src`, push, and check the headers with
`curl -I https://<web>.vercel.app` (Windows PowerShell: `curl.exe -I ...`).

## Secrets checklist

- `backend/.env` is never committed (`git status` must not list it).
- `DATABASE_URL` lives only in `.env` and the Vercel API project.
- Nothing in `frontend/` is secret: every visitor can read it.
