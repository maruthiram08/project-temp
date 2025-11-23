# Critical Deployment Fixes - Action Plan

This document provides step-by-step instructions to fix critical issues before Vercel deployment.

---

## Fix #1: Update Prisma Client Usage in API Routes (CRITICAL)

**Time Required**: 30-45 minutes

### Files to Update (8 total):

1. `app/api/posts/route.ts`
2. `app/api/admin/posts/route.ts`
3. `app/api/admin/posts/[id]/route.ts`
4. `app/api/admin/banks/route.ts`
5. `app/api/admin/banks/[id]/route.ts`
6. `app/api/admin/programs/route.ts`
7. `app/api/admin/programs/[id]/route.ts`
8. `app/api/admin/card-configs/route.ts`
9. `app/api/admin/card-configs/[categoryType]/route.ts`

### Change Required:

**Find and replace in each file:**

```typescript
// ❌ REMOVE these lines (usually at top of file)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

**With:**

```typescript
// ✅ ADD this line instead
import { prisma } from '@/lib/prisma'
```

### Example - app/api/posts/route.ts:

**BEFORE:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // ... rest of code
}
```

**AFTER:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // ... rest of code
}
```

### Verification:
After making changes, search entire codebase to ensure no API routes are creating new instances:
```bash
grep -r "new PrismaClient()" app/api/
```
Should only show results in seed/script files, NOT in API routes.

---

## Fix #2: Add NextAuth Secret Configuration (CRITICAL)

**Time Required**: 5 minutes

### File to Update:
`lib/auth.ts`

### Change Required:

Add `secret` to the `authOptions` configuration:

**BEFORE (lib/auth.ts:6-12):**
```typescript
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
```

**AFTER:**
```typescript
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
```

### Verification:
1. Check that `.env.example` exists (already created)
2. Generate a secure secret for your `.env` file:
```bash
openssl rand -base64 32
```
3. Add to `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

---

## Fix #3: Database Migration to PostgreSQL (CRITICAL)

**Time Required**: 1-2 hours

### Step 1: Choose PostgreSQL Provider

**Recommended: Vercel Postgres** (easiest integration)
- In Vercel dashboard: Storage → Create Database → Postgres
- Automatically adds `DATABASE_URL` to environment variables

**Alternative Options:**
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Starting at $5/month

### Step 2: Update Prisma Schema

**File**: `prisma/schema.prisma` (line 8-11)

**BEFORE:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**AFTER:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Reset and Regenerate Migrations

⚠️ **IMPORTANT**: Backup your current database first!

```bash
# Backup current SQLite database
cp prisma/dev.db prisma/dev.db.backup

# Remove old migrations and database
rm -rf prisma/migrations
rm prisma/dev.db
rm prisma/migrations/migration_lock.toml

# Update your .env with PostgreSQL connection string
# Example: DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# Generate new migration
npx prisma migrate dev --name init_postgresql

# Generate Prisma Client
npx prisma generate
```

### Step 4: Update Build Command (Optional but Recommended)

**File**: `package.json`

**BEFORE:**
```json
"scripts": {
  "build": "next build",
```

**AFTER:**
```json
"scripts": {
  "build": "prisma generate && next build",
```

This ensures Prisma Client is generated during Vercel builds.

### Step 5: Test Locally with PostgreSQL

```bash
# Start development server
npm run dev

# Test:
# 1. Login to admin panel
# 2. Create a test post
# 3. View post on category page
# 4. Check console for errors
```

### Step 6: Seed Database (Optional)

```bash
# Run seed script to populate with sample data
npm run seed
```

---

## Fix #4: Add Prisma Generate to Build (RECOMMENDED)

**Time Required**: 2 minutes

### File: package.json

Update the build script to include Prisma client generation:

**Current:**
```json
"scripts": {
  "build": "next build",
```

**Updated:**
```json
"scripts": {
  "build": "prisma generate && next build",
```

---

## Testing Checklist (After All Fixes)

### Local Testing
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev

# 4. Test build
npm run build

# 5. Start production server locally
npm start
```

### Functionality Testing
- [ ] Admin login works
- [ ] Create new post in admin panel
- [ ] Edit existing post
- [ ] View posts on public pages
- [ ] Post overlay/modal works
- [ ] Bank management works
- [ ] Programs management works
- [ ] Twitter import (if configured)

### Code Verification
```bash
# No new PrismaClient instances in API routes
grep -r "new PrismaClient()" app/api/

# NextAuth secret is configured
grep "secret:" lib/auth.ts

# PostgreSQL provider in schema
grep "provider" prisma/schema.prisma
```

---

## Deployment to Vercel (After All Fixes)

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix: Prepare for Vercel deployment

- Update Prisma Client usage in API routes
- Add NextAuth secret configuration
- Migrate database schema to PostgreSQL
- Add .env.example file
- Update build command with prisma generate"

git push origin main
```

### Step 2: Set Up Vercel Project
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables in Vercel
Go to Project Settings → Environment Variables:

```env
# Required for all environments (Production, Preview, Development)
DATABASE_URL=postgresql://...your-postgres-connection-string
NEXTAUTH_SECRET=your-generated-secret-from-openssl
NEXTAUTH_URL=https://your-app.vercel.app

# Optional (for Twitter automation)
OPENAI_API_KEY=sk-...
OPENAI_MODEL_RELEVANCE=gpt-4o-mini
OPENAI_MODEL_EXTRACTION=gpt-4o

# Auto-set by Vercel
NODE_ENV=production
```

### Step 4: Deploy
Click "Deploy" - Vercel will:
1. Install dependencies
2. Run `prisma generate` (if you added it to build command)
3. Build Next.js app
4. Deploy to serverless functions

### Step 5: Run Database Migrations in Production

Option A: Via Vercel CLI (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

Option B: Via package.json postbuild script (automatic)
Add to package.json:
```json
"scripts": {
  "build": "prisma generate && next build",
  "postbuild": "prisma migrate deploy"
}
```

### Step 6: Seed Database (Optional)
```bash
# Using Vercel CLI
vercel env pull .env.production
npm run seed
```

Or run the seed script manually from Vercel Functions UI.

---

## Post-Deployment Verification

1. Visit your production URL
2. Test authentication (login/logout)
3. Create a test post in admin
4. Verify post appears on public pages
5. Check Vercel function logs for errors
6. Test all category pages
7. Verify images load correctly

---

## Troubleshooting Common Issues

### Issue: "PrismaClient is unable to run in the browser"
**Solution**: Make sure you're importing from `@/lib/prisma`, not creating new instances

### Issue: "Invalid session" or "Unauthorized" errors
**Solution**:
- Verify `NEXTAUTH_SECRET` is set in Vercel
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Issue: Database connection errors
**Solution**:
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check that connection string includes `?schema=public` for PostgreSQL
- Ensure database is accessible from Vercel's IP ranges

### Issue: "Cannot find module @prisma/client"
**Solution**: Add `prisma generate` to build command in package.json

### Issue: Build fails with TypeScript errors
**Solution**: Run `npm run build` locally first to catch errors before deploying

---

## Summary

**Required Changes**: 3 critical fixes
- ✅ Created `.env.example`
- ⏳ Update 8 API routes to use singleton Prisma Client
- ⏳ Add NextAuth secret configuration
- ⏳ Migrate to PostgreSQL

**Time Estimate**: 2-3 hours total

**Next Action**: Start with Fix #1 (Prisma Client) as it's the quickest and most mechanical change.
