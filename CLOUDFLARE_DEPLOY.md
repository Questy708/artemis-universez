# Deploying to Cloudflare Pages via Git

## Prerequisites
- A Cloudflare account with your domain already added
- Your GitHub repo: `https://github.com/Questy708/artemisxy`

---

## Option A: Deploy from Git (Recommended — Auto-deploys on push)

### Step 1: Create D1 Database
```bash
npm install -g wrangler
wrangler login
wrangler d1 create artemis-lms-db
```
Copy the `database_id` from the output and paste it into `wrangler.toml` replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`. Commit and push this change.

### Step 2: Connect GitHub to Cloudflare Pages
1. Go to **Cloudflare Dashboard → Pages**
2. Click **"Create a project"** → **"Connect to Git"**
3. Select **GitHub** and authorize Cloudflare
4. Select the `Questy708/artemisxy` repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build:cf`
   - **Build output directory**: `.vercel/output/static`
   - **Node.js version**: 20
6. Add environment variables:
   - `ADMIN_PASSWORD` = `artemis.admin.2026` (or your chosen password)
   - `BUILD_TARGET` = `cloudflare`
7. Click **"Save and Deploy"**

### Step 3: Bind D1 Database
After the first deploy succeeds:
1. Go to **Pages → artemis-university → Settings → Bindings**
2. Click **"Add binding"** → **D1 Database**
3 - Variable name: `D1_DATABASE`
4 - Select: `artemis-lms-db`
5. Click **Save**

### Step 4: Create Database Schema
```bash
wrangler d1 migrations apply artemis-lms-db --remote
```

Or run SQL directly:
```bash
wrangler d1 execute artemis-lms-db --remote --command="$(cat prisma/migrations/0_init/migration.sql)"
```

### Step 5: Add Your Custom Domain
1. Go to **Pages → artemis-university → Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain
4. Cloudflare auto-configures DNS

### Auto-Deploy
Now every time you `git push` to `main`, Cloudflare automatically:
- Detects the push
- Runs `npm run build:cf`
- Deploys the new version
- Invalidates cache

---

## Option B: Deploy via Wrangler CLI

### Step 1: Login
```bash
wrangler login
```

### Step 2: Create D1 Database
```bash
wrangler d1 create artemis-lms-db
```
Update `database_id` in `wrangler.toml`.

### Step 3: Build & Deploy
```bash
npm run build:cf
wrangler pages deploy
```

### Step 4: Set Secrets
```bash
wrangler pages secret put ADMIN_PASSWORD
# It will prompt you to enter the password
```

---

## Environment Variables Reference

| Variable | Where to Set | Value |
|----------|-------------|-------|
| `ADMIN_PASSWORD` | Cloudflare Dashboard → Pages → Settings → Env vars | Your admin password |
| `BUILD_TARGET` | Cloudflare Dashboard → Pages → Settings → Env vars | `cloudflare` |
| `D1_DATABASE` | Cloudflare Dashboard → Pages → Settings → Bindings | (auto-set by D1 binding) |

---

## Local Development
```bash
# Regular local dev with SQLite (no Cloudflare)
bun dev

# Test Cloudflare Pages locally with D1
bun run pages:dev
```

## Troubleshooting
- **Build fails**: Check that `@opennextjs/cloudflare` is in dependencies
- **D1 errors**: Verify `database_id` in `wrangler.toml` matches your D1 database
- **"crypto not found"**: Ensure `nodejs_compat` is in `wrangler.toml` compatibility_flags
- **500 errors on API routes**: Check that D1 binding is configured in Pages Settings → Bindings
- **"Admin access not configured"**: Set `ADMIN_PASSWORD` in Pages → Settings → Environment variables
