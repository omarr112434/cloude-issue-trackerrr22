# Lab 3 — Cloud Issue Tracker Architecture

## 1. Application Goal

The Cloud Issue Tracker lets users report simple technical issues (for example Wi-Fi or projector problems in a teaching lab), see every reported issue and mark an issue as resolved.

In Lab 2 everything lived in the browser: the interface, the application logic and a temporary array of issues. Refreshing the page lost every new issue, and each user only saw their own copy. From Lab 3 the application is split into three layers, each with one responsibility:

```text
1. Browser / Frontend         presents data and collects user actions
        |
        |  HTTP + JSON
        v
2. REST API (Node.js + Express)  applies the server-side rules and exposes controlled operations
        |
        |  data operations
        v
3. Local data layer           stores the application state (backend/data/issues.json for now)
```

The frontend never stores the authoritative data. It asks the API, and only the API talks to the data layer.

## 2. Functional Scope

The application supports exactly three operations:

| Operation | Endpoint |
|---|---|
| Create an issue | `POST /api/issues` |
| View all issues | `GET /api/issues` |
| Change an issue status | `PATCH /api/issues/{id}/status` |

Editing or deleting issues, users and logins are out of scope for this stage.

## 3. Request Flow

### Create issue

```text
User → Frontend form → POST /api/issues → API validation → Data layer
     ← Render created issue ← 201 + JSON ←──────────────────┘
```

1. The user fills in the form (title, description, priority) and clicks Submit.
2. The frontend sends `POST /api/issues` with the form data as JSON.
3. The API validates the data: title and description present and within their length limits, priority one of Low, Medium or High. If anything is invalid it stops and returns `400` with a `VALIDATION_ERROR` message.
4. The data layer stores the issue and gives it a server-generated `id`, the status `Open` and a `createdAt` timestamp.
5. The API replies `201 Created` with the complete new issue as JSON.
6. The frontend adds the new issue to the list on screen.

### View issues

```text
Page load → GET /api/issues → API → Data layer
          ← Render list ← 200 + JSON array ←──┘
```

1. When the page loads, the frontend sends `GET /api/issues`.
2. The API asks the data layer for every stored issue.
3. The API replies `200 OK` with a JSON array, or an empty array `[]` when there are no issues. An empty list is not an error.
4. The frontend renders one card per issue, or "No issues yet" when the array is empty.

### Change status

```text
Button → PATCH /api/issues/{id}/status → API validation → Data layer
       ← Re-render issue ← 200 + updated JSON ←──────────┘
```

1. The user clicks the status button on one issue.
2. The frontend sends `PATCH /api/issues/{id}/status` with a body such as `{"status": "Resolved"}`.
3. The API validates two things:
   - the new status is an allowed value, `Open` or `Resolved` (otherwise `400 Bad Request`);
   - an issue with that `{id}` exists (otherwise `404 Not Found`).
4. The data layer updates only the `status` field of that issue.
5. The API replies `200 OK` with the full updated issue as JSON.
6. The frontend re-renders that issue with its new status.

## 4. Trust Boundaries

```text
USER-CONTROLLED SIDE                    APPLICATION-CONTROLLED SIDE

Browser input ──── HTTP request ────▶  REST API  ────▶  Data
      ▲                                    │
      └──────────── JSON response ◀────────┘
```

**User-controlled side:** the browser, the form fields, the buttons and every HTTP request that leaves the browser. The user can change any of it with the browser Developer Tools, curl or Postman, so every request is untrusted until the API has validated it.

**Application-controlled side:** the REST API and the data layer. Only our code runs here, and the data can only be reached through the API.

**The boundary is the HTTP request**, and these rules apply to it:

1. The API validates every request. Checks in the frontend are only for convenience and fast feedback, never for security.
2. The browser never talks to the data layer directly.
3. The client cannot choose the server-owned fields `id`, `status` (on create) or `createdAt`; the API ignores them if they are sent.
4. The API returns only what the frontend needs and never leaks internal errors or stack traces; unexpected failures return a general `500 INTERNAL_ERROR`.
5. The frontend shows issue text as plain text (`textContent`), never as HTML.
