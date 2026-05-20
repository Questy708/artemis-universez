# Deploying to Cloudflare Pages

## Prerequisites
- A Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Your domain already added to Cloudflare

## Step 1: Login to Cloudflare
```bash
wrangler login
```

## Step 2: Create D1 Database
```bash
wrangler d1 create artemis-lms-db
```
This will output a `database_id`. Copy it and paste it into `wrangler.toml` replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

## Step 3: Generate Prisma client
```bash
npx prisma generate
```

## Step 4: Create the database schema
```bash
# Apply schema locally first
wrangler d1 migrations apply artemis-lms-db --local

# Then apply to production
wrangler d1 migrations apply artemis-lms-db --remote
```

Note: If migrations don't work directly, you can use:
```bash
wrangler d1 execute artemis-lms-db --remote --command="$(cat prisma/migrations/0_init/migration.sql)"
```

## Step 5: Seed the database
```bash
# Generate seed SQL from Prisma seed
bunx tsx prisma/lms-seed.ts

# Or apply directly
wrangler d1 execute artemis-lms-db --remote --file=prisma/seed.sql
```

## Step 6: Build for Cloudflare
```bash
bun run pages:build
```

## Step 7: Deploy
```bash
bun run pages:deploy
```

Or deploy manually:
```bash
npx @opennextjs/cloudflare && wrangler pages deploy
```

## Step 8: Set environment variables
In Cloudflare Dashboard → Pages → artemis-university → Settings → Environment variables:
- `ADMIN_PASSWORD` = your-strong-password-here
- `D1_DATABASE` is set automatically via the binding in wrangler.toml

## Step 9: Add custom domain
In Cloudflare Dashboard → Pages → artemis-university → Custom domains:
- Add your domain
- Cloudflare will automatically configure DNS

## Local Development
```bash
# Regular local dev with SQLite
bun dev

# Or test Cloudflare Pages locally
bun run pages:dev
```

## Troubleshooting
- If build fails, check that `@opennextjs/cloudflare` is installed
- If D1 errors, verify database_id in wrangler.toml
- For "crypto not found" errors, add `"nodejs_compat"` to compatibility_flags
