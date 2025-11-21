<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Lets document everything what we have discussed in a very detailed and structured manner in a marked down format. Once the overall discussion is documented, in the same file lets add you implementation plan and unresolved questions to decide the implementation plan. Once this is done, then let me know

Here is a clear, structured, and comprehensive markdown document that captures everything we have discussed so far, plus a systematic implementation plan and a detailed list of unresolved questions/decisions.

***

# Credit \& Loyalty Twitter → CMS Automation: Research \& Implementation Plan

## 1. Problem Statement

You wish to automate the flow of **credit card deals/offers, stacking hacks, airline-hotel transfer campaigns, credit-related news** from selected Twitter handles into a content management system (CMS). Currently, this is a manual workflow:

- Read tweets from sources, understand \& extract relevant info
- Categorize the deal/news (Spend Offers, LTF, etc.)
- Manually paste into the CMS admin panel for publishing


### Desired Workflow

Automate fetching → reading → categorizing → rewriting/structuring the data → populating CMS draft queue.

***

## 2. Data \& Workflow Requirements

### Primary Data Sources

- Twitter/X handles (e.g. @AmazingCreditC, @EvryPaisaMatter; less than 50 total)
- All tweets \& threads (not replies)
- Language: Primarily English, some Hinglish/Hindi (always output CMS content as English)
- Tweets may mention multiple categories, or require later category expansion
- Admin will QC in the CMS before go-live, so automation feeds into a review queue


### Key Content Categories (Initial 5)

- Spend Offers
- Lifetime Free
- Stacking Hacks
- Joining Bonus
- Transfer Bonus
- (More may be added later)


### Extraction Needs per Tweet

- Extract the main structured details per category (e.g. bank, card, offer, reward, validity)
- Reformat text, always in English (translate if Hinglish)
- Link source tweet for admin review (URL kept for internal reference)
- Optional: Attachments/images (MVP = not mandatory); thread context optional


### Admin Processing Flow

- After AI/extraction, admin reviews in a **draft/review queue**
    - Deduplicate tweets/content
    - Assign correct category/categories
    - Edit/extract/finalize fields
    - Approve or reject for publishing


### Technical Constraints

- Prefer free/open source tools; \$10-20/month for AI/API max
- Minimal human intervention (batch, scheduled, and on-demand runs)
- Host on Vercel (serverless preferred)
- User is non-technical; solution should be able to run with minimal direct coding

***

## 3. Twitter Data Acquisition: Options

| Option | Method | Pros | Cons | Estimated Cost |
| :-- | :-- | :-- | :-- | :-- |
| **A** | Official Twitter API | Reliable, clean data, stable | Very low free quota, \$100/mo paid | \$\$ (costly at scale) |
| **B** | Apify or 3rd party API | Scalable, simple, less breakage | Small fee, but in budget | \$10-20/mo |
| **C** | Open Source Scraping | Free, DIY | Fragile, requires fixes, TOS issues | Free |
| **D** | Manual Upload MVP | Fastest prototype, lowest effort | Not automated, but low risk | Free |

**Current Recommendation:**

- Start with Option D (manual upload MVP for pipeline validation), progress to Option B (Apify) once workflow \& prompts are tuned.

***

## 4. Proposed System Architecture

```text
           [ TWITTER HANDLES ]
           ↓        |         ↓
         (API,     Scraper, Manual)
           ↓
    ┌───────────────┐
    │ TweetFetcher  │ (scheduled or on-demand)
    └───────────────┘
           ↓
    ┌───────────────────┐
    │ Deduplication     │
    └───────────────────┘
           ↓
    ┌───────────────────┐
    │ AI Extraction     │ - Claude/GPT
    └───────────────────┘
           ↓
    ┌───────────────────┐
    │ Review Queue DB   │ (Pending/Draft)
    └───────────────────┘
           ↓
    ┌───────────────────┐
    │ Admin Review      │
    └───────────────────┘
           ↓
    ┌───────────────────┐
    │  CMS Publish      │
    └───────────────────┘
```


