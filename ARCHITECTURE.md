# Technical Architecture Overview

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Public Pages │  │ Admin Panel  │  │ Auth Pages   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │ HTTP/JSON        │ HTTP/JSON        │ HTTP/JSON
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────┐
│                   Next.js App Router                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API Routes Layer                      │     │
│  │  ┌────────────────┐  ┌────────────────┐           │     │
│  │  │ /api/posts     │  │ /api/admin/*   │           │     │
│  │  │ (public)       │  │ (protected)    │           │     │
│  │  └────────┬───────┘  └────────┬───────┘           │     │
│  └───────────┼──────────────────┼─────────────────────┘     │
│              │                  │                            │
│  ┌───────────▼──────────────────▼─────────────────────┐     │
│  │           NextAuth Middleware                      │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │ JWT Strategy + Session Management        │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────┬───────────────────────────────┘     │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐     │
│  │           Business Logic Layer                     │     │
│  │  ┌─────────────────┐  ┌─────────────────┐         │     │
│  │  │ Validators      │  │ Transformers    │         │     │
│  │  │ (lib/validators)│  │ (preparePost*)  │         │     │
│  │  └─────────────────┘  └─────────────────┘         │     │
│  └────────────────────┬───────────────────────────────┘     │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                   Prisma ORM Layer                        │
│  ┌────────────────────────────────────────────────┐      │
│  │ Generated Client + Type-safe Query Builder     │      │
│  └────────────────────┬───────────────────────────┘      │
└───────────────────────┼───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                   SQLite Database                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │  User   │  │  Post   │  │  Bank   │  │ Config  │     │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘     │
│       │            │            │             │           │
│       └────────────┴────────────┴─────────────┘           │
│              Foreign Key Relationships                     │
└───────────────────────────────────────────────────────────┘
```

## Core Patterns

### 1. Data Flow: Post Creation

```
Admin Form (Client Component)
    │
    │ 1. User fills form with categoryData
    │    { offerTitle: "5% Cashback", shortDescription: "..." }
    │
    ▼
FormGenerator Component
    │
    │ 2. Validates required fields
    │    Formats data structure
    │
    ▼
POST /api/admin/posts
    │
    │ 3. Authentication check
    ├─→ getServerSession(authOptions)
    │   └─→ Verify isAdmin = true
    │
    │ 4. Field Mapping
    ├─→ Extract title from categoryData.offerTitle
    ├─→ Extract excerpt from categoryData.shortDescription
    ├─→ Generate slug from title
    ├─→ Generate content JSON from detailsContent
    │
    │ 5. Data Transformation
    ├─→ preparePostForDatabase()
    │   └─→ Convert objects → JSON strings
    │       (SQLite stores JSON as TEXT)
    │
    ▼
prisma.post.create()
    │
    │ 6. Database Constraints
    ├─→ Check authorId exists (FK to User)
    ├─→ Check bankId exists if provided (FK to Bank)
    ├─→ Check slug is unique
    ├─→ Validate categoryType matches CardConfig
    │
    ▼
Return Post + Relations
    │
    │ 7. Include bank and author
    │    Status 201 Created
    │
    ▼
Admin Dashboard
    │
    │ 8. Redirect on success
    └─→ router.push('/admin')
```

### 2. Data Flow: Viewing Posts

```
User visits /spend-offers
    │
    ▼
Page Component (Client)
    │
    │ useEffect on mount
    │
    ▼
GET /api/posts?categoryType=SPEND_OFFERS&status=active
    │
    │ No auth required (public)
    │
    ▼
prisma.post.findMany({
    where: { categoryType, status },
    include: { bank }
})
    │
    │ Returns array of posts with bank data
    │
    ▼
setPosts(data)
    │
    │ State update triggers re-render
    │
    ▼
Map over posts → <DynamicCard />
    │
    │ Each card gets: post data + onClick handler
    │
    ▼
User clicks card
    │
    │ handleCardClick(post)
    │
    ▼
setSelectedPost(post)
    │
    │ State update triggers re-render
    │
    ▼
<PostOverlay post={selectedPost} onClose={...} />
    │
    │ Modal displays:
    ├─→ Bank logo + name
    ├─→ Post title + excerpt
    ├─→ Details content
    ├─→ Details images (if any)
    ├─→ Expiry warning (if applicable)
    └─→ CTA button
```

### 3. Authentication Flow

```
User visits /admin
    │
    ├─→ useSession() hook checks auth
    │
    ├─→ No session?
    │   └─→ Redirect to /auth/signin
    │
    └─→ Has session?
        │
        ├─→ Check isAdmin flag
        │
        ├─→ Not admin?
        │   └─→ Redirect to home
        │
        └─→ Is admin?
            └─→ Render admin panel

Login Process:
    │
    ▼
User submits credentials
    │
    ▼
NextAuth.js Credentials Provider
    │
    │ 1. Hash password with bcrypt
    │ 2. Query user from database
    │ 3. Compare hashes
    │
    ├─→ Invalid? Return null
    │
    └─→ Valid?
        │
        ▼
    JWT Callback
        │
        │ Add custom fields:
        ├─→ token.id = user.id
        └─→ token.isAdmin = user.isAdmin
        │
        ▼
    Session Callback
        │
        │ Transfer from token to session:
        ├─→ session.user.id = token.id
        └─→ session.user.isAdmin = token.isAdmin
        │
        ▼
    Return session to client
        │
        │ Stored in cookie (HTTP-only)
        │
        ▼
    Subsequent requests
        │
        │ getServerSession(authOptions)
        └─→ Decodes JWT from cookie
            └─→ Returns full session with custom fields
```

## Key Design Decisions

### 1. SQLite for Development
**Decision:** Use SQLite instead of PostgreSQL/MySQL

**Rationale:**
- Zero configuration for developers
- Single file database (easy to reset/share)
- Perfect for prototyping and MVP
- Prisma handles SQL dialect differences

**Trade-offs:**
- Not production-ready at scale
- No concurrent writes
- Limited full-text search

**Migration Path:**
- Change `DATABASE_URL` in .env
- Run `npx prisma migrate deploy`
- No code changes needed (Prisma abstracts DB)

### 2. JSON Storage in SQLite
**Decision:** Store complex objects as JSON strings

**Rationale:**
- SQLite doesn't have native JSON type
- CategoryData structure varies by type
- Flexible schema without migrations

**Implementation:**
```typescript
// Write: Convert to string
categoryData: JSON.stringify({
  offerTitle: "...",
  shortDescription: "..."
})

// Read: Parse string
const data = typeof post.categoryData === 'string'
  ? JSON.parse(post.categoryData)
  : post.categoryData
```

**Trade-offs:**
- Can't query inside JSON fields efficiently
- Type safety only at application level
- Must manually parse on read

### 3. Server vs Client Components
**Decision:** Use server components by default, client only when needed

**Server Components (Default):**
```tsx
// No 'use client' directive
export default async function Page() {
  // Direct database access
  const posts = await prisma.post.findMany()
  return <div>{posts.map(...)}</div>
}
```

**Benefits:**
- Smaller JavaScript bundle
- Direct database access
- Better SEO
- Automatic code splitting

**Client Components (When Required):**
```tsx
'use client'
export default function Page() {
  const [state, setState] = useState()
  // Must use API routes for data
}
```

**When to Use:**
- Need useState/useEffect
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Interactive features

### 4. Field Mapping in API Layer
**Decision:** Accept multiple input formats, normalize in API

**Problem:**
- Form sends `categoryData.offerTitle`
- Database expects `title`
- Different category types have different fields

**Solution:**
```typescript
// API route handles mapping
let title = data.title
if (!title && data.categoryData?.offerTitle) {
  title = data.categoryData.offerTitle
}

let excerpt = data.excerpt
if (!excerpt && data.categoryData?.shortDescription) {
  excerpt = data.categoryData.shortDescription
}

// Generate missing fields
if (!slug) {
  slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

if (!content) {
  content = JSON.stringify([
    { type: 'text', content: detailsContent }
  ])
}
```

**Benefits:**
- Flexible input format
- Frontend doesn't need to know database schema
- Validation/transformation in one place
- Easy to extend for new category types

### 5. Dynamic Form System
**Decision:** Generate forms from CardConfig database

**Architecture:**
```
CardConfig Table
    ├─→ categoryType: "SPEND_OFFERS"
    ├─→ displayName: "Spend Offers"
    └─→ schema: JSON defining fields
        {
          "offerTitle": { "type": "string", "required": true },
          "shortDescription": { "type": "text", "required": true },
          "cashbackPercentage": { "type": "string" }
        }

FormGenerator Component
    ├─→ Fetches CardConfig for selected categoryType
    ├─→ Reads schema JSON
    └─→ Dynamically renders form fields
        ├─→ String → <input type="text" />
        ├─→ Text → <textarea />
        ├─→ Number → <input type="number" />
        └─→ Select → <select><option /></select>
```

**Benefits:**
- Add new category types without code changes
- Non-technical users can modify forms
- Consistent validation across categories
- Single source of truth

**Trade-offs:**
- Complex conditional logic harder to implement
- Type safety at runtime, not compile-time

## Database Schema Design

### Entity Relationship Diagram

```
┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │◄─────┐
│ email        │      │
│ name         │      │
│ password     │      │
│ isAdmin      │      │
└──────────────┘      │
                       │ authorId (FK)
┌──────────────┐      │
│     Bank     │      │
│──────────────│      │
│ id (PK)      │◄──┐  │
│ name         │   │  │
│ slug         │   │  │
│ logo         │   │  │
└──────────────┘   │  │
                    │  │
                    │ bankId (FK)
┌──────────────┐   │  │
│     Post     │   │  │
│──────────────│   │  │
│ id (PK)      │   │  │
│ title        │   │  │
│ slug (UK)    │   │  │
│ content      │   │  │
│ excerpt      │   │  │
│ categoryType │──┐│  │
│ categoryData │  ││  │
│ bankId       │──┘│  │
│ authorId     │───┘  │
│ status       │      │
│ createdAt    │      │
│ updatedAt    │      │
└──────────────┘      │
                      │
┌──────────────┐      │
│  CardConfig  │      │
│──────────────│      │
│ id (PK)      │      │
│ categoryType │◄─────┘
│ displayName  │
│ schema (JSON)│
│ isActive     │
└──────────────┘

UK = Unique Key
FK = Foreign Key
PK = Primary Key
```

### Field Constraints

| Table | Field | Type | Constraints | Purpose |
|-------|-------|------|-------------|---------|
| Post | id | String | PK, CUID | Unique identifier |
| Post | title | String | NOT NULL | Display title |
| Post | slug | String | UNIQUE, NOT NULL | URL-safe identifier |
| Post | categoryType | String | NOT NULL | Links to CardConfig |
| Post | authorId | String | FK → User.id | Who created it |
| Post | bankId | String | FK → Bank.id, NULL OK | Associated bank |
| Post | status | String | DEFAULT 'draft' | Workflow state |
| User | email | String | UNIQUE, NOT NULL | Login identifier |
| User | isAdmin | Boolean | DEFAULT false | Permission level |
| Bank | slug | String | UNIQUE, NOT NULL | URL identifier |
| CardConfig | categoryType | String | UNIQUE, NOT NULL | Type identifier |

## Security Considerations

### 1. Authentication
- **Session Storage:** HTTP-only cookies (not accessible to JavaScript)
- **Password Hashing:** bcrypt with salt rounds
- **JWT Secret:** Must be strong random string in production

### 2. Authorization
```typescript
// All admin routes check:
const session = await getServerSession(authOptions)
if (!session || !session.user?.isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 3. Input Validation
- SQL Injection: Protected by Prisma (parameterized queries)
- XSS: React escapes by default, but sanitize user-generated HTML
- CSRF: NextAuth includes CSRF protection

### 4. API Rate Limiting
**TODO:** Not currently implemented
- Consider adding rate limiting middleware
- Prevent brute force login attempts

## Performance Considerations

### 1. Database Queries
- **Include Relations:** Fetch bank/author in same query
  ```typescript
  prisma.post.findMany({
    include: { bank: true, author: true }
  })
  ```
- **Index Fields:** slug, categoryType, status
- **Pagination:** Implemented in admin API (page, limit)

### 2. Client-Side
- **Code Splitting:** Automatic with Next.js App Router
- **Image Optimization:** TODO - use next/image component
- **Lazy Loading:** Overlays only render when opened

### 3. Caching Strategy
- Static pages cached by Next.js
- API routes return fresh data (no cache headers)
- Consider adding SWR/React Query for client-side caching

## Extension Points

### Adding New Category Type

1. **Database:**
   ```sql
   INSERT INTO CardConfig (categoryType, displayName, schema, isActive)
   VALUES ('NEW_TYPE', 'New Type', '{"fields": [...]}', true);
   ```

2. **Types:**
   ```typescript
   // types/categories.ts
   export interface NewTypeData extends BaseCardData {
     specificField: string
   }
   ```

3. **Form:** No code changes needed (dynamic generation)

4. **Page:**
   ```tsx
   // app/new-type/page.tsx
   const response = await fetch('/api/posts?categoryType=NEW_TYPE')
   ```

### Adding New Post Fields

1. **Schema:**
   ```prisma
   model Post {
     // ... existing fields
     newField String?
   }
   ```

2. **Migration:**
   ```bash
   npx prisma migrate dev --name add_new_field
   ```

3. **Types:**
   ```typescript
   export interface EnrichedPost extends Post {
     newField?: string
   }
   ```

4. **API:** Update field mapping if needed

5. **UI:** Add to forms and display components

### Adding Search/Filtering

**API Layer:**
```typescript
const searchQuery = searchParams.get('search')
const where: any = { categoryType, status }

if (searchQuery) {
  where.OR = [
    { title: { contains: searchQuery } },
    { excerpt: { contains: searchQuery } }
  ]
}

const posts = await prisma.post.findMany({ where })
```

**Frontend:**
```tsx
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

useEffect(() => {
  fetch(`/api/posts?categoryType=TYPE&search=${debouncedSearch}`)
}, [debouncedSearch])
```

---

## Deployment Considerations

### Environment Variables
```env
# Development
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"

# Production
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-string-min-32-chars"
```

### Database Migration
```bash
# Generate production migration
npx prisma migrate deploy

# Seed production data
npx prisma db seed
```

### Build Process
```bash
npm run build
npm run start
```

### Health Checks
- `/api/health` - TODO: Add endpoint for monitoring
- Check database connectivity
- Verify environment variables

---

**Last Updated:** 2025-11-20
**Architecture Version:** 1.0
**Next.js:** 16.0.3
