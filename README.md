# IEEE ITB Event Management

A fullstack event catalogue and administration workspace for the IEEE ITB probation project.

## What Is Included

- Public home, event catalogue, event detail, and About pages.
- Search, persisted-status filters, and server-side pagination (9 events per page).
- Admin sign-in, an overview dashboard, and event create/edit/delete workflows.
- A keyboard-accessible delete confirmation dialog, field validation, progress indicators, success messages, and loading/empty/error/not-found states.
- PostgreSQL persistence, an initial migration, and an idempotent development seed.
- Responsive public navigation and a separate mobile admin drawer.

## Stack and Architecture

Next.js App Router and TypeScript provide UI and API endpoints in one application. Server Components read through a small event service; interactive forms call Route Handlers. Prisma provides typed PostgreSQL queries and migration history. Shared Zod schemas validate browser and server input. NextAuth v4 Credentials handles encrypted JWT session cookies, and bcrypt hashes passwords. Tailwind CSS and a shared stylesheet provide the visual foundation; Lucide supplies icons.

```text
Browser -> Next.js pages / Route Handlers
        -> Admin session check -> Zod validation
        -> Event service -> Prisma -> PostgreSQL
```

Public pages and admin pages have separate layouts. Every admin page and every mutation independently checks the server session. Only users provisioned in the database are administrators; there is no public account registration.

## Local Setup

Requirements: Node.js 22.16+ and npm, plus PostgreSQL binaries (`initdb`, `pg_ctl`, and `psql`). PostgreSQL 18 is used for the local verification. On Windows the setup script can detect a registered PostgreSQL service; otherwise add the PostgreSQL bin folder to `PATH` or set `PGBIN`.

```powershell
npm ci
npm run setup:local
npm run db:deploy
npm run prisma:generate
npm run db:seed
npm run dev
```

