/*
  Warnings:

  - You are about to drop the column `category` on the `Post` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'bg-gray-100 text-gray-800',
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CategoryRelation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "brandColor" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CardConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryType" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "formSchema" TEXT NOT NULL,
    "renderConfig" TEXT NOT NULL,
    "requiresBank" BOOLEAN NOT NULL DEFAULT false,
    "requiresExpiry" BOOLEAN NOT NULL DEFAULT false,
    "supportsVerification" BOOLEAN NOT NULL DEFAULT false,
    "supportsActive" BOOLEAN NOT NULL DEFAULT false,
    "supportsAuthor" BOOLEAN NOT NULL DEFAULT false,
    "cardLayout" TEXT NOT NULL DEFAULT 'standard',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
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
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "excerpt", "id", "published", "slug", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_categoryType_idx" ON "Post"("categoryType");
CREATE INDEX "Post_bankId_idx" ON "Post"("bankId");
CREATE INDEX "Post_status_idx" ON "Post"("status");
CREATE INDEX "Post_expiryDateTime_idx" ON "Post"("expiryDateTime");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryRelation_postId_categoryId_key" ON "CategoryRelation"("postId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "Bank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_slug_key" ON "Bank"("slug");

-- CreateIndex
CREATE INDEX "Bank_slug_idx" ON "Bank"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CardConfig_categoryType_key" ON "CardConfig"("categoryType");

-- CreateIndex
CREATE INDEX "CardConfig_categoryType_idx" ON "CardConfig"("categoryType");

-- CreateIndex
CREATE INDEX "CardConfig_isEnabled_idx" ON "CardConfig"("isEnabled");
