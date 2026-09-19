# Environment Configuration

## Required Variables

Recommended `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

AUTH_SECRET="replace-with-a-secure-secret"

# Only if required by chosen authentication implementation:
NEXTAUTH_URL="http://localhost:3000"

# Optional seed/demo configuration:
SEED_ADMIN_NAME="IEEE Admin"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-with-at-least-12-characters"
```

Do not commit real secrets.

---

## Variable Rules

### DATABASE_URL
PostgreSQL connection string used by Prisma.

### AUTH_SECRET
High-entropy secret used by authentication/session system.

### NEXTAUTH_URL
Required canonical origin for NextAuth v4 and mutation origin checks. Local default: `http://localhost:3000`.

### Seed Credentials
Optional development convenience. Do not use real personal credentials.

---

## Files

Commit:

```text
.env.example
```

Do not commit:

```text
.env
.env.local
.env.production
```

Verify `.gitignore`.
