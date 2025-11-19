# Claude Code Session Context - Credit Cards App

**Date:** November 19, 2025
**Project:** Credit Card Deals & Tips Web Application
**Location:** `/Users/maruthi/Desktop/project-temp/credit-cards-app`

## Project Overview

A Next.js web application for managing and displaying credit card offers, deals, tips, and tricks with admin and end-user views.

## Tech Stack

- **Framework:** Next.js 16.0.3 (App Router with Turbopack)
- **Language:** TypeScript 5.x
- **Database:** SQLite (file: `prisma/dev.db`)
- **ORM:** Prisma 6.19.0
- **Authentication:** NextAuth.js 4.24.13 (JWT sessions)
- **Styling:** TailwindCSS 4.x
- **Password Hashing:** bcryptjs (12 rounds)

## Database Schema

### Models

1. **User**
   - id, email, password, name, isAdmin, createdAt
   - Relations: posts, comments

2. **Post**
   - id, title, slug, content (JSON), excerpt, categories (comma-separated string), published, authorId, createdAt, updatedAt
   - Relations: author (User), comments

3. **Comment**
   - id, content, postId, userId, authorName, createdAt
   - Relations: post, user (optional)

4. **Category** (NEW - Just Added!)
   - id, name, slug, label, description, color, parentId, createdAt, updatedAt
   - Self-referential parent-child relationship
   - Relations: parent (Category), children (Category[])

## Current Category Structure

```
📁 Spend Offers (SPEND_OFFERS)
📁 New Card Offers (NEW_CARD_OFFERS) - PARENT
   ↳ LTF Offers (LTF_OFFERS)
   ↳ Joining Bonus Offers (JOINING_BONUS)
📁 Stacking Hacks (STACKING_HACKS)
📁 Hotel/Airline Deals (HOTEL_AIRLINE_DEALS) - PARENT
   ↳ Transfer Bonus Deals (TRANSFER_BONUS)
   ↳ Hotel/Airline Status Offers (STATUS_OFFERS)
```

## Key Features Implemented

### 1. Authentication System
- User registration & login via NextAuth
- Admin role-based access control
- JWT session strategy

### 2. Post Management
- **Content Block System:** JSON-based mixed content (text, images, YouTube URLs, regular URLs)
- **Multi-category Selection:** Posts can have multiple categories
- **Draft/Publish:** Toggle between draft and published states
- **Auto-slug Generation:** From post title
- **Rich Excerpts:** For post previews

### 3. Category Management System (Latest Addition!)
- **Dynamic Categories:** Stored in database, not hardcoded
- **Parent-Child Hierarchy:** Unlimited nesting levels
- **CRUD Operations:** Create, read, update, delete categories
- **Color Coding:** Tailwind color classes for visual distinction
- **Admin UI:** Full category management at `/admin/categories`

### 4. Comment System
- Guest & authenticated commenting
- Display author name from user or guest input

### 5. Social Sharing
- Share buttons for posts

## File Structure

```
/Users/maruthi/Desktop/project-temp/credit-cards-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── categories/
│   │   │   ├── route.ts (GET, POST)
│   │   │   └── [id]/route.ts (PUT, DELETE)
│   │   ├── comments/route.ts
│   │   └── posts/
│   │       ├── create/route.ts
│   │       └── [id]/route.ts
│   ├── admin/
│   │   ├── page.tsx (Dashboard with "Manage Categories" button)
│   │   ├── categories/page.tsx (NEW!)
│   │   └── posts/
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   ├── auth/signin/page.tsx
│   ├── posts/[slug]/page.tsx
│   └── page.tsx (Homepage with category filtering)
├── components/
│   ├── CategoryFilter.tsx (Uses dynamic categories)
│   ├── CategoryManager.tsx (NEW! - Full CRUD UI)
│   ├── PostCard.tsx (Shows multiple category badges)
│   ├── PostEditor.tsx (Fetches categories from API, pill-style multi-select)
│   ├── PostContent.tsx
│   ├── Comments.tsx
│   └── ShareButtons.tsx
├── lib/
│   ├── auth.ts (NextAuth config)
│   └── prisma.ts (Prisma client singleton)
├── prisma/
│   ├── schema.prisma
│   ├── dev.db (SQLite database)
│   └── seed-categories.ts (Initial category seeding)
├── .env
└── package.json
```

## API Routes

