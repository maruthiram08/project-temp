# Quick Start Guide

Get up and running in 5 minutes.

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Git configured

## Setup Steps

### 1. Clone & Install
```bash
cd project-temp
npm install
```

### 2. Environment Setup
Create `.env` file in root:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Login as Admin
Default admin credentials (from seed):
- Email: `admin@example.com`
- Password: `password123`

## Project Structure (60 Second Overview)

```
app/
├── api/              ← API routes (backend)
├── admin/            ← Admin dashboard
├── spend-offers/     ← Public category pages
└── auth/             ← Login/signup pages

components/           ← Reusable UI components
├── admin/            ← Admin-specific
├── cards/            ← Card displays
└── PostOverlay.tsx   ← Modal popups

prisma/
├── schema.prisma     ← Database schema (CRITICAL - read COLLABORATION_GUIDE.md before changing)
└── seed.ts           ← Sample data

types/                ← TypeScript definitions
```

## Key Concepts

### 1. Client vs Server Components
```tsx
// Server Component (default)
export default function Page() {
  // Can use Prisma directly
  const posts = await prisma.post.findMany()
}

// Client Component (for interactivity)
'use client'
export default function Page() {
  const [data, setData] = useState()
  // Use fetch() to call API routes
}
```

### 2. Database Fields
Posts have these critical fields:
- `title` - Main heading (required)
- `slug` - URL identifier (auto-generated)
- `categoryType` - SPEND_OFFERS, LIFETIME_FREE, etc.
- `categoryData` - JSON with type-specific fields
- `detailsContent` - Full description
- `authorId` - Foreign key to User
- `bankId` - Foreign key to Bank (optional)

### 3. Creating Posts
Admin form → API route `/api/admin/posts` → Database

Field mapping happens automatically:
- `categoryData.offerTitle` → `title`
- `categoryData.shortDescription` → `excerpt`

## Common Tasks

### Add a New Category Page
1. Copy `/app/spend-offers/page.tsx`
2. Change `categoryType` in fetch call
3. Update header text
4. Add route to navigation

### Modify Card Styling
Edit `/components/cards/DynamicCard.tsx`
- All styling uses Tailwind CSS
- Safe to modify freely

### Add New API Endpoint
1. Create file in `/app/api/your-route/route.ts`
2. Export GET, POST, PUT, DELETE functions
3. Use `getServerSession(authOptions)` for auth

## Testing Your Changes

```bash
# 1. Build check (must pass)
npm run build

# 2. Manual test
# - Create a post in admin panel
# - View on category page
# - Click to open overlay
# - Check browser console for errors

# 3. Database check
npx prisma studio
```

## Before Pushing to Git

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] Tested post creation
- [ ] Tested post display
- [ ] Read COLLABORATION_GUIDE.md if you changed:
  - Prisma schema
  - Auth system
  - Core types
  - API contracts

## Getting Help

1. **Read First**: `COLLABORATION_GUIDE.md` (comprehensive technical guide)
2. **Check Existing Code**: Look for similar patterns in codebase
3. **Database GUI**: `npx prisma studio` to inspect data
4. **Console**: Check browser console and terminal for errors

## Most Common Issues

### "Unauthorized" in admin routes
```typescript
// Add this import
import { authOptions } from '@/lib/auth'
// Use with getServerSession
const session = await getServerSession(authOptions)
```

### "Module not found" after creating component
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### "Foreign key constraint"
Make sure `authorId` exists:
```typescript
authorId: (session.user as any).id  // From authenticated session
```

### Can't use useState in component
Add to top of file:
```tsx
'use client'
```

---

**Ready to code!** Start by browsing existing pages to understand patterns, then make your changes. Read `COLLABORATION_GUIDE.md` before modifying database schema or core systems.
