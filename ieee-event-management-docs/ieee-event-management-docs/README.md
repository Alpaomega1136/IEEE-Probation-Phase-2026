# IEEE ITB Event Management — Documentation Pack

This folder contains the implementation specification for the **IEEE ITB Event Management Web** probation project for the Fullstack Developer division.

The project is based on the Fullstack Developer requirements in the IEEE ITB Student Branch 2026/2027 Probation Guidebook, especially pages 13–17.

## Core Product

A lightweight event management platform with two user areas:

- **Public website**: browse events and view event details.
- **Admin area**: authenticated event management with create, edit, and delete capabilities.

## Recommended Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Zod
- Auth.js or secure session-based authentication

## Documentation Map

| File | Purpose |
|---|---|
| `PRD.md` | Product requirements and acceptance criteria |
| `DESIGN.md` | UI/UX and responsive design specification |
| `ARCHITECTURE.md` | Technical architecture and project structure |
| `SYSTEM_FLOW.md` | Public, admin, CRUD, and error flows |
| `DATABASE.md` | Data model, ERD, constraints, and migration plan |
| `API.md` | Backend/API contracts |
| `AUTH.md` | Authentication and authorization specification |
| `AGENTS.md` | Coding-agent rules for Codex |
| `TASKS.md` | Ordered implementation roadmap |
| `TESTING.md` | Test strategy and critical cases |
| `ENV.md` | Environment-variable specification |
| `README_PLAN.md` | Required final project README structure |

## Priority Rule

Implement **MUST HAVE** requirements before optional improvements.

MUST HAVE:

- Event List
- Event Detail
- Admin Login
- Admin Dashboard
- Create Event
- Edit Event
- Delete Event with confirmation
- Persistent database
- Validation
- Responsive UI
- Loading, Empty, and Error states

SHOULD HAVE features must never delay or replace unfinished MUST HAVE functionality.

## Source-of-Truth Order

When implementation decisions conflict, follow this order:

1. `PRD.md`
2. `ARCHITECTURE.md`
3. `DATABASE.md`, `API.md`, `AUTH.md`
4. `DESIGN.md`
5. `TASKS.md`
6. Existing implementation

If implementation changes an agreed architectural decision, update the relevant documentation.
