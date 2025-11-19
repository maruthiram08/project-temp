import { PrismaClient } from "@prisma/client"
import Database from "better-sqlite3"

const db = new Database('prisma/dev.db')

console.log("Migrating category to categories...")

// First, get all posts with their current category
const posts = db.prepare("SELECT id, category FROM Post").all() as any[]

console.log(`Found ${posts.length} posts to migrate`)

// Add new column
db.prepare("ALTER TABLE Post ADD COLUMN categories TEXT DEFAULT 'OFFER'").run()

// Migrate data from old category to new categories column
for (const post of posts) {
  const category = post.category || 'OFFER'
  db.prepare("UPDATE Post SET categories = ? WHERE id = ?").run(category, post.id)
}

// Drop old column
db.prepare("PRAGMA foreign_keys=off").run()
db.prepare("CREATE TABLE Post_new AS SELECT id, title, slug, content, excerpt, categories, published, authorId, createdAt, updatedAt FROM Post").run()
db.prepare("DROP TABLE Post").run()
db.prepare("ALTER TABLE Post_new RENAME TO Post").run()
db.prepare("PRAGMA foreign_keys=on").run()

console.log("✓ Migration completed!")

db.close()
