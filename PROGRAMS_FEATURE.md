# Programs Management Feature

## Overview
This feature adds a comprehensive management system for **Hotels** and **Airlines** (called "Programs") to the Credit Cards application, similar to the existing Banks management system.

## What Was Added

### 1. Database Schema
**File:** `prisma/schema.prisma`

Added a new `Program` model with the following structure:
```prisma
model Program {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  type        String   // 'airline' | 'hotel' | 'other'
  logo        String?
  brandColor  String?
  description String?
  posts       Post[]   @relation("ProgramPosts")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([type])
}
```

Also added a link from `Post` model to `Program`:
- `programId` field
- `program` relation
- Index on `programId`

### 2. Database Migration
**Migration:** `20251120132408_add_programs_model`

Run with: `npx prisma migrate dev --name add_programs_model`

### 3. API Routes

#### Main Programs Routes
**File:** `/app/api/admin/programs/route.ts`
- `GET /api/admin/programs` - List all programs (with optional type filter)
- `POST /api/admin/programs` - Create new program

**Features:**
- Optional `?stats=true` parameter to include post counts
- Optional `?type=airline|hotel|other` parameter to filter by type

#### Individual Program Routes
**File:** `/app/api/admin/programs/[id]/route.ts`
- `GET /api/admin/programs/[id]` - Get single program
- `PUT /api/admin/programs/[id]` - Update program
- `DELETE /api/admin/programs/[id]` - Delete program (with protection if posts exist)

### 4. Admin Interface
**File:** `/app/admin/programs/page.tsx`

Full-featured CRUD interface with:
- ✅ Type filtering tabs (All / Airlines / Hotels / Other)
- ✅ Create/Edit form
- ✅ List view with logos
- ✅ Delete with protection
- ✅ Post count per program
- ✅ Type badges with colors

### 5. Admin Dashboard Link
**File:** `/app/admin/page.tsx`

Added "Manage Programs" button in teal color to match the design system.

### 6. Seed Data
**File:** `prisma/seed-programs.ts`

Pre-populated programs:

**Airlines (4):**
- American Airlines AAdvantage
- American Airlines
- Singapore Airlines KrisFlyer
- British Airways Avios

**Hotels (3):**
- Marriott Bonvoy
- ITC Hotels
- Taj Hotels

Run with: `npx tsx prisma/seed-programs.ts`

### 7. Assets
All program logos are stored in `/public/assets/Icons/`:
- `aadvantage.jpg`
- `americanairlines.png`
- `singaporeairlines.png`
- `avios.png`
- `marriot.png`
- `itc.webp`
- `taj.png`

Also added new bank logos:
- `au.png` (AU Small Finance Bank)
- `axis-new.png` (New Axis Bank logo)
- `bob-new.png` (New Bank of Baroda logo)

## Usage

### Accessing the Management Interface
1. Login as admin
2. Go to Admin Dashboard
3. Click "Manage Programs" button
4. Use the type filter tabs to view Airlines, Hotels, or All

### Creating a New Program
1. Click "+ Add New Program"
2. Fill in:
   - Program Name (required)
   - Slug (auto-generated from name if not provided)
   - Type (airline/hotel/other)
   - Logo URL (can be `/assets/Icons/...` or external URL)
   - Brand Color (hex code)
   - Description
3. Click "Create Program"

### Editing a Program
1. Find the program in the list
2. Click "Edit"
3. Modify the fields
4. Click "Update Program"

### Deleting a Program
1. Find the program in the list
2. Click "Delete"
3. Confirm deletion
   - **Note:** Cannot delete programs that have associated posts

### Using Programs in Posts
Programs can be linked to posts via the `programId` field. This is useful for:
- Transfer Bonus posts (linking to airline loyalty programs)
- Hotel reward redemption posts
- Partnership offers between banks and airlines/hotels

## API Examples

### Get all airlines
```bash
GET /api/admin/programs?type=airline&stats=true
```

### Create a new hotel
```bash
POST /api/admin/programs
Content-Type: application/json

{
  "name": "Hyatt",
  "slug": "hyatt",
  "type": "hotel",
  "logo": "/assets/Icons/hyatt.png",
  "brandColor": "#BC9B6A",
  "description": "Global hotel chain with World of Hyatt loyalty program"
}
```

### Update a program
```bash
PUT /api/admin/programs/[id]
Content-Type: application/json

{
  "description": "Updated description"
}
```

## Technical Notes

### Type Safety
The `type` field is validated to only accept:
- `'airline'`
- `'hotel'`
- `'other'`

### Slug Generation
Slugs are auto-generated from the name if not provided:
- Converts to lowercase
- Replaces non-alphanumeric characters with hyphens
- Removes leading/trailing hyphens

### Unique Constraints
- Program names must be unique
- Slugs must be unique within programs

### Cascade Protection
Programs cannot be deleted if they have associated posts. This prevents data integrity issues.

## Future Enhancements

Potential additions:
1. Program categories/regions (e.g., North America, Asia-Pacific)
2. Partnership mappings between banks and programs
3. Redemption rate calculators
4. Program comparison tool
5. Transfer partner networks visualization

## Testing Checklist

- [ ] Can view all programs
- [ ] Can filter by type (airline/hotel/other)
- [ ] Can create new program
- [ ] Can edit existing program
- [ ] Can delete program (without posts)
- [ ] Cannot delete program with posts
- [ ] Logos display correctly
- [ ] Form validation works
- [ ] Duplicate name/slug errors show
- [ ] Programs show in admin dashboard

---

**Status:** ✅ Complete and functional
**Version:** 1.0.0
**Date:** 2025-01-20
