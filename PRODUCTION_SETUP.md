# Production Database Setup Guide

## Issue: Bank Logos Not Visible

If bank logos are not showing up on your posts, this means:
1. **Banks haven't been imported** - Your production database doesn't have bank data
2. **Missing image configuration** - Next.js needs permission for external image domains

**Solution:** Follow the steps below to seed your database AND import banks data.

---

## Issue: Foreign Key Constraint Error When Creating Posts

If you see this error in production:
```
Foreign key constraint violated on the constraint: `Post_authorId_fkey`
```

This means **your production database hasn't been seeded with the admin user yet**.

---

## Solution: Seed Your Production Database

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Link your project** (run in project directory):
```bash
vercel link
```

4. **Pull production environment variables**:
```bash
vercel env pull .env.production
```

5. **Run database migrations** (if not already done):
```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma migrate deploy
```

6. **Seed the production database**:
```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run seed
```

7. **Import banks data** (IMPORTANT - needed for bank logos):
```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run import-banks
```

8. **Verify seeding succeeded** - you should see:
```
✓ Admin user created:
  Email: admin@creditcards.com
  Password: admin123
  Please change the password after first login!
✓ Sample post created
✓ Default CardConfig categories created
```

### Option 2: Create Seed API Endpoint (Alternative)

Create a one-time use API endpoint to seed the database:

1. Create `app/api/admin/seed/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Add a secret key check for security
    const { secret } = await request.json()
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create admin user
    const hashedPassword = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@creditcards.com' },
      update: {},
      create: {
        email: 'admin@creditcards.com',
        password: hashedPassword,
        name: 'Admin User',
        isAdmin: true,
      },
    })

    // Create CardConfigs (copy from seed.ts)
    // ... (include all CardConfig creation logic)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      adminEmail: 'admin@creditcards.com'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

2. Add `SEED_SECRET` to Vercel environment variables

3. Call the endpoint once:
```bash
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-seed-secret"}'
```

4. **Delete the seed endpoint after use** for security

### Option 3: Use Vercel Postgres Dashboard

If you're using Vercel Postgres:

1. Go to your Vercel dashboard
2. Storage → Your Postgres database → Query tab
3. Run this SQL directly:

```sql
-- Create admin user
INSERT INTO "User" (id, email, password, name, "isAdmin", "createdAt")
VALUES (
  'prod_admin_001',
  'admin@creditcards.com',
  '$2a$12$[BCRYPT_HASH_HERE]',  -- You need to generate this
  'Admin User',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Note: You need to generate bcrypt hash separately:
-- In Node.js: const bcrypt = require('bcryptjs'); bcrypt.hashSync('admin123', 12)
```

---

## After Seeding

1. **Login to your production app**:
   - Email: `admin@creditcards.com`
   - Password: `admin123`

2. **Change the default password immediately** in the admin panel

3. **Try creating a post** - it should work now!

---

## Default Admin Credentials

```
Email: admin@creditcards.com
Password: admin123
```

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## Verification

After seeding, verify the database has the user:

```bash
# Using Vercel CLI
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma studio
```

Then check the User table - you should see the admin user.

---

## Troubleshooting

### Error: "Can't reach database server"
- Check your `DATABASE_URL` is correct in Vercel environment variables
- Ensure your database is running (for Neon free tier, it may be sleeping)
- Wait a few seconds and try again (auto-wakes on connection)

### Error: "Unique constraint failed"
- The admin user already exists
- Try logging in with the existing credentials

### Still getting foreign key errors?
- Verify you're logged in as a user that exists in the database
- Check Vercel function logs for the actual user ID being used
- Clear browser cookies and login again
