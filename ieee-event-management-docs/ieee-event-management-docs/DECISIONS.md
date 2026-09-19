# Technical Decision Log

## ADR-001 — Monolithic Next.js Fullstack

**Decision:** Use one Next.js App Router application for public UI, admin UI, and backend server logic.

**Reason:** Small project scope, simpler integration, less operational overhead, easier evaluation.

---

## ADR-002 — PostgreSQL + Prisma

**Decision:** Use PostgreSQL with Prisma.

**Reason:** Strong persistence model, type-safe ORM, migrations, easy local setup, appropriate for CRUD event management.

---

## ADR-003 — Server-Side Authentication

**Decision:** Use Auth.js credentials/session or equivalent secure server-side session.

**Reason:** Admin management must be protected reliably. Frontend-only/localStorage authentication is insufficient.

---

## ADR-004 — Zod Validation

**Decision:** Use Zod for request/form schemas.

**Reason:** Type-safe validation and reusable schema definitions.

---

## ADR-005 — Public vs Admin Layout Separation

**Decision:** Public pages use an event/conference visual style; admin uses a dashboard shell.

**Reason:** Different user goals require different information architecture.

---

## ADR-006 — ID-Based Event Route First

**Decision:** Use `/events/[id]` for the core version.

**Reason:** Lower scope and no need to introduce slug-generation/uniqueness behavior. Slugs can be added later.

---

## ADR-007 — Image URL Before Upload Infrastructure

**Decision:** Start with optional `imageUrl`.

**Reason:** Image upload is SHOULD HAVE and should not block core CRUD functionality.

---

## ADR-008 — Explicit Event Status

**Decision:** Persist event status as an enum.

**Reason:** `status` is explicitly required and persisted status is simpler to manage/explain for probation scope.
