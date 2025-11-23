-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "categories" TEXT,
    "categoryType" TEXT NOT NULL DEFAULT 'SPEND_OFFERS',
    "bankId" TEXT,
    "programId" TEXT,
    "isVerified" BOOLEAN DEFAULT false,
    "expiryDateTime" TIMESTAMP(3),
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'bg-gray-100 text-gray-800',
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryRelation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "brandColor" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT,
    "brandColor" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardConfig" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawTweet" (
    "id" TEXT NOT NULL,
    "tweetUrl" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorHandle" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "isRelevant" BOOLEAN,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RawTweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPost" (
    "id" TEXT NOT NULL,
    "rawTweetId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "lowConfidenceFields" TEXT,
    "reviewerNotes" TEXT,
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_categoryType_idx" ON "Post"("categoryType");

-- CreateIndex
CREATE INDEX "Post_bankId_idx" ON "Post"("bankId");

-- CreateIndex
CREATE INDEX "Post_programId_idx" ON "Post"("programId");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");

-- CreateIndex
CREATE INDEX "Post_expiryDateTime_idx" ON "Post"("expiryDateTime");

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
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_slug_idx" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_type_idx" ON "Program"("type");

-- CreateIndex
CREATE UNIQUE INDEX "CardConfig_categoryType_key" ON "CardConfig"("categoryType");

-- CreateIndex
CREATE INDEX "CardConfig_categoryType_idx" ON "CardConfig"("categoryType");

-- CreateIndex
CREATE INDEX "CardConfig_isEnabled_idx" ON "CardConfig"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "RawTweet_tweetUrl_key" ON "RawTweet"("tweetUrl");

-- CreateIndex
CREATE UNIQUE INDEX "RawTweet_tweetId_key" ON "RawTweet"("tweetId");

-- CreateIndex
CREATE INDEX "RawTweet_processed_isRelevant_idx" ON "RawTweet"("processed", "isRelevant");

-- CreateIndex
CREATE INDEX "RawTweet_authorHandle_idx" ON "RawTweet"("authorHandle");

-- CreateIndex
CREATE UNIQUE INDEX "PendingPost_rawTweetId_key" ON "PendingPost"("rawTweetId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingPost_publishedPostId_key" ON "PendingPost"("publishedPostId");

-- CreateIndex
CREATE INDEX "PendingPost_status_idx" ON "PendingPost"("status");

-- CreateIndex
CREATE INDEX "PendingPost_category_idx" ON "PendingPost"("category");

-- CreateIndex
CREATE INDEX "PendingPost_confidence_idx" ON "PendingPost"("confidence");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryRelation" ADD CONSTRAINT "CategoryRelation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryRelation" ADD CONSTRAINT "CategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingPost" ADD CONSTRAINT "PendingPost_rawTweetId_fkey" FOREIGN KEY ("rawTweetId") REFERENCES "RawTweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
