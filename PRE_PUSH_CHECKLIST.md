# Pre-Push Checklist

Run through this before pushing code to ensure smooth merging.

## 1. Build Check
```bash
npm run build
```
✅ Must complete without errors

## 2. Type Check
- [ ] No TypeScript errors in terminal
- [ ] No `@ts-ignore` comments added
- [ ] No `any` types unless necessary

## 3. Code Quality
- [ ] Removed all `console.log()` (except intentional error logging)
- [ ] Removed commented-out code
- [ ] Removed unused imports
- [ ] No debug code left in

## 4. Feature Testing

### Admin Panel
- [ ] Can create new post
- [ ] Can view posts list
- [ ] Can edit existing post
- [ ] No console errors

### Public Pages
- [ ] Category page loads
- [ ] Posts display correctly
- [ ] Click on post opens overlay
- [ ] Overlay shows: title, description, CTA
- [ ] Close overlay works (X button, Escape, click outside)
- [ ] Images load properly

### Database
- [ ] Run `npx prisma studio`
- [ ] Verify new records exist
- [ ] Check relationships (bank, author) are linked
- [ ] No orphaned records

## 5. Critical Files Check

### If You Modified Schema (`prisma/schema.prisma`)
- [ ] Created migration: `npx prisma migrate dev`
- [ ] Migration file is in `prisma/migrations/`
- [ ] Updated `types/categories.ts` to match
- [ ] Updated seed file if needed
- [ ] Tested full CRUD cycle with new schema

### If You Modified Auth (`lib/auth.ts`)
- [ ] Tested login/logout
- [ ] Admin routes still require auth
- [ ] Session includes required fields (id, isAdmin)
- [ ] Documented changes in commit message

### If You Modified Types (`types/categories.ts`)
- [ ] Only added fields (didn't remove/rename)
- [ ] Updated components using these types
- [ ] No breaking changes to existing interfaces

### If You Added API Routes
- [ ] Handles errors gracefully
- [ ] Returns proper status codes
- [ ] Auth check if required (admin routes)
- [ ] Tested with invalid inputs

## 6. Git Hygiene
```bash
# Check what you're committing
git status
git diff

# Verify no sensitive data
git diff | grep -i "password\|secret\|key\|token"
```

- [ ] No `.env` file in commit
- [ ] No `dev.db` or `dev.db-journal` files
- [ ] No large binary files accidentally added
- [ ] Commit message is descriptive

## 7. Merge Prep
```bash
# Pull latest from main
git checkout main
git pull origin main

# Merge into your branch
git checkout your-branch
git merge main

# Resolve conflicts if any
# Test again after merge!
npm run build
```

- [ ] Merged latest main
- [ ] Resolved conflicts (if any)
- [ ] Tested after merge
- [ ] Build still passes

## 8. Final Verification

Run this command sequence:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Database reset
npx prisma migrate reset --force
npx prisma db seed

# Build
npm run build

# Test
npm run dev
```

- [ ] Fresh install works
- [ ] Database migration works
- [ ] Seed data loads
- [ ] App runs without errors

## 9. Documentation
- [ ] Updated COLLABORATION_GUIDE.md if you changed critical systems
- [ ] Added comments for complex logic
- [ ] Updated README.md if you added major features

## 10. Communication
- [ ] Write clear commit message:
  ```
  feat: Add search filter to spend offers page

  - Added search input to filter posts by title
  - Updated API route to handle search param
  - Tested with 100+ posts
  ```
- [ ] Note any breaking changes in commit body
- [ ] Mention if database migration is required

---

## Quick Pass/Fail Test

Run these three commands:
```bash
npm run build && npx prisma migrate dev && npx prisma db seed
```

If all three succeed → ✅ Safe to push

If any fail → ❌ Fix before pushing

---

## When in Doubt

Ask yourself:
1. Can someone else pull my changes and run `npm install && npx prisma migrate dev && npm run dev` successfully?
2. Will my changes break existing features?
3. Did I test with actual data, not just empty database?
4. Did I read COLLABORATION_GUIDE.md for the parts I changed?

If all YES → Push with confidence!
