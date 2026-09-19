# Final Project README Plan

The actual application repository must include a clear `README.md`.

Recommended structure:

# IEEE ITB Event Management

## Overview
Short explanation of the application and probation context.

## Features

### Public
- Event List
- Event Detail
- Responsive UI
- Loading/Empty/Error states

### Admin
- Authentication
- Dashboard
- Create/Edit/Delete Event
- Validation
- Delete confirmation

## Tech Stack
Explain:

- Next.js
- TypeScript
- Tailwind
- PostgreSQL
- Prisma
- Zod
- Authentication choice

Include rationale, not only names.

## Architecture

Include a simplified diagram:

```text
Browser
  ↓
Next.js
  ↓
Auth / Validation / Services
  ↓
Prisma
  ↓
PostgreSQL
```

## Project Structure
Briefly explain important folders.

## Local Setup

1. Clone repository
2. Install dependencies
3. Configure `.env`
4. Start PostgreSQL
5. Run migration
6. Seed database
7. Run development server

## Environment Variables
Document required variables without real secrets.

## Database Setup
Commands for migration/seed.

## Demo Credentials
Only if evaluator credentials are intentionally provided.

## Scripts
Document dev/build/lint/test/database scripts.

## Known Issues / Limitations
Be explicit.

## AI Usage
Required by probation guide.

Include:

- AI tools used
- General tasks where AI assisted
- Confirmation that submitted code/decisions were reviewed and understood

## Git / Repository Notes
Repository must be public and accessible to evaluators at submission time.
