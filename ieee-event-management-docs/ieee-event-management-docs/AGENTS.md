# AGENTS.md — Rules for Coding Agents

This repository is an IEEE ITB Fullstack Developer probation project.

Before changing code, read:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. Relevant domain document:
   - `DATABASE.md`
   - `API.md`
   - `AUTH.md`
   - `DESIGN.md`
4. `TASKS.md`

---

## 1. Core Priorities

Implement in this order:

1. Correctness
2. Security
3. MUST HAVE requirements
4. Maintainability
5. Responsive UX
6. SHOULD HAVE improvements

Do not add optional features while required flows are broken.

---

## 2. Scope

Do not introduce unrelated product features.

Do not add:

- microservices
- event ticketing
- public accounts
- payments
- complex roles
- real-time infrastructure

unless explicitly requested.

---

## 3. TypeScript

- Use strict TypeScript.
- Avoid `any`.
- Prefer inferred or explicit domain types.
- Validate data crossing trust boundaries.
- Do not cast around type errors without justification.

---

## 4. React / Next.js

- Prefer Server Components by default.
- Use Client Components only for real interactivity.
- Keep component responsibility focused.
- Avoid giant page components.
- Reuse components when behavior/structure is genuinely shared.
- Do not create abstractions for one-off trivial code.

---

## 5. Styling

Follow `DESIGN.md`.

- Keep spacing consistent.
- Maintain responsive behavior.
- Avoid arbitrary visual patterns.
- Avoid excessive gradients/animation.
- Preserve accessibility and focus states.
- Public and admin layouts are intentionally different.

---

## 6. Backend

Every protected mutation must:

1. Authenticate.
2. Authorize.
3. Validate input.
4. Execute business/data operation.
5. Return predictable result/error.
6. Revalidate affected UI.

Never trust client input.

---

## 7. Database

Use Prisma for normal database access.

Do not use raw SQL unless it is necessary and documented.

When changing schema semantics:

- update `schema.prisma`
- create migration
- update `DATABASE.md`
- update tests

---

## 8. Authentication

- Never store plaintext passwords.
- Never expose password hashes.
- Never hardcode secrets.
- Never treat frontend route hiding as authorization.
- Use server-side session checks.

---

## 9. Validation

Use Zod schemas.

Prefer shared validation definitions where appropriate.

Frontend validation improves UX.

Server validation is mandatory for security/correctness.

---

## 10. Error Handling

Do not leak:

- database errors
- stack traces
- secrets

Map errors into stable application-level errors.

Provide useful user-facing messages.

---

## 11. Git

Use meaningful Conventional Commits when possible.

Examples:

```text
feat: add event database schema
feat: implement public event list
feat: add admin authentication
feat: implement event creation
fix: handle invalid event update
docs: update authentication flow
```

Avoid generic messages such as:

```text
update
fix
final
```

---

## 12. Testing

Prioritize:

- authentication
- authorization
- CRUD
- validation
- event-not-found
- empty/error states

Do not spend disproportionate effort on low-risk visual unit tests while core flows are untested.

---

## 13. Documentation

If implementation intentionally changes:

- requirements → update `PRD.md`
- architecture → update `ARCHITECTURE.md`
- schema → update `DATABASE.md`
- API contract → update `API.md`
- auth behavior → update `AUTH.md`
- design rules → update `DESIGN.md`

Do not silently diverge from documentation.

---

## 14. Dependency Rule

Before adding a dependency:

1. Check whether existing stack can solve the problem.
2. Add only if it materially improves correctness or maintainability.
3. Keep dependency count reasonable for the project scope.

---

## 15. Completion Rule

Before marking a task complete:

- feature works
- errors handled
- validation works
- responsive behavior checked
- auth/security checked if relevant
- lint/typecheck passes
- relevant tests pass
- docs updated if needed
