# API Test Plan: Issues API

T01–T09 were written in Lab 3, before the API existed, to define what "working correctly" means. Lab 4 added T10–T12 so that every error in `docs/api-contract.md` is covered, plus the Actual Result and Pass/Fail columns.

- Start the API from the `backend` folder with `npm run dev` (base URL `http://localhost:3000`).
- Requests: Postman collection `evidence/lab-04-postman-collection.json`, or `backend/requests.http` with the VS Code REST Client extension.
- T05 and T06 need an existing id: use one returned by GET or POST.
- T08: copy the content of `backend/data/issues.json` somewhere safe, replace it with `[]`, send the request, then paste the original content back. No restart is needed.

Actual results recorded on 18 Oct 2026 by sending each request to the local API.

| Test ID | Request | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|
| T01 | GET /api/issues | 200; JSON array returned. | 200; array with 1 issue | Pass |
| T02 | POST valid title, description, priority | 201; complete created issue returned. | 201; complete issue with a new UUID id, status Open and the current createdAt | Pass |
| T03 | POST missing title | 400; VALIDATION_ERROR. | 400; VALIDATION_ERROR: Title must contain between 3 and 100 characters. | Pass |
| T04 | POST invalid priority = Critical | 400; VALIDATION_ERROR. | 400; VALIDATION_ERROR: Priority must be Low, Medium or High. | Pass |
| T05 | PATCH existing issue status = Resolved | 200; returned status is Resolved. | 200; complete issue returned with status Resolved | Pass |
| T06 | PATCH status = Deleted | 400; VALIDATION_ERROR. | 400; VALIDATION_ERROR: Status must be Open or Resolved. | Pass |
| T07 | PATCH unknown issue ID | 404; ISSUE_NOT_FOUND. | 404; ISSUE_NOT_FOUND: Issue not found. | Pass |
| T08 | GET when no issues exist | 200; empty JSON array. | 200; [] | Pass |
| T09 | Send unexpected extra server-owned fields | Server ignores/rejects according to contract; client cannot choose authoritative id/status/createdAt. | 201; new UUID instead of HACKED-1, status Open instead of Resolved, current createdAt instead of 2000-01-01 | Pass |
| T10 | POST /api/issues with Content-Type: text/plain | 415; UNSUPPORTED_MEDIA_TYPE. | 415; UNSUPPORTED_MEDIA_TYPE: Content-Type must be application/json. | Pass |
| T11 | POST /api/issues with malformed JSON (trailing comma) | 400; VALIDATION_ERROR: Request body is not valid JSON. The server keeps running. | 400; VALIDATION_ERROR: Request body is not valid JSON. The server answered the next request normally. | Pass |
| T12 | PATCH /api/fake-url | 404; ROUTE_NOT_FOUND. | 404; ROUTE_NOT_FOUND: Route not found. | Pass |

## Persistence check

| Step | Result |
|---|---|
| POST /api/issues and note the id | 201; issue created and added to the end of `backend/data/issues.json` |
| Stop the server with Ctrl+C and start it again with `npm run dev` | Server restarted |
| GET /api/issues | The issue is still returned with the same id: Pass |
