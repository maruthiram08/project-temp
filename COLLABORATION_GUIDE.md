# Project Collaboration Guide
## Credit Cards Application - Technical Reference

This document provides technical guidelines for developers working on this credit cards application to ensure seamless collaboration and conflict-free merging.

---

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Critical Components - DO NOT MODIFY](#critical-components---do-not-modify)
3. [Safe to Modify](#safe-to-modify)
4. [Database Schema Rules](#database-schema-rules)
5. [Type System Guidelines](#type-system-guidelines)
6. [API Contract](#api-contract)
7. [Component Architecture](#component-architecture)
8. [Development Workflow](#development-workflow)
9. [Pre-Push Checklist](#pre-push-checklist)
10. [Common Pitfalls](#common-pitfalls)

---

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16.0.3 (App Router)
- **Runtime**: Turbopack (dev) / Node.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS

### Project Structure
```
project-temp/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── admin/posts/          # Admin CRUD operations
│   │   └── posts/                # Public post endpoints
│   ├── admin/                    # Admin dashboard pages
│   ├── spend-offers/             # Category pages
│   └── auth/                     # Authentication pages
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── cards/                    # Card display components
│   └── PostOverlay.tsx           # Modal overlays
├── lib/                          # Core utilities
│   ├── auth.ts                   # NextAuth configuration
│   ├── validators.ts             # Data validation/transformation
│   └── prisma.ts                 # Prisma client singleton
├── prisma/                       # Database files
│   ├── schema.prisma             # Database schema (CRITICAL)
│   ├── seed.ts                   # Seed data
│   └── dev.db                    # SQLite database (gitignored)
└── types/                        # TypeScript definitions
    └── categories.ts             # Core type definitions
```

---

## Critical Components - DO NOT MODIFY

### 1. Database Schema (`prisma/schema.prisma`)

**RULE: Never modify the schema without explicit agreement.**

**Critical Fields in Post Model:**
```prisma
model Post {
  id              String    @id @default(cuid())
  title           String    // REQUIRED - main title
  slug            String    @unique // REQUIRED - URL-safe identifier
  content         String    // REQUIRED - JSON array format
  excerpt         String?   // Short description
  categoryType    String    // REQUIRED - enum value
  categoryData    String?   // JSON - category-specific data
  detailsContent  String?   // Full content text
  detailsImages   String?   // JSON array of image URLs
  status          String    @default("draft")
  bankId          String?
  authorId        String    // REQUIRED - foreign key to User
  ctaText         String?
  ctaUrl          String?
  expiryDateTime  DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  bank   Bank?   @relation(fields: [bankId], references: [id])
  author User    @relation(fields: [authorId], references: [id])
}
```

**Why Critical:**
- Foreign key constraints: `authorId` and `bankId` must reference valid records
- JSON fields require specific formats (see Type System Guidelines)
- Changing field names will break existing API routes and components
- `categoryType` must match CardConfig entries

**If You Must Change Schema:**
1. Create a migration: `npx prisma migrate dev --name descriptive_name`
2. Update seed file (`prisma/seed.ts`)
3. Update types (`types/categories.ts`)
4. Update all API routes that touch changed fields
5. Test full CRUD cycle before pushing

### 2. Authentication System (`lib/auth.ts`)

**RULE: Do not modify the session callback or JWT structure.**

**Critical Code:**
```typescript
callbacks: {
  jwt: async ({ token, user }) => {
    if (user) {
      token.id = user.id
      token.isAdmin = user.isAdmin
    }
    return token
  },
  session: async ({ session, token }) => {
    if (session.user) {
      (session.user as any).id = token.id
      (session.user as any).isAdmin = token.isAdmin
    }
    return session
  }
}
```

**Why Critical:**
- All admin routes depend on `session.user.id` and `session.user.isAdmin`
- API routes use `getServerSession(authOptions)` - authOptions must be imported
- Changing JWT structure breaks existing sessions

### 3. Type Definitions (`types/categories.ts`)

**RULE: Extend types, don't modify existing fields.**

**Core Types:**
```typescript
export interface EnrichedPost extends Post {
  bank?: Bank | null
  // Do not remove these fields
}

export interface BaseCardData {
  offerTitle: string
  shortDescription: string
  // categoryType-specific fields...
}
```

**Why Critical:**
- Components expect these exact field names
- Type changes cause TypeScript compilation errors across the codebase

### 4. Data Transformation Layer (`lib/validators.ts`)

**RULE: Understand `preparePostForDatabase()` before modifying.**

**Critical Function:**
```typescript
export function preparePostForDatabase(data: any) {
  // Converts objects/arrays to JSON strings for SQLite
  // Do not remove this transformation
}
```

**Why Critical:**
- SQLite stores JSON as text, this function handles conversion
- Skipping this causes "Invalid JSON" database errors

---

## Safe to Modify

### 1. UI Components
- **Styling**: All Tailwind classes can be modified
- **Component structure**: Refactor components as needed
- **New components**: Add freely in `/components`

**Example Safe Change:**
```tsx
// components/PostOverlay.tsx - Safe to modify styling
<div className="bg-white rounded-2xl shadow-2xl"> // Can change to bg-gray-100, rounded-lg, etc.
```

### 2. Page Layouts
- Add new category pages following the pattern in `/app/spend-offers/page.tsx`
- Modify hero sections, headers, footers
- Change loading states and error messages

### 3. Non-Breaking API Additions
- Add new optional query parameters
- Add new API routes
- Add optional response fields

**Example Safe Addition:**
```typescript
// app/api/posts/route.ts
const searchQuery = searchParams.get('search') // New optional param
if (searchQuery) {
  where.title = { contains: searchQuery } // Safe addition
}
```

### 4. Client-Side Features
- Add new React hooks
- Add state management
- Add client-side validation
- Add animations/transitions

---

## Database Schema Rules

### Field Type Constraints

| Field | Type | Constraint | Notes |
|-------|------|------------|-------|
| `title` | String | NOT NULL | Must be provided before save |
| `slug` | String | UNIQUE | Must be URL-safe, auto-generated from title |
| `content` | String | JSON Array | Format: `[{type: 'text', content: '...'}]` |
| `categoryType` | String | FK to CardConfig | Must exist in CardConfig table |
| `categoryData` | String | JSON Object | Structure varies by categoryType |
| `detailsImages` | String | JSON Array | Format: `["url1", "url2"]` |
| `authorId` | String | FK to User | Must reference existing user |
| `bankId` | String | FK to Bank | Optional but must reference existing bank if provided |

### JSON Field Formats

**Content Field:**
```json
[
  { "type": "text", "content": "Main content here" }
]
```

**CategoryData Field (varies by type):**
```json
{
  "offerTitle": "5% Cashback",
  "shortDescription": "Get 5% back on all purchases",
  "cashbackPercentage": "5",
  "maxCashback": "500",
  "validityPeriod": "30 days"
}
```

**DetailsImages Field:**
```json
["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
```

---

## Type System Guidelines

### Extending Types (Safe)

```typescript
// types/categories.ts
export interface EnrichedPost extends Post {
  bank?: Bank | null
  newField?: string // SAFE: Adding optional fields
}
```

### Modifying Existing Types (Unsafe)

```typescript
// DON'T DO THIS
export interface EnrichedPost extends Post {
  // bank?: Bank | null  // REMOVED - will break components!
  bankData?: Bank | null // RENAMED - will break components!
}
```

### Type Usage Pattern

Always import types from the canonical source:
```typescript
import { EnrichedPost } from '@/types/categories'
// Not: Creating inline types or duplicating definitions
```

---

## API Contract

### POST /api/admin/posts

**Required Fields:**
```json
{
  "categoryType": "SPEND_OFFERS",
  "categoryData": {
    "offerTitle": "Required - becomes title",
    "shortDescription": "Required - becomes excerpt"
  },
  "detailsContent": "Optional - additional details",
  "bankId": "Optional - must exist in Bank table",
  "ctaText": "Optional",
  "ctaUrl": "Optional",
  "expiryDateTime": "Optional - ISO 8601 format"
}
```

**Field Mapping Logic:**
The API performs automatic field extraction:
- `title` ← `categoryData.offerTitle` (if title not provided)
- `excerpt` ← `categoryData.shortDescription` (if excerpt not provided)
- `slug` ← generated from title
- `content` ← generated JSON from detailsContent

**Response Format:**
```json
{
  "id": "clxx...",
  "title": "5% Cashback",
  "slug": "5-cashback",
  "content": "[{\"type\":\"text\",\"content\":\"...\"}]",
  "bank": { "id": "...", "name": "...", "logo": "..." },
  "author": { "id": "...", "name": "...", "email": "..." },
  ...
}
```

### GET /api/posts

**Query Parameters:**
- `categoryType`: Filter by category (e.g., "SPEND_OFFERS")
- `status`: Filter by status (e.g., "active", "draft")

**Response:** Array of Post objects with bank relation included

---

## Component Architecture

### Client vs Server Components

**Server Components (default):**
- Use when no interactivity needed
- Direct database access via Prisma
- Cannot use useState, useEffect, event handlers

**Client Components (use 'use client'):**
- Required for: onClick handlers, useState, useEffect
- Fetch data via API routes, not direct Prisma

**Example Pattern:**
```tsx
// app/spend-offers/page.tsx - Client component
'use client'

import { useState, useEffect } from 'react'

export default function SpendOffersPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts?categoryType=SPEND_OFFERS')
      .then(res => res.json())
      .then(setPosts)
  }, [])

  // Can use onClick handlers
  const handleClick = (post) => { ... }
}
```

### Component Communication Pattern

```
User Interaction
    ↓
Page Component (Client)
    ↓ (fetch)
API Route (/app/api/...)
    ↓ (Prisma query)
Database (SQLite)
    ↓ (return data)
API Route (transform/validate)
    ↓ (JSON response)
Page Component (setState)
    ↓ (pass props)
Child Components (DynamicCard, PostOverlay)
```

### Modal/Overlay Pattern

**Current Implementation:**
```tsx
// State management
const [selectedPost, setSelectedPost] = useState<EnrichedPost | null>(null)

// Open overlay
const handleCardClick = (post: EnrichedPost) => {
  setSelectedPost(post)
}

// Close overlay
const handleCloseOverlay = () => {
  setSelectedPost(null)
}

// Render conditionally
{selectedPost && (
  <PostOverlay post={selectedPost} onClose={handleCloseOverlay} />
)}
```

**Key Features:**
- Close on Escape key
- Close on backdrop click
- Prevent body scroll when open
- Stop propagation on modal content

---

## Development Workflow

### 1. Setup
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start dev server
npm run dev
```

### 2. Making Changes

**For UI Changes:**
1. Identify if component is server or client
2. Convert to client if interactivity needed
3. Test in browser immediately
4. Check console for errors

**For API Changes:**
1. Check if auth is required
2. Import `authOptions` if using `getServerSession()`
3. Test with both valid and invalid inputs
4. Check Prisma errors in terminal

**For Schema Changes:**
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change_name`
3. Update `types/categories.ts`
4. Update seed file if needed
5. Search codebase for field usage
6. Update all references

### 3. Testing Changes

**Manual Test Checklist:**
- [ ] Create new post in admin panel
- [ ] View post on category page
- [ ] Click post to open overlay
- [ ] Verify all fields display correctly
- [ ] Check console for errors
- [ ] Test on different browsers

**Database Verification:**
```bash
# Check database state
npx prisma studio
# Opens GUI at http://localhost:5555
```

### 4. Committing

```bash
# Check status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add filtering to spend offers page"

# Push to your branch
git push origin your-branch-name
```

---

## Pre-Push Checklist

Before pushing code, verify:

### Build & Type Checks
```bash
# TypeScript compilation
npm run build
# Should complete without errors

# If using linting
npm run lint
```

### Database State
- [ ] Database has seed data
- [ ] No broken foreign key references
- [ ] At least one admin user exists

### Feature Testing
- [ ] Admin can create posts
- [ ] Posts display on category pages
- [ ] Overlay opens and closes correctly
- [ ] CTA buttons work
- [ ] Images load correctly
- [ ] Expired posts show expiry warning

### Code Quality
- [ ] No console.log() statements (except error handling)
- [ ] No commented-out code blocks
- [ ] No TODO comments without context
- [ ] Imports are clean (no unused imports)
- [ ] No TypeScript `any` types (unless absolutely necessary)

### Critical Files Check
- [ ] `prisma/schema.prisma` - If modified, migration file included
- [ ] `lib/auth.ts` - No changes unless documented
- [ ] `types/categories.ts` - Only additions, no removals
- [ ] `.env` - Not committed (check .gitignore)

---

## Common Pitfalls

### 1. Authentication Issues

**Problem:** "Unauthorized" errors in admin routes

**Cause:**
```typescript
// WRONG
const session = await getServerSession()

// CORRECT
import { authOptions } from '@/lib/auth'
const session = await getServerSession(authOptions)
```

**Why:** Without `authOptions`, the session doesn't include custom fields like `id` and `isAdmin`

### 2. Field Mapping Confusion

**Problem:** "Cannot read properties of undefined"

**Cause:** Form sends `categoryData.offerTitle` but code expects `data.title`

**Solution:** Use the field mapping logic in `/app/api/admin/posts/route.ts`:
```typescript
let title = data.title
if (!title && data.categoryData?.offerTitle) {
  title = data.categoryData.offerTitle
}
```

### 3. JSON String Handling

**Problem:** "Unexpected token" errors when accessing JSON fields

**Cause:**
```typescript
// WRONG - detailsImages is a JSON string, not array
post.detailsImages.map(img => ...)

// CORRECT
const images = typeof post.detailsImages === 'string'
  ? JSON.parse(post.detailsImages)
  : post.detailsImages || []
images.map(img => ...)
```

### 4. Server/Client Component Mismatch

**Problem:** "You're importing a component that needs useState..."

**Cause:** Using client features in server component

**Solution:** Add `'use client'` at top of file:
```tsx
'use client'

import { useState } from 'react'
```

### 5. Foreign Key Violations

**Problem:** "Foreign key constraint violated"

**Cause:**
- `authorId` doesn't exist in User table
- `bankId` doesn't exist in Bank table

**Solution:**
```typescript
// Verify user exists
const user = await prisma.user.findUnique({ where: { id: authorId } })
if (!user) throw new Error('Author not found')

// Or use session user
authorId: (session.user as any).id
```

### 6. Module Not Found After Creating Component

**Problem:** "Module not found: Can't resolve '@/components/NewComponent'"

**Cause:** Next.js hasn't detected new file yet

**Solution:** Restart dev server:
```bash
# Kill server (Ctrl+C)
npm run dev
```

### 7. Slug Uniqueness Errors

**Problem:** "Unique constraint failed on the fields: (slug)"

**Cause:** Two posts have the same title, generating duplicate slugs

**Solution:** Add timestamp or random suffix:
```typescript
slug = `${baseSlug}-${Date.now()}`
// or
slug = `${baseSlug}-${Math.random().toString(36).substr(2, 9)}`
```

---

## Environment Variables

**Required in `.env`:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:**
- Never commit `.env` file
- Share `.env.example` instead with placeholder values
- Each developer needs their own `.env`

---

## Git Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work on changes...

# Before pushing, pull latest main
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main

# Resolve conflicts if any
# Test thoroughly
# Push
git push origin feature/your-feature-name
```

### Merge Conflicts Resolution

**If conflicts in:**

1. **`prisma/schema.prisma`**:
   - Coordinate with team before merging
   - May need new migration

2. **`package.json`/`package-lock.json`**:
   - Accept incoming changes
   - Run `npm install` after merge

3. **Components**:
   - Keep both changes if possible
   - Test rendering after merge

---

## Quick Reference Commands

```bash
# Development
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run start                         # Start production server

# Database
npx prisma studio                     # Open database GUI
npx prisma generate                   # Generate Prisma client
npx prisma migrate dev                # Create & apply migration
npx prisma migrate reset              # Reset database (DESTRUCTIVE)
npx prisma db seed                    # Run seed file

# Git
git status                            # Check status
git diff                              # See changes
git log --oneline -10                 # Recent commits
git checkout -b branch-name           # Create branch
git branch -a                         # List all branches

# Process Management
lsof -i :3000                         # Check port 3000
kill -9 $(lsof -t -i:3000)           # Kill port 3000 processes
```

---

## Contact & Questions

**When in doubt:**
1. Check this guide first
2. Read existing code for patterns
3. Test changes locally before pushing
4. Document any workarounds or hacks
5. Ask for clarification if modifying critical components

**Red Flags (ask before doing):**
- Changing Prisma schema
- Modifying auth callbacks
- Removing type fields
- Changing API response structure
- Adding new dependencies

**Green Lights (go ahead):**
- Adding new pages
- Styling changes
- New optional API params
- New components
- UI/UX improvements

---

**Last Updated:** 2025-11-20
**Project Version:** Next.js 16.0.3, Prisma 5.x
**Database:** SQLite (dev.db)
