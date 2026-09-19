# Environment Configuration

## Required Variables

Recommended `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

AUTH_SECRET="replace-with-a-secure-secret"

# Only if required by chosen authentication implementation:
AUTH_URL="http://localhost:3000"

# Optional seed/demo configuration:
SEED_ADMIN_NAME="IEEE Admin"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="change-me"
```

Do not commit real secrets.

---

## Variable Rules

### DATABASE_URL
PostgreSQL connection string used by Prisma.

### AUTH_SECRET
High-entropy secret used by authentication/session system.

### AUTH_URL
Only configure if required by the selected Auth.js setup/environment.

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
