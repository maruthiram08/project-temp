# Twitter Automation - Admin User Guide

## Overview
The Twitter Automation module allows you to import tweets (via CSV or manual entry), process them using AI to extract credit card offers, and review them before publishing to the CMS.

## 1. Accessing the Module
Navigate to the Admin Dashboard and click on **"Source Data"** in the sidebar or main menu.
URL: `/admin/sources`

## 2. Importing Tweets

### Option A: CSV Upload
1. Go to the **Import** tab (`/admin/sources/tweets/import`).
2. Drag and drop your CSV file into the upload area.
3. **CSV Format Requirements**:
   - The file must be a standard `.csv`.
   - **Required Header**: `URL` (The tweet URL).
   - **Optional Headers**: `Date` (YYYY-MM-DD), `Content` (Tweet text), `Username` (Twitter handle).
   - If `Content` is missing, the system will only store the URL (fetching content is not yet implemented in Phase 1).

   **Sample CSV:**
   ```csv
   URL,Date,Content,Username
   https://x.com/user/status/123,2024-01-01,"5x points on dining",@dealhunter
   https://x.com/user/status/456,2024-01-02,"Lifetime free card offer",@ccgeek
   ```

### Option B: Manual Entry
1. On the same **Import** page, scroll to the "Manual Entry" section.
2. Paste the Tweet URL.
3. (Optional) Paste the Tweet Content.
4. Click **Import Tweet**.

## 3. Processing Tweets
1. Go to the **Tweets** tab (`/admin/sources/tweets`).
2. You will see a list of imported tweets with status `Pending`.
3. Select specific tweets using the checkboxes, or select all.
4. Click the **Process Selected** button.
5. The AI will analyze the tweets to:
   - Determine relevance (Is it a credit card deal?).
   - Detect the category (Spend Offer, Lifetime Free, etc.).
   - Extract details (Bank, Rewards, Expiry, etc.).
   - Match the Bank Name to the database.

## 4. Review Queue
1. Navigate to the **Review Queue** (`/admin/review-queue`).
2. You will see processed posts waiting for review.
   - **Green Badge**: High confidence (>80%).
   - **Yellow Badge**: Medium confidence (60-80%).
   - **Red Badge**: Low confidence (<60%) or needs manual entry.
3. Click on a post to open the **Review Editor**.

### Review Editor
- **Left Side**: Original Tweet content and details.
- **Right Side**: Form with AI-extracted data.
- **Actions**:
  - **Edit**: Modify any field in the form.
  - **Approve**: Creates a draft Post in the CMS and marks the queue item as Approved.
  - **Reject**: Marks the queue item as Rejected.
  - **Re-process**: Runs the AI extraction again (useful if you suspect a glitch).

## 5. Publishing
Approved posts are created as **Drafts** in the main CMS.
1. Go to the main **Posts** section of the admin panel.
2. Find the new draft post.
3. Add images, fine-tune formatting, and **Publish**.
