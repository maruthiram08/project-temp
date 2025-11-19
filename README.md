# Credit Card Deals Web App

A full-stack web application for sharing credit card deals, offers, tips, and tricks. Built with Next.js, TypeScript, SQLite, and NextAuth.

## Features

### Public Features
- Browse credit card posts without login
- View detailed posts with rich content (text, images, YouTube videos, links)
- Share posts on social media (Twitter, Facebook, LinkedIn)
- Copy post links to clipboard
- Comment on posts (requires login)

### Admin Features
- Secure admin authentication
- Rich post editor with multiple content types
- Create and edit posts with mixed content:
  - Text blocks with formatting
  - Image embeds (via URL)
  - YouTube video embeds
  - URL links
- Publish/unpublish posts
- Manage all posts from dashboard
- View comment counts

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd credit-cards-app
```

2. Install dependencies:
```bash
npm install
```

3. The database is already set up with migrations and seeded data.

### Default Admin Credentials

The database has been seeded with a default admin account:

- **Email**: admin@creditcards.com
- **Password**: admin123

**Important**: Change this password after your first login!

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### For End Users

1. **Browse Posts**: Visit the homepage to see all published posts
2. **Read Posts**: Click on any post to read the full content
3. **Share Posts**: Use the share buttons at the bottom of each post
4. **Comment**: Sign in to leave comments on posts
5. **Sign Up**: Create an account to comment (optional)

### For Admin

1. **Sign In**: Go to `/auth/signin` and use the admin credentials
2. **Access Dashboard**: Click "Admin Dashboard" in the header
3. **Create Post**:
   - Click "Create New Post"
   - Add title, slug, and excerpt
   - Add content blocks (text, images, YouTube, links)
   - Use the +Text, +Image, +YouTube, +Link buttons
   - Reorder blocks using ↑ ↓ buttons
   - Remove blocks using ✕ button
   - Check "Publish immediately" to make it live
4. **Edit Post**: Click "Edit" on any post in the dashboard
5. **View Posts**: Click "View" to see published posts

### Content Types

When creating posts, you can add:

- **Text**: Rich text content with HTML support
- **Images**: Paste image URL (e.g., from Imgur, your CDN)
- **YouTube**: Paste YouTube video URL (supports youtube.com and youtu.be)
- **Links**: Add external URLs

## Project Structure

```
credit-cards-app/
├── app/
│   ├── admin/              # Admin dashboard and post management
│   ├── api/                # API routes (auth, posts, comments)
│   ├── auth/               # Authentication pages
│   ├── posts/              # Public post viewing
│   └── page.tsx            # Homepage (public feed)
├── components/             # Reusable React components
├── lib/                    # Utilities (Prisma client, auth config)
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

## Database Schema

- **User**: Authentication and user management
- **Post**: Blog posts with rich content
- **Comment**: User comments on posts

## Environment Variables

Create a `.env` file (already exists) with:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with admin user
- `npm run lint` - Run ESLint

## Security Notes

1. Change the default admin password immediately
2. Update `NEXTAUTH_SECRET` in production
3. The SQLite database file (`dev.db`) contains all data
4. Passwords are hashed using bcrypt with 12 rounds

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS/Google Cloud/Azure

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
