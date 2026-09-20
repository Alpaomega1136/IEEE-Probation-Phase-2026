# IEEE ITB Event Management

Mini fullstack event management application for the IEEE ITB Student Branch Fullstack Developer Probation Phase. Public users can browse events and read event details; authenticated admins can manage event data through a protected dashboard.

## Completed Features

- Public home, event list, event detail, and About pages.
- Public search, auto-updating status filtering, centered pagination, empty states, loading states, not-found/error states, and responsive desktop/mobile layouts.
- Admin login with credentials authentication.
- Protected admin event dashboard with row and card views.
- Create, edit, and delete event workflows.
- Delete confirmation dialog to prevent accidental removal.
- Event form validation on the client and server.
- Rich event description editor with headings, lists, quotes, links, and inline images.
- Cover images from upload or HTTPS URL.
- PostgreSQL persistence for admin users and events.
- API routes for event listing, detail, create, update, delete, and uploads.
- README, `.env.example`, Prisma schema, migration, 30-event seed data, and automated tests.

## Architecture

```text
Browser
  -> Next.js App Router pages
  -> Route Handlers in app/api
  -> NextAuth admin session guard
  -> Zod validation
  -> Event service
  -> Prisma
  -> PostgreSQL
```

Public pages and admin pages use separate layouts. Admin pages call a server-side session guard, and every mutation endpoint checks the admin session again. Event writes go through shared validation before Prisma persists data.

## Tech Stack and Rationale

| Area | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js App Router + React | One codebase for frontend pages and backend route handlers. |
| Language | TypeScript | Safer data flow across UI, API, and Prisma models. |
| Database | PostgreSQL | Reliable relational storage for users and events. |
| ORM | Prisma | Typed schema, migrations, and query helpers. |
| Authentication | NextAuth Credentials | Simple admin-only login suitable for the task scope. |
| Validation | Zod | Shared request validation and readable field errors. |
| Passwords | bcryptjs | Password hashing for seeded admin accounts. |
| Rich Text | Tiptap + sanitize-html | Admin-friendly editing with safe public rendering. |
| UI Styling | CSS + Tailwind entry | Small, project-specific styling without a heavy UI kit. |
| Tests | Node test runner + Playwright | Validation checks plus browser coverage for core flows. |

## Database Model

The database contains the required entities:

- `User`: admin identity, unique email, password hash.
- `Event`: `id`, `title`, `description`, `date`, `location`, `status`, optional `imageUrl`, timestamps.

Supported event statuses are `UPCOMING`, `ONGOING`, `COMPLETED`, and `CANCELLED`.

## Local Setup

Requirements:

- Node.js 22.16+ and npm.
- PostgreSQL binaries available on PATH, or `PGBIN` set to the PostgreSQL `bin` folder.

```powershell
npm ci
npm run setup:local
npm run db:deploy
npm run prisma:generate
npm run db:seed
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

The local setup script creates a project-only PostgreSQL cluster in `.local/postgres` on `127.0.0.1:5433`, creates the `ieee_events` database, and writes local secrets to `.env` if the file does not already exist.

## Environment Variables

Use `.env.example` as the template.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `AUTH_SECRET` | Secret for NextAuth session encryption. |
| `NEXTAUTH_URL` | Application origin, usually `http://localhost:3000`. |
| `SEED_ADMIN_NAME` | Admin display name created by the seed. |
| `SEED_ADMIN_EMAIL` | Admin email created by the seed. |
| `SEED_ADMIN_PASSWORD` | Admin password created by the seed, 12-72 characters. |
| `PGBIN` | Optional PostgreSQL binary path for local setup. |
| `NEXT_BUILD_DIR` | Optional custom build output directory when `.next` is locked. |

## Demo Admin Account

After `npm run setup:local` and `npm run db:seed`, the local admin email defaults to:

```text
admin@example.com
```

The password is the `SEED_ADMIN_PASSWORD` value in your local `.env`. It is intentionally not committed.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home and highlighted events. |
| `/events` | Public | Searchable, filterable event list. |
| `/events/[id]` | Public | Event detail page. |
| `/about` | Public | IEEE ITB Student Branch profile. |
| `/admin/login` | Public | Admin sign-in. |
| `/admin/events` | Admin | Event management dashboard. |
| `/admin/events/new` | Admin | Create event form. |
| `/admin/events/[id]/edit` | Admin | Edit event form. |

## API Summary

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `GET /api/events` | Public | Paginated event list. |
| `GET /api/events/[id]` | Public | Event detail. |
| `POST /api/events` | Admin | Create event. |
| `PATCH /api/events/[id]` | Admin | Update event. |
| `DELETE /api/events/[id]` | Admin | Delete event. |
| `POST /api/uploads` | Admin | Upload JPEG, PNG, or WebP image up to 5 MB. |
| `GET /api/uploads/[name]` | Public | Read uploaded image. |
| `DELETE /api/uploads/[name]` | Admin | Remove uploaded image. |

Errors return a consistent JSON shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server. |
| `npm run build` | Build production app. |
| `npm start` | Serve built app. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript check. |
| `npm test` | Unit validation/password/date checks. |
| `npm run test:e2e` | Playwright end-to-end tests. |
| `npm run test:recovery` | Database/login failure recovery checks. |
| `npm run db:deploy` | Apply migrations. |
| `npm run db:seed` | Seed admin and reset sample events. |
| `npm run db:stop` | Stop local isolated PostgreSQL. |

## Testing Coverage

Automated checks cover:

- unauthenticated admin redirects and mutation protection,
- login validation,
- create, edit, delete, and cancel-delete flows,
- public event list and detail rendering,
- API pagination, validation, and partial updates,
- image upload paths,
- empty/error/not-found states,
- responsive layouts at mobile and desktop widths.

## Known Limitations

- Seeded events are 30 demo records, not official IEEE schedules.
- Uploaded files are stored in ignored `.local/uploads`; production needs persistent storage or object storage.
- Images uploaded into an abandoned unsaved description draft can remain on disk and may need periodic cleanup.
- Login throttling is process-local; a multi-instance deployment should use shared rate limiting.
- No public user accounts, ticketing, registration, payments, password reset, or analytics are included because they are outside the probation scope.

## AI Usage

OpenAI Codex was used to review the provided requirements, implement the fullstack application, set up local database tooling, write tests, perform browser checks, and prepare documentation. The Ponytail skill was used to keep changes minimal and avoid unnecessary abstractions. The submitted code remains the candidate's responsibility.
