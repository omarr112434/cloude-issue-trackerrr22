# cloude-issue-trackerrr22
Starter application used across the Cloud Computing and Cloud Security  labs. 
realG

## Lab 3 — Application and API Design

The Cloud Issue Tracker now has a documented three-layer architecture and a REST API contract for create, view and status-change operations. The backend project is initialised and its data service reads and writes issues in backend/data/issues.json. See the files in /docs before implementing the API routes.

## Lab 4 — REST API with Node.js and Express

The backend is now a working Express REST API that implements `docs/api-contract.md` and stores issues in `backend/data/issues.json`, so they survive a server restart.

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev
```

The API listens on `http://localhost:3000`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/issues` | View all issues |
| POST | `/api/issues` | Create an issue |
| PATCH | `/api/issues/{id}/status` | Change an issue status |

Tests: `docs/api-test-plan.md`, the Postman collection `evidence/lab-04-postman-collection.json` and `backend/requests.http`.
