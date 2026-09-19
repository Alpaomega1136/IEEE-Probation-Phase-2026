# Testing Strategy

## Runnable Checks

`npm run test:recovery` uses a production build with an intentionally unreachable database to verify the public retry state and ensure event/authentication API errors do not expose database details. It starts and stops its own server on an available port and does not modify the project database.

Run `npm test` for Zod validation, timezone round-trips, and bcrypt checks. With the seeded development application running, use `npm run test:e2e` for Playwright acceptance tests including direct unauthorized requests, CRUD persistence, malformed inputs, origin checks, pagination, failure feedback, sign-out, and desktop/mobile layouts. Browser screenshots are generated under ignored `.local/screenshots`. Run `npm run lint`, `npm run typecheck`, and `npm run build` for the quality gate. See the root README for browser installation and environment setup.

## 1. Goal

Testing should protect critical probation requirements without creating excessive infrastructure.

Priority:

1. Authentication
2. Authorization
3. Event CRUD
4. Validation
5. Public data flow
6. Empty/error states
7. Responsive smoke testing

---

## 2. Validation Tests

Test shared event schema:

- valid event accepted
- empty title rejected
- empty description rejected
- invalid date rejected
- empty location rejected
- invalid status rejected
- invalid optional image URL rejected

---

## 3. Authentication Tests

### Valid Login
Given correct credentials, admin receives a session and reaches `/admin`.

### Invalid Login
Incorrect credentials do not create a session.

### Protected Route
Unauthenticated request to protected admin area is rejected/redirected.

### Logout
Logout invalidates access.

---

## 4. Authorization Tests

Directly call protected mutation without authenticated session:

- create → rejected
- update → rejected
- delete → rejected

Do not rely only on UI tests for this.

---

## 5. CRUD Tests

### Create
- valid event persists
- invalid event does not persist

### Read
- event list returns stored events
- event detail returns correct event
- missing ID returns not found

### Update
- valid update persists
- invalid update rejected
- missing event handled

### Delete
- valid delete removes record
- missing event handled

---

## 6. Public State Tests

Manual or component-level checks:

### Loading
Skeleton/spinner visible while data is pending.

### Empty
No-data state is understandable.

### Error
Failure produces safe error message and retry where appropriate.

---

## 7. Manual Acceptance Checklist

### Desktop
- [ ] Navbar
- [ ] Home
- [ ] Event grid
- [ ] Event detail
- [ ] Admin login
- [ ] Dashboard
- [ ] CRUD
- [ ] Delete modal

### Mobile
- [ ] Public menu
- [ ] Event cards
- [ ] Event detail
- [ ] Admin navigation
- [ ] Forms
- [ ] Dialogs
- [ ] No horizontal overflow

---

## 8. Build Quality Gate

Before submission:

```text
lint passes
typecheck passes
tests pass
production build succeeds
database migration works from clean setup
README setup steps reproduce the project
```
