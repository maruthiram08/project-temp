# Installation Setup Guide

Complete guide to set up this project on a new machine and continue the deployment process.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (SQLite)](#quick-start-sqlite)
3. [PostgreSQL Setup (Production-Ready)](#postgresql-setup-production-ready)
4. [Verification](#verification)
5. [Current Project Status](#current-project-status)
6. [Next Steps](#next-steps)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

Install these before proceeding:

1. **Node.js 18+**
   ```bash
   # Check if installed
   node --version  # Should be v18.0.0 or higher

   # If not installed:
   # macOS (using Homebrew)
   brew install node

   # Windows
   # Download from: https://nodejs.org/

   # Linux (Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Git**
   ```bash
   # Check if installed
   git --version

   # If not installed:
   # macOS
   brew install git

   # Windows
   # Download from: https://git-scm.com/

   # Linux
   sudo apt-get install git
   ```

3. **npm or yarn** (npm comes with Node.js)
   ```bash
   # Check if installed
   npm --version
   ```

### Optional (For Production-Ready Setup)

4. **PostgreSQL 14+**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Or use Postgres.app: https://postgresapp.com/

   # Windows
   # Download from: https://www.postgresql.org/download/windows/

   # Linux (Ubuntu/Debian)
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

5. **OpenSSL** (usually pre-installed)
   ```bash
   # Check if installed
   openssl version
   ```

---

## Quick Start (SQLite)

Use this for immediate testing without PostgreSQL setup.

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/maruthiram08/project-temp.git
cd project-temp

# Check current branch
git branch
# Should show: * main
```

### Step 2: Install Dependencies

```bash
# Clean install
npm install

# This will take 2-3 minutes
# You should see: added XXX packages
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# The .env file is already configured for SQLite
# You can use it as-is for testing
```

**Your `.env` should look like this**:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="ErpQ+LSRRcpES7hEGAAKDGpXUN6lne5JlpxKXGbbsFE="
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 4: Set Up Database (SQLite)

**⚠️ IMPORTANT**: The schema is currently set for PostgreSQL. Temporarily revert it:

```bash
# Edit prisma/schema.prisma
# Line 9: Change from "postgresql" to "sqlite"
```

**Manual Edit Required**:
Open `prisma/schema.prisma` and change:
```prisma
datasource db {
  provider = "sqlite"      # ← Change this line
  url      = env("DATABASE_URL")
}
```

**Then run**:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

**Expected Output**:
```
✓ Migrations applied
✓ Seeded admin user: admin@example.com / password123
✓ Seeded 5 banks
✓ Seeded sample posts
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Ready in XXXms
```

### Step 6: Access the Application

Open your browser and visit:
- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/auth/signin
  - Email: `admin@example.com`
  - Password: `password123`

---

## PostgreSQL Setup (Production-Ready)

Use this to test with PostgreSQL before deploying to Vercel.

### Step 1: Complete Quick Start Steps 1-2

Follow Steps 1-2 from the Quick Start section above.

### Step 2: Install PostgreSQL

**macOS**:
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version  # Should show: psql (PostgreSQL) 15.x
```

**Alternative for macOS**: Download [Postgres.app](https://postgresapp.com/)
- Simple GUI application
- Just drag to Applications and open
- Automatically starts PostgreSQL server

**Windows**:
1. Download installer from: https://www.postgresql.org/download/windows/
2. Run installer (use default settings)
3. Remember the password you set for the `postgres` user
4. Add PostgreSQL to PATH (installer usually does this)

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 3: Create Database

**macOS/Linux**:
```bash
# Create database
createdb credit_cards_app

# Verify it was created
psql -l | grep credit_cards_app
```

**Windows** (or if above doesn't work):
```bash
# Connect to PostgreSQL
psql -U postgres

# In the psql prompt, run:
CREATE DATABASE credit_cards_app;
\q
```

### Step 4: Configure Environment Variables

Create/edit `.env` file:
```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env  # or use any text editor
```

**Update the DATABASE_URL**:
```env
# For macOS/Linux (if your username is 'maruthi')
DATABASE_URL="postgresql://maruthi@localhost:5432/credit_cards_app?schema=public"

# For Windows (or if you set a password)
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/credit_cards_app?schema=public"

# Rest remains the same
NEXTAUTH_SECRET="ErpQ+LSRRcpES7hEGAAKDGpXUN6lne5JlpxKXGbbsFE="
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**How to find your PostgreSQL username**:
```bash
# macOS/Linux
whoami  # This is usually your PostgreSQL username

# Windows (or to check all users)
psql -U postgres -c "\du"
```

### Step 5: Ensure Schema is Set for PostgreSQL

Verify `prisma/schema.prisma` line 9:
```prisma
datasource db {
  provider = "postgresql"  # ← Should be postgresql
  url      = env("DATABASE_URL")
}
```

### Step 6: Set Up Database (PostgreSQL)

```bash
# If you were using SQLite before, remove old migrations
rm -rf prisma/migrations
rm prisma/dev.db  # If exists

# Generate Prisma Client
npx prisma generate

# Create new migrations for PostgreSQL
npx prisma migrate dev --name init_postgresql

# Seed the database
npm run seed
```

**Expected Output**:
```
✓ Database connected
✓ Migrations applied
✓ Seeded admin user: admin@example.com / password123
✓ Seeded banks, programs, and sample posts
```

### Step 7: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 and test the application.

---

## Verification

### 1. Check Installation

```bash
# Node.js
node --version  # v18.0.0 or higher

# npm
npm --version   # 8.0.0 or higher

# Git
git --version   # Any recent version

# PostgreSQL (if installed)
psql --version  # 14.0 or higher
```

### 2. Check Dependencies

```bash
# Should show no errors
npm list --depth=0
```

### 3. Check Database Connection

**SQLite**:
```bash
# List tables
npx prisma studio
# Opens GUI at http://localhost:5555
```

**PostgreSQL**:
```bash
# Test connection
npx prisma db push

# Or open Prisma Studio
npx prisma studio
```

### 4. Check Application

Visit these URLs and verify they work:
- ✅ Homepage: http://localhost:3000
- ✅ Login: http://localhost:3000/auth/signin
- ✅ Admin Panel: http://localhost:3000/admin (after login)
- ✅ Spend Offers: http://localhost:3000/spend-offers
- ✅ Lifetime Free: http://localhost:3000/lifetime-free

### 5. Test Core Functionality

**Admin Panel Tests**:
1. Login with `admin@example.com` / `password123`
2. Navigate to Admin Panel
3. Create a new post
4. Edit an existing post
5. View posts on public pages
6. Check that images and bank logos load

**Expected Results**:
- ✅ No console errors in browser
- ✅ No errors in terminal
- ✅ Posts display correctly
- ✅ Navigation works
- ✅ Login/logout works

---

## Current Project Status

### ✅ Completed Fixes (Already Applied)

1. **Prisma Client Connection Pooling** ✅
   - All 9 API routes now use singleton pattern
   - Prevents connection exhaustion on Vercel

2. **NextAuth Secret Configuration** ✅
   - Added `secret` to prevent session invalidation
   - Secure secret generated and added to `.env`

3. **PostgreSQL Migration** ✅
   - Schema updated to PostgreSQL
   - Build command includes `prisma generate`

4. **Environment Variables** ✅
   - `.env` created with secure credentials
   - `.env.example` template available

### 📄 Documentation Created

- `VERCEL_DEPLOYMENT_PLAN.md` - Complete deployment analysis
- `DEPLOYMENT_FIXES_REQUIRED.md` - Step-by-step fix guide
- `FIXES_APPLIED_SUMMARY.md` - Summary of applied changes
- `INSTALLATION_SETUP.md` - This file

### 📊 Files Modified

**Modified (13 files)**:
- 9 API route files (Prisma Client singleton)
- `lib/auth.ts` (NextAuth secret)
- `prisma/schema.prisma` (PostgreSQL)
- `package.json` (Build command)

**Ready for**: Testing and Vercel deployment

---

## Next Steps

### Immediate (On This Machine)

1. **Verify Setup**
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

2. **Test Build**
   ```bash
   npm run build
   # Should complete without errors
   ```

3. **Review Changes**
   - Read `FIXES_APPLIED_SUMMARY.md` for what was done
   - Read `VERCEL_DEPLOYMENT_PLAN.md` for deployment details

### For Production Deployment

Choose your deployment path:

**Option A: Deploy from This Machine**
```bash
# Configure git
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Commit if you made any changes
git add .
git commit -m "Setup: Configure for new machine"
git push origin main

# Then deploy via Vercel dashboard
# Visit: https://vercel.com/new
```

**Option B: Just Test Locally**
- Continue testing and development
- Push changes when ready
- Deploy from any machine later

**Option C: Set Up Staging Environment**
- Create a separate Vercel project for staging
- Test there before production deployment

### For Vercel Deployment

When ready to deploy, you'll need:

1. **Vercel Account**: https://vercel.com/signup
2. **Vercel Postgres**: Set up in Vercel dashboard
3. **Environment Variables**: Configure in Vercel project settings
   - `DATABASE_URL` (from Vercel Postgres)
   - `NEXTAUTH_SECRET` (use the one in `.env`)
   - `NEXTAUTH_URL` (your production domain)
   - `OPENAI_API_KEY` (if using Twitter automation)

**Detailed Instructions**: See `VERCEL_DEPLOYMENT_PLAN.md`

---

## Troubleshooting

### Common Issues

#### 1. "npm install" fails

**Problem**: Permission errors or network issues

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

#### 2. "Prisma Client not generated"

**Problem**: `@prisma/client` not found

**Solution**:
```bash
npx prisma generate
npm install
```

#### 3. "Database connection failed"

**SQLite**:
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
# Should be: DATABASE_URL="file:./dev.db"

# Ensure prisma/schema.prisma has:
# provider = "sqlite"
```

**PostgreSQL**:
```bash
# Test connection
psql -d credit_cards_app

# If fails, check:
# 1. PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# 2. Database exists
psql -l | grep credit_cards_app

# 3. Credentials in .env are correct
```

#### 4. "Port 3000 already in use"

**Solution**:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill

# Or use a different port
npm run dev -- -p 3001
```

#### 5. "Migration failed"

**Solution**:
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or start fresh
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

#### 6. "Cannot find module '@prisma/client'"

**Solution**:
```bash
# Regenerate and reinstall
npx prisma generate
npm install
```

#### 7. Build fails with TypeScript errors

**Solution**:
```bash
# Check for TypeScript errors
npm run lint

# If errors are in node_modules, ignore them
# If errors are in your code, fix them before building
```

#### 8. "Unauthorized" when accessing admin routes

**Solution**:
- Make sure you're logged in
- Check that `.env` has `NEXTAUTH_SECRET`
- Clear browser cookies and try again
- Check browser console for errors

### Environment Variable Issues

**Check if .env is loaded**:
```bash
# In a Node.js file or API route, temporarily add:
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set ✓' : 'Missing ✗')
```

**Ensure .env is in the right location**:
```bash
# Should be in project root
ls -la .env
```

### PostgreSQL Connection Issues

**Check PostgreSQL is running**:
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Windows
# Check Services app for "postgresql" service
```

**Check PostgreSQL is accepting connections**:
```bash
# Try connecting
psql -d credit_cards_app

# If "role does not exist"
psql -U postgres -d credit_cards_app
```

**Common connection string formats**:
```env
# Local development (macOS/Linux, no password)
DATABASE_URL="postgresql://username@localhost:5432/credit_cards_app?schema=public"

# With password
DATABASE_URL="postgresql://username:password@localhost:5432/credit_cards_app?schema=public"

# Windows default
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/credit_cards_app?schema=public"

# Different port
DATABASE_URL="postgresql://username@localhost:5433/credit_cards_app?schema=public"
```

### Getting Help

If you're still stuck:

1. **Check the logs**:
   ```bash
   # Server logs (in terminal where npm run dev is running)
   # Browser console (F12 → Console tab)
   ```

2. **Review documentation**:
   - `VERCEL_DEPLOYMENT_PLAN.md` - Comprehensive guide
   - `FIXES_APPLIED_SUMMARY.md` - What was changed
   - `README.md` - Project overview

3. **Check Prisma docs**: https://www.prisma.io/docs
4. **Check Next.js docs**: https://nextjs.org/docs
5. **Check Vercel docs**: https://vercel.com/docs

---

## Quick Reference

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations (dev)
npx prisma migrate deploy # Run migrations (prod)
npm run seed             # Seed database with sample data

# Git
git status               # Check changes
git pull origin main     # Get latest changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Push to GitHub

# Vercel (if CLI installed)
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
vercel env pull          # Pull environment variables
```

### Important Files

```
.env                     - Local environment variables (DO NOT COMMIT)
.env.example             - Template for environment variables
prisma/schema.prisma     - Database schema
package.json             - Dependencies and scripts
next.config.ts           - Next.js configuration
lib/auth.ts              - Authentication configuration
lib/prisma.ts            - Prisma singleton (use this!)
```

### Admin Credentials

**Default admin account** (created by seed):
- Email: `admin@example.com`
- Password: `password123`

**⚠️ IMPORTANT**: Change this in production!

### Environment Variables

**Required for local development**:
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Generated secure secret
- `NEXTAUTH_URL` - Your app URL

**Optional** (for Twitter automation):
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL_RELEVANCE` - Model for relevance checking
- `OPENAI_MODEL_EXTRACTION` - Model for data extraction

---

## Summary

**For Quick Testing** (SQLite):
1. Clone repo
2. Run `npm install`
3. Set `provider = "sqlite"` in schema
4. Run `npx prisma migrate dev`
5. Run `npm run seed`
6. Run `npm run dev`

**For Production-Ready** (PostgreSQL):
1. Clone repo
2. Run `npm install`
3. Install and start PostgreSQL
4. Create database
5. Update `.env` with PostgreSQL URL
6. Ensure `provider = "postgresql"` in schema
7. Run `npx prisma migrate dev`
8. Run `npm run seed`
9. Run `npm run dev`

**Current Status**: All code fixes applied, ready for testing and deployment.

**Next**: Test locally, then deploy to Vercel following `VERCEL_DEPLOYMENT_PLAN.md`

---

Good luck with your deployment! 🚀
