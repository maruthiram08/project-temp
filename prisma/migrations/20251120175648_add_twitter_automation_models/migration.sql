-- CreateTable
CREATE TABLE "RawTweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tweetUrl" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorHandle" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "postedAt" DATETIME NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "isRelevant" BOOLEAN,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "PendingPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawTweetId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "extractedData" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "lowConfidenceFields" TEXT,
    "reviewerNotes" TEXT,
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "publishedPostId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PendingPost_rawTweetId_fkey" FOREIGN KEY ("rawTweetId") REFERENCES "RawTweet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