***

## 5. Database Tables (Proposed Prisma Models)

```prisma
model RawTweet {
  id            String   @id @default(cuid())
  tweetUrl      String   @unique
  tweetId       String   @unique
  content       String   @db.Text
  authorHandle  String
  authorName    String
  createdAt     DateTime
  fetchedAt     DateTime @default(now())
  processed     Boolean  @default(false)
  isRelevant    Boolean? // null = unchecked, else filtered
  isDuplicate   Boolean  @default(false)
  processedPost PendingPost?
  @@index([processed, isRelevant])
  @@index([authorHandle])
}

model PendingPost {
  id              String   @id @default(cuid())
  rawTweetId      String   @unique
  rawTweet        RawTweet @relation(fields: [rawTweetId], references: [id])
  category        String
  extractedData   Json
  confidence      Float
  status          String   @default("pending_review")
  adminNotes      String?  @db.Text
  reviewedBy      String?
  reviewedAt      DateTime?
  publishedPostId String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@index([status])
  @@index([category])
}
```


***

## 6. AI Processing Framework

- Stage 1: Relevance Filter (cheap LLM, batch for cost)
- Stage 2: Category Extraction \& Parsing (main LLM, one-at-a-time)
    - Structured JSON output per category, always in English
    - Categorize, extract, and format to match CMS fields
- Stage 3: (optional) Thread context, handle Hinglish translation
- Deduplication of tweet URLs and content before AI involvement

***

## 7. Admin Processing Workflow (Suggested UI/UX)

- Table/List of "pending review" items:
    - Shows original tweet (or embedded), LLM output, confidence, main fields
    - Actions: process, edit, reject, re-categorize
    - After manual confirmation, moves to "pending approval"
- Table/List of "pending approval" items:
    - Pre-filled CMS form, admin can tweak
    - Action: Publish (goes live on user portal) or reject

***

## 8. Implementation Plan (Phased)

### **Phase 1: Manual MVP**

- RawTweet/Review DB \& admin form
- Manual paste/upload of tweet URLs/text
- LLM processing and draft queue population
- Admin review UI (simple, can be table view or exported as CSV)
- Focus here: Validate extraction, workflow, prompt structure


### **Phase 2: Automated Twitter Collection**

- Integrate Apify API (or chosen scraping method)
- Scheduled/triggered fetching jobs via Vercel Cron
- Deduplication logic and auto ingestion


### **Phase 3: Advanced Features**

- Thread detection \& stitching
- Image support
- Auto-approval for high-confidence cases
- Detailed analytics on processing/admin actions
- Optional AI summarization/analytics for admin dashboard

***

## 9. Unresolved Points \& Decisions Needed

1. **Twitter Collection Method (MVP):**
    - Start with manual upload, then Apify, or use another method?
2. **Prisma Schema:**
    - Proceed with detailed schema as above, or start minimal for iteration?
3. **Admin Review UI:**
    - Design a review web page, or just backend structure + API for now?
4. **Category Output Schemas:**
    - Need rough field structure per category (sample: Spend Offers = bank, card, reward, expiry, etc.)
    - Can you draft or approve a first-cut list for Spend Offers and one more?
5. **Immediate First Steps:**
    - Should we:
        - Build the Prisma schema + migrations,
        - Focus on LLM extraction prompt/testing,
        - Set up manual MVP input,
        - Or prioritize a different task?
6. **AI/Processing Budget:**
    - Hard cap of \$20/mo during early stage?
7. **Images/Threads:**
    - Images and thread context: skip for MVP or plan schema for later support?

***

## 10. Next Steps

**Please review the above documentation and answer (or comment on) the questions in Section 9.**
Once you confirm, I will proceed with the first item in the approved implementation pathway.

***

Let me know when you've reviewed and are ready for next steps!