### Categories
- `GET /api/categories` - Fetch all categories with children
- `POST /api/categories` - Create new category (requires admin)
- `PUT /api/categories/[id]` - Update category (requires admin)
- `DELETE /api/categories/[id]` - Delete category (requires admin, prevents deletion if has children)

### Posts
- `GET /api/posts` (not explicitly created, using Prisma direct)
- `POST /api/posts/create` - Create post (requires admin)
- `PUT /api/posts/[id]` - Update post (requires admin)
- `DELETE /api/posts/[id]` - Delete post (requires admin)

### Comments
- `POST /api/comments` - Add comment (guest or authenticated)

## Recent Changes (Session Highlights)

### 1. Category System Migration
- **From:** Hardcoded TypeScript enums (`OFFER | DEAL | TIP | TRICK`)
- **To:** Database-driven Category model with parent-child relationships
- **Why:** User requested ability to add/delete categories from admin panel

### 2. Multi-Category Support
- **Changed:** Posts.categories from single value to comma-separated string
- **Format:** `"SPEND_OFFERS,LTF_OFFERS,STACKING_HACKS"`
- **UI:** Pill-style checkboxes with hierarchical display (parent → children indented)

### 3. Components Updated for Dynamic Categories
- PostEditor: Fetches categories via API, displays in grouped format
- PostCard: Parses comma-separated categories, shows multiple badges
- CategoryFilter: Dynamically loads category filter buttons
- Admin Dashboard: Shows multiple category badges per post

### 4. Category Color Scheme
- Blue: Spend Offers, New Card Offers, LTF Offers, Joining Bonus
- Orange: Stacking Hacks
- Purple: Hotel/Airline Deals, Transfer Bonus, Status Offers

## Current Issue: Figma MCP Authentication

### Attempted Solutions
1. Added Figma MCP server via `claude mcp add`
2. Tried with personal access token (redacted for security)
3. Token stored in `.claude.json` with Authorization header

### Status
- Configuration saved successfully
- Need to restart Claude Code session to load MCP server
- `/mcp` command currently shows "No MCP servers configured" (before restart)

### Next Steps for Figma MCP
1. Exit current Claude Code session
2. Restart with `claude` command
3. Run `claude mcp list` to verify connection
4. Try `/mcp` command to access Figma tools
5. If still shows "⚠ Needs authentication", may need OAuth flow instead of token

## Running the App

```bash
# Install dependencies (if needed)
npm install

# Run database migrations (if needed)
npx prisma db push
npx prisma generate

# Seed categories (if needed)
npx tsx prisma/seed-categories.ts

# Start development server
npm run dev
```

**Dev Server:** http://localhost:3000

## Admin Access
- URL: http://localhost:3000/admin
- Login required with admin user
- Can create/edit/delete posts
- Can manage categories at `/admin/categories`

## Documentation Created
- `/Users/maruthi/Desktop/MainDirectory/projectone-carddeals/`
  - `prompt-1-detailed-approach.md`
  - `prompt-1-detailed-approach-enhanced.md` (120KB comprehensive guide)
  - `version-history.md`

## Important Notes

1. **Content is JSON:** Post content stored as JSON string with ContentBlock array
2. **Categories are comma-separated:** Parse with `.split(",")` when reading
3. **Default category:** "SPEND_OFFERS" for new posts
4. **Child categories inherit parent color:** Can be customized individually
5. **Category deletion protection:** Cannot delete parent category if it has children

## Environment Variables (.env)

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Background Processes Running

Multiple dev servers were started during session (IDs: 6e3cf9, 1bedab, 6299f8, e7265d, 25b33f). Currently running: `25b33f`

To check: `claude mcp list` or check bash output tools

## What to Resume With

When you come back with this context, you can:
1. Continue working on Figma MCP integration
2. Test the category management system
3. Add more features to the credit card app
4. Update existing posts to use new category structure
5. Create sample posts with the new categories

## Quick Commands Reference

```bash
# MCP Management
claude mcp list
claude mcp get figma
claude mcp remove figma -s local

# Database
npx prisma studio  # Visual database browser
npx prisma db push # Sync schema to database
npx prisma generate # Regenerate Prisma client

# Development
npm run dev        # Start dev server
npx tsx script.ts  # Run TypeScript script
```

---

**To restore this context:** Simply share this file or its contents when starting a new session!