Open [the application](http://localhost:3000) or [admin sign-in](http://localhost:3000/admin/login).

`setup:local` creates an isolated PostgreSQL cluster in `.local/postgres`, listens only on `127.0.0.1:5433`, and creates the `ieee_events` database. It generates random database, session, and admin secrets in `.env` only when that file does not exist. It does not modify the existing PostgreSQL service or overwrite an existing `.env`.

The development admin email is `admin@example.com`; its randomly generated password is the `SEED_ADMIN_PASSWORD` value in the local `.env`. Credentials are not displayed in the application or committed. Running the seed again preserves existing users and sample records, including any edits. Changing seed variables does not reset an existing user's password.

Stop the isolated database with `npm run db:stop`; restart it with `npm run setup:local`. Keep `.local/postgres` when you want to retain data. Do not sync an active database directory between machines; use a database backup when moving it.

### Existing or Hosted PostgreSQL

Set `.env` using the names in `.env.example`, pointing `DATABASE_URL` at a dedicated database. Skip `setup:local`, then run the migration, generation, and seed commands above. Use your own admin email and a 12-72 character password. Generate an authentication secret with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; required at runtime and for migrations |
| `AUTH_SECRET` | High-entropy secret for session encryption |
| `NEXTAUTH_URL` | Canonical application origin, locally `http://localhost:3000` |
| `SEED_ADMIN_EMAIL` | Admin email for the development seed |
| `SEED_ADMIN_PASSWORD` | Admin seed password, 12-72 characters |
| `SEED_ADMIN_NAME` | Admin display name |
| `PGBIN` | Optional path to PostgreSQL executables for local setup |

If port 3000 is occupied, update `NEXTAUTH_URL` and run `npm run dev -- --port 3001`. Mutation requests must come from the configured origin.

## Routes and API

| Route | Access |
| --- | --- |
| `/`, `/events`, `/events/[id]`, `/about` | Public |
| `/admin/login` | Public sign-in |
| `/admin`, `/admin/events`, `/admin/events/new`, `/admin/events/[id]/edit` | Admin only |
| `GET /api/events` | Public paginated catalogue |
| `GET /api/events/[id]` | Public event detail |
| `POST /api/events` | Admin creates an event |
| `PATCH /api/events/[id]` | Admin updates one or more editable fields |
| `DELETE /api/events/[id]` | Admin deletes an event |
| `/api/auth/*` | NextAuth session, CSRF, credentials, and sign-out endpoints |

The list endpoint accepts `search`, `status`, and `page`. Status values are `all`, `upcoming` (UPCOMING or ONGOING), `past` (COMPLETED), or an exact enum value. The list response is `{ data: Event[], meta: { total, page, pages } }`. Invalid query values return 400. Public page URLs with invalid query parameters fall back to defaults. Pages beyond the available results are clamped to the last page.

Create requires `title`, `description`, `date` (ISO datetime including timezone), `location`, and `status`; `imageUrl` is optional. PATCH accepts at least one of these fields. Empty image URLs clear the cover. Unknown fields are rejected. Mutations require the session cookie, a same-origin `Origin` header, and JSON bodies for POST/PATCH. Errors use `{ error: { code, message, fields? } }`, with 400, 401, 403, 404, or 500 status codes.

Event dates are stored as UTC and displayed/edited in Asia/Jakarta (WIB). Status is explicitly set by the admin; it is not automatically changed when an event date passes. Mutations revalidate the application layout and refresh the admin interface, so public results reflect persisted changes.

## Commands and Tests

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` / `npm start` | Build / serve the production application |
| `npm run lint` | ESLint |
| `npm run typecheck` | Strict TypeScript validation |
| `npm run format` | Format application and test source |
| `npm test` | Validation, WIB conversion, and password checks |
| `npm run test:e2e` | Playwright acceptance tests against the running application |
| `npm run test:recovery` | After a production build: isolated database-failure, retry, and safe login error checks |
| `npm run prisma:migrate` | Create/apply a development migration |
| `npm run db:deploy` | Apply checked-in migrations |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run db:seed` | Provision development admin and sample events |
| `npm run prisma:studio` | Inspect local data |

For browser tests, first run `npx playwright install chromium`, seed the development database, and start the application at `NEXTAUTH_URL`. Tests use the seed credentials in `.env`; they create their own event and delete it afterward. Run them against a development database. Browser tests cover unauthorized direct access/mutations, invalid/valid login, form and server validation, cross-origin rejection, CRUD persistence, public visibility, delete cancellation, logout, not-found/empty results, images, and 320/390/768/1440px layouts. Screenshots are saved to ignored `.local/screenshots`.

## Deployment

Provision PostgreSQL and configure `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL` for the HTTPS deployment origin. Run `npm ci`, `npm run prisma:generate`, `npm run db:deploy`, and `npm run build`, then serve with `npm start`. Provision the admin deliberately using seed variables. The development seed includes fictional events; remove sample records through the admin workspace before publishing real data. Never publish `.env`, `.local`, test artifacts, or database dumps.

## Assets and Scope

The six seeded events are demonstration data, not verified IEEE schedules. Bundled cover photos are illustrative Unsplash images, not official IEEE event documentation. Replace them with approved event artwork using the image URL field. Credits and original URLs are in `public/images/CREDITS.md`. The navigation mark uses a generic Lucide CPU icon, not the official IEEE logo.

Images use HTTPS URLs (plus three bundled sample image paths); broken URLs fall back to a bundled cover. There is no upload storage. Ticketing, registration, payments, public accounts, password recovery, and advanced analytics are outside the agreed scope.

Sessions expire after 8 hours and sign-out removes the browser session cookie. Deleted administrators are denied access even with an existing token. Login throttling is bounded and process-local; a deployment with multiple server instances should replace it with a shared store. JWT sessions do not provide per-session server-side revocation. This application has been prepared and verified locally; hosted deployment and external account configuration are separate.

## Project Structure

- `app/(public)`: public catalogue and layouts.
- `app/admin/(protected)`: protected dashboard and forms.
- `app/api`: authentication and event endpoints.
- `components`: shared UI and interactive controls.
- `lib`: authentication, validation, event services, dates, and safe API errors.
- `prisma`: schema, migrations, and idempotent seed.
- `scripts`: isolated local PostgreSQL setup.
- `tests`: validation and end-to-end checks.
- `ieee-event-management-docs`: original product, architecture, and workflow specifications.

## AI Assistance

OpenAI Codex assisted with specification review, implementation, local database setup, tests, and documentation. The Ponytail skill guided the use of existing libraries and minimal abstractions. Automated checks and browser screenshots validate the implementation; the repository owner should review and understand the code and design decisions before submission. This statement does not claim a human review has already happened.
