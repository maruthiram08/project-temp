-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "brandColor" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "categories" TEXT,
    "categoryType" TEXT NOT NULL DEFAULT 'SPEND_OFFERS',
    "bankId" TEXT,
    "programId" TEXT,
    "isVerified" BOOLEAN DEFAULT false,
    "expiryDateTime" DATETIME,
    "showExpiryBadge" BOOLEAN NOT NULL DEFAULT false,
    "expiryDisplayFormat" TEXT DEFAULT 'date',
    "isActive" BOOLEAN DEFAULT true,
    "statusBadgeText" TEXT,
    "statusBadgeColor" TEXT,
    "detailsContent" TEXT,
    "detailsImages" TEXT,
    "ctaText" TEXT NOT NULL DEFAULT 'View Details',
    "ctaUrl" TEXT,
    "ctaAction" TEXT NOT NULL DEFAULT 'overlay',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "categoryData" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "bankId", "categories", "categoryData", "categoryType", "content", "createdAt", "ctaAction", "ctaText", "ctaUrl", "detailsContent", "detailsImages", "excerpt", "expiryDateTime", "expiryDisplayFormat", "id", "isActive", "isVerified", "published", "showExpiryBadge", "slug", "status", "statusBadgeColor", "statusBadgeText", "title", "updatedAt") SELECT "authorId", "bankId", "categories", "categoryData", "categoryType", "content", "createdAt", "ctaAction", "ctaText", "ctaUrl", "detailsContent", "detailsImages", "excerpt", "expiryDateTime", "expiryDisplayFormat", "id", "isActive", "isVerified", "published", "showExpiryBadge", "slug", "status", "statusBadgeColor", "statusBadgeText", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_categoryType_idx" ON "Post"("categoryType");
CREATE INDEX "Post_bankId_idx" ON "Post"("bankId");
CREATE INDEX "Post_programId_idx" ON "Post"("programId");
CREATE INDEX "Post_status_idx" ON "Post"("status");
CREATE INDEX "Post_expiryDateTime_idx" ON "Post"("expiryDateTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_slug_idx" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_type_idx" ON "Program"("type");
