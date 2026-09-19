# API / Server Contract

## Implemented Contract

The application uses Route Handlers for mutations and the Auth.js-equivalent `/api/auth/*` endpoints for sign-in/session/sign-out. `GET /api/events` returns `{ data: Event[], meta: { total, page, pages } }`, with 9 events per page. Query fields are `search`, `status`, and `page`; upcoming includes UPCOMING/ONGOING and past includes COMPLETED. PATCH accepts a non-empty subset of editable fields. Mutation requests require the authenticated session and a matching Origin header. POST/PATCH require JSON. Image values accept HTTPS URLs, an empty value, or the three bundled sample paths; dates require an ISO datetime with timezone. See the root README for setup and examples.

## 1. General Notes

The implementation may use:

- Next.js Route Handlers,
- Server Actions,
- or a combination.

Regardless of mechanism, preserve the contracts defined here.

Public reads do not require authentication.

Admin mutations require authentication and authorization.

---

## 2. Response Convention

If using JSON APIs:

### Success

```json
{
  "data": {}
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid event data",
    "fields": {}
  }
}
```

Do not leak internal stack traces.

---

## 3. Authentication

### Login

`POST /api/auth/login` or Auth.js equivalent.

Input:

```json
{
  "email": "admin@example.com",
  "password": "********"
}
```

Outcomes:

- `200` authenticated
- `400` invalid request
- `401` invalid credentials

### Logout

`POST /api/auth/logout` or framework equivalent.

Outcome:

- session invalidated
- redirect to `/admin/login`

---

## 4. Get Events

`GET /api/events`

Authentication: No

Response:

```json
{
  "data": [
    {
      "id": "event_id",
      "title": "IEEE Event",
      "description": "...",
      "date": "2026-09-24T09:00:00.000Z",
      "location": "Institut Teknologi Bandung",
      "status": "UPCOMING",
      "imageUrl": null
    }
  ]
}
```

Optional later query parameters:

- `search`
- `status`
- `page`
- `limit`

---

## 5. Get Event Detail

`GET /api/events/:id`

Authentication: No

Errors:

- `404 EVENT_NOT_FOUND`

---

## 6. Create Event

`POST /api/events`

Authentication: Admin required

Input:

```json
{
  "title": "IEEE Technology Conference",
  "description": "Event description",
  "date": "2026-09-24T09:00:00.000Z",
  "location": "Institut Teknologi Bandung",
  "status": "UPCOMING",
  "imageUrl": "https://example.com/image.jpg"
}
```

Validation required server-side.

Outcomes:

- `201` created
- `400` validation error
- `401` unauthenticated
- `403` unauthorized

---

## 7. Update Event

`PATCH /api/events/:id`

Authentication: Admin required

Input: validated editable event fields.

Outcomes:

- `200` updated
- `400` validation error
- `401`
- `403`
- `404`

---

## 8. Delete Event

`DELETE /api/events/:id`

Authentication: Admin required

Outcomes:

- `200` or `204`
- `401`
- `403`
- `404`

UI must ask for confirmation before invoking this operation.

---

## 9. Error Codes

Recommended application codes:

```text
VALIDATION_ERROR
INVALID_CREDENTIALS
UNAUTHENTICATED
FORBIDDEN
EVENT_NOT_FOUND
CONFLICT
INTERNAL_ERROR
```

---

## 10. Revalidation

After create/update/delete:

- revalidate event list
- revalidate affected event detail where relevant
- refresh admin summary if it contains derived counts
