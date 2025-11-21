# Credit Cards Application

A full-stack web application for managing and displaying credit card offers, deals, and information across multiple categories. Built with Next.js 16, TypeScript, Prisma, and NextAuth.

## Quick Links

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
- **[COLLABORATION_GUIDE.md](./COLLABORATION_GUIDE.md)** - Full technical reference for developers (READ THIS if working with another developer)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and patterns
- **[PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md)** - Ensure smooth merges before pushing

## Features

### Public Features
- Browse credit card offers by category (Spend Offers, Lifetime Free, etc.)
- View detailed post information in modal overlays
- Filter by bank, category type, and status
- Responsive card-based UI with bank logos
- CTA buttons linking to offer details

### Admin Features
- Secure admin authentication with NextAuth
- Dynamic form generation based on category type
- Create and manage posts with category-specific fields
- Rich content editor with text and image support
- Post status management (draft/active)
- Bank and author relationship management

### Category Types
- **Spend Offers** - Cashback and discount offers
- **Lifetime Free** - No annual fee cards
- **Stacking Hacks** - Multi-offer combination strategies
- **Joining Bonus** - Welcome bonus offers
- **Transfer Bonus** - Points transfer promotions

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS
- **Password Hashing**: bcrypt

## Getting Started

### Quick Setup

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

Visit http://localhost:3000

### Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `password123`

**Change these immediately in production!**

## Project Structure

```
project-temp/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── admin/posts/          # Admin CRUD (protected)
│   │   └── posts/                # Public endpoints
│   ├── admin/                    # Admin dashboard pages
│   ├── spend-offers/             # Category pages
│   ├── lifetime-free/
│   ├── stacking-hacks/
│   ├── joining-bonus/
│   ├── transfer-bonus/
│   └── auth/                     # Authentication pages
├── components/                   # React components
│   ├── admin/                    # FormGenerator, etc.
│   ├── cards/                    # DynamicCard component
│   └── PostOverlay.tsx           # Modal overlay
├── lib/                          # Core utilities
│   ├── auth.ts                   # NextAuth config
│   ├── validators.ts             # Data transformation
│   └── prisma.ts                 # Prisma client
├── prisma/                       # Database
│   ├── schema.prisma             # Schema definition
│   ├── seed.ts                   # Seed data
│   └── dev.db                    # SQLite database
└── types/                        # TypeScript types
    └── categories.ts             # Core type definitions
```

## Database Schema

### Core Models

- **User** - Authentication and authorization
- **Post** - Main content with flexible category data
- **Bank** - Credit card issuers
- **CardConfig** - Dynamic form definitions

### Key Relationships

```
User ──1:many──> Post
Bank ──1:many──> Post
CardConfig ──1:many──> Post (via categoryType)
```

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

## Development Workflow

### For New Developers

1. Read [QUICK_START.md](./QUICK_START.md) to get running
2. Read [COLLABORATION_GUIDE.md](./COLLABORATION_GUIDE.md) before making changes
3. Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand system design

### Before Pushing Code

Follow the [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md):

```bash
# Must pass
npm run build

# Verify database
npx prisma studio

# Test features
# - Create post
# - View post
# - Open overlay
```

## Key Concepts

### Server vs Client Components

**Server Component (default):**
```tsx
// Direct database access, no interactivity
export default async function Page() {
  const posts = await prisma.post.findMany()
  return <div>{...}</div>
}
```

**Client Component (for interactivity):**
```tsx
'use client'
// Uses useState, event handlers, fetches from API
export default function Page() {
  const [posts, setPosts] = useState([])
  const handleClick = () => {...}
}
```

### Dynamic Form System

Forms are generated from `CardConfig.schema` JSON:
- Admin selects category type
- Form renders fields from database config
- Validation happens at API layer
- Data stored as JSON in `Post.categoryData`

### Field Mapping

API routes handle flexible input:
- `categoryData.offerTitle` → `title`
- `categoryData.shortDescription` → `excerpt`
- Auto-generates `slug` from title
- Converts objects to JSON strings for SQLite

## Common Tasks

### Add New Category Page

```bash
# Copy existing page
cp app/spend-offers/page.tsx app/new-category/page.tsx

# Update category type in fetch call
fetch('/api/posts?categoryType=NEW_CATEGORY&status=active')
```

### Modify Card Styling

Edit `components/cards/DynamicCard.tsx` - all Tailwind classes are safe to change.

### Add API Endpoint

```typescript
// app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  // ... implementation
}
```

## Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma studio    # Open database GUI
npx prisma generate  # Regenerate Prisma client
npx prisma migrate   # Create/apply migrations
npx prisma db seed   # Run seed file
```

## Architecture Highlights

### Authentication Flow
1. User logs in via NextAuth credentials
2. JWT generated with custom fields (id, isAdmin)
3. Session includes user.id and user.isAdmin
4. Admin routes check `session.user.isAdmin`

### Post Creation Flow
1. Admin fills dynamic form (FormGenerator)
2. POST to `/api/admin/posts`
3. Field mapping extracts title/excerpt from categoryData
4. Validation and transformation (preparePostForDatabase)
5. Prisma creates record with relations
6. Returns post with included bank/author

### Post Display Flow
1. Client component fetches from `/api/posts`
2. Renders DynamicCard components
3. Click handler sets selectedPost state
4. PostOverlay modal displays full details
5. Escape/click-outside/X button closes overlay

## Security

- Passwords hashed with bcrypt
- HTTP-only cookies for sessions
- Admin routes protected by middleware
- Prisma prevents SQL injection
- React escapes XSS by default

## Deployment

### Production Checklist

- [ ] Change admin credentials
- [ ] Generate strong NEXTAUTH_SECRET (32+ chars)
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Migrate to PostgreSQL (recommended for production)
- [ ] Add rate limiting middleware
- [ ] Enable HTTPS
- [ ] Set secure cookie flags

### Platforms

Works on any Node.js platform:
- Vercel (recommended)
- Railway
- Render
- AWS/GCP/Azure
- DigitalOcean

### Database Migration (SQLite → PostgreSQL)

```bash
# Update .env
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Run migrations
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

No code changes required - Prisma handles the abstraction.

## Troubleshooting

### "Unauthorized" errors
```typescript
// Always import authOptions
import { authOptions } from '@/lib/auth'
const session = await getServerSession(authOptions)
```

### "Module not found" after creating file
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### "Cannot read properties of undefined"
Check field mapping - form sends `categoryData.offerTitle`, not `title`.

### Port 3000 already in use
```bash
# Kill existing process
lsof -i :3000
kill -9 <PID>
```

## Contributing

If working with another developer:
1. Read [COLLABORATION_GUIDE.md](./COLLABORATION_GUIDE.md) first
2. Follow [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md) before pushing
3. Test `npm run build` before creating PR
4. Document any schema changes in commit messages

## License

MIT

## Support

For questions or issues, refer to the comprehensive guides or open a GitHub issue.

## 🤖 Twitter Automation Module (New)

A complete workflow to import, process, and publish credit card offers from Twitter.

### Features
- **Tweet Import**: Upload CSV files or manually enter tweet URLs.
- **AI Processing**: Uses OpenAI GPT-4o to:
  - Filter irrelevant tweets.
  - Detect category (Spend Offer, Lifetime Free, etc.).
  - Extract structured data (Bank, Rewards, Expiry).
  - Auto-match Bank names.
- **Review Queue**: Admin interface to review AI extractions before publishing.
- **Integration**: Approved tweets become draft Posts in the CMS.

### Setup
1. Add `OPENAI_API_KEY` to your `.env` file.
2. See `TWITTER_SETUP.md` for configuration details.
3. See `TWITTER_USER_GUIDE.md` for usage instructions.

### Key Routes
- `/admin/sources`: Manage source data (Import/List).
- `/admin/review-queue`: Review and approve processed tweets.

## 📚 Development Documentation

### For Current Development Session
- **[CHANGELOG.md](./.gemini/antigravity/brain/890ba8c7-0614-448c-8501-15c7ed5c673c/CHANGELOG.md)** - Detailed changelog of recent improvements
- **[COMMIT_MESSAGE.md](./.gemini/antigravity/brain/890ba8c7-0614-448c-8501-15c7ed5c673c/COMMIT_MESSAGE.md)** - Git commit message template

### Key Technical Documents
- **Database Schema**: See `prisma/schema.prisma` for complete data model
  - `Post` - Main content model with flexible categoryData JSON
  - `PendingPost` - Review queue for AI-processed tweets
  - `RawTweet` - Imported tweet data
  - `CardConfig` - Dynamic form configurations for post categories
  - `Bank` - Credit card issuers
  - `Program` - Hotels/Airlines programs

- **Admin Components**:
  - `components/admin/FormGenerator.tsx` - Dynamic form generation based on CardConfig
  - `components/admin/ReviewPostEditor.tsx` - Review queue editor with workflow
  - `components/admin/AdminHeader.tsx` - Global tabbed navigation
  - `components/admin/CardConfigManager.tsx` - Post category management

- **API Routes**:
  - `/api/admin/posts/*` - CRUD operations for posts
  - `/api/admin/review-queue/*` - Review queue operations (update, approve, reject)
  - `/api/admin/sources/*` - Tweet import and processing
  - `/api/admin/card-configs/*` - Post category configuration

### Recent Improvements (Latest Session)
1. **Tabbed Navigation**: Reorganized admin panel with Post Management, Data Management, and Source Data tabs
2. **Review Queue Workflow**: Added save-before-approve workflow with visual guidance
3. **Bug Fixes**: Fixed infinite loading states and category persistence issues
4. **Terminology**: Renamed "Card Types" to "Post Categories" for clarity

### Next Development Phase - Key Areas
- **AI Processing**: OpenAI integration for tweet extraction (`lib/openai.ts`)
- **Form Validation**: Category-specific validation rules (`lib/validators.ts`)
- **Dynamic Rendering**: Card rendering based on category type (`components/cards/DynamicCard.tsx`)
- **Authentication**: Admin access control (`lib/auth.ts`)

