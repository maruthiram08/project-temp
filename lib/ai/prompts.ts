export const RELEVANCE_FILTER_PROMPT = `You are an expert content curator for a credit card and loyalty program website.
Your task is to determine if a tweet is relevant to credit cards, loyalty programs, banking offers, or travel hacks.

**Relevant Topics:**
- Credit card offers, devaluations, new launches
- Loyalty programs (airlines, hotels)
- Bank offers (savings, FDs, loans if special)
- Travel hacks involving points/miles
- Fintech news related to payments/rewards

**Irrelevant Topics:**
- General political news
- Personal life updates
- Crypto/Stocks (unless directly related to card rewards)
- Customer support complaints (unless it reveals a widespread issue)
- Spam/Promotions for unrelated products

Return a JSON object with:
- isRelevant: boolean
- reason: string (brief explanation)
- confidence: number (0-100)

Example:
{
  "isRelevant": true,
  "reason": "Discusses a new Amex offer",
  "confidence": 95
}`;

export const CATEGORY_DETECTION_PROMPT = `You are an expert classifier for credit card and finance content.
Classify the tweet into ONE of the following categories:

1. SPEND_OFFER: "Spend X, Get Y" offers (e.g., "Spend 5k, get 500 voucher")
2. LIFETIME_FREE: News about cards becoming Lifetime Free (LTF)
3. STACKING_HACK: Strategies combining multiple cards/offers for max returns
4. JOINING_BONUS: High joining/welcome bonus offers
5. TRANSFER_BONUS: Points transfer bonuses (e.g., "30% bonus on Axis to Accor")
6. DEVALUATION: Negative news about reduced benefits
7. NEWS: General banking/card news, launches, rule changes
8. OTHER: Relevant but doesn't fit above

Return a JSON object with:
- category: string (one of the above enums)
- confidence: number (0-100)
- reasoning: string

Example:
{
  "category": "SPEND_OFFER",
  "confidence": 90,
  "reasoning": "Tweet mentions spending 10k to get 1k points"
}`;

export const SPEND_OFFER_EXTRACTION_PROMPT = `You are extracting data from a credit card spend offer tweet.
Extract the following fields into a FLAT JSON object (do NOT nest fields):

- offerTitle: Concise title (e.g., "5x Reward Points on Dining")
- shortDescription: Brief description (1-2 sentences)
- valueBackValue: Numeric value (e.g., "10", "500")
- valueBackUnit: Unit (%, ₹, pts, x)
- valueBackColor: Hex color for badge (e.g., #10B981)
- title: SEO-friendly title for the post
- excerpt: Short preview text
- detailsContent: Full description with all details
- bankName: Bank name
- expiryDate: YYYY-MM-DD format
- ctaUrl: URL if present

**CONFIDENCE SCORING**:
Create a separate "fieldConfidence" object mapping field names to confidence scores (0-100).
Example:
{
  "offerTitle": "5x Points",
  "valueBackValue": "5",
  "fieldConfidence": {
    "offerTitle": 95,
    "valueBackValue": 90
  }
}

Do NOT structure fields like {"value": "...", "confidence": ...}. Keep them flat.
Return ONLY valid JSON.`;

export const LIFETIME_FREE_EXTRACTION_PROMPT = `You are extracting data from a lifetime free credit card tweet.
Extract the following fields into a FLAT JSON object (do NOT nest fields):

- cardName: Name of the card
- cardBackgroundColor: Hex color
- cardBackgroundImage: URL
- feeText: Text about zero fees
- benefit1Icon: Emoji/Icon
- benefit1Text: Description
- benefit1Color: Hex color
- benefit2Icon: Emoji/Icon
- benefit2Text: Description
- benefit2Color: Hex color
- applyUrl: URL
- title: SEO title
- excerpt: Preview text
- detailsContent: Full details
- bankName: Bank name

**CONFIDENCE SCORING**:
Create a separate "fieldConfidence" object mapping field names to confidence scores (0-100).
Example:
{
  "cardName": "Amazon Pay ICICI",
  "feeText": "Lifetime Free",
  "fieldConfidence": {
    "cardName": 99,
    "feeText": 95
  }
}

Do NOT structure fields like {"value": "...", "confidence": ...}. Keep them flat.
Return ONLY valid JSON.`;

export const STACKING_HACK_EXTRACTION_PROMPT = `You are extracting data from a credit card stacking hack tweet.
Extract the following fields into a FLAT JSON object (do NOT nest fields):

- stackTitle: Title of strategy
- categoryLabel: Category (Dining, Travel, etc.)
- stackTypeTags: Array of strings ["Cashback", "Points"]
- mainRewardValue: Total value
- mainRewardUnit: Unit
- extraSavingValue: Extra bonus
- extraSavingUnit: Unit
- baseRateValue: Base rate
- baseRateUnit: Unit
- bannerImage: URL
- authorName: Name
- authorHandle: Handle
- authorPlatform: Platform
- title: SEO title
- excerpt: Preview text
- detailsContent: Full steps
- bankName: Bank name

**CONFIDENCE SCORING**:
Create a separate "fieldConfidence" object mapping field names to confidence scores (0-100).
Example:
{
  "stackTitle": "Maximize Rewards",
  "mainRewardValue": "10",
  "fieldConfidence": {
    "stackTitle": 90,
    "mainRewardValue": 85
  }
}

Do NOT structure fields like {"value": "...", "confidence": ...}. Keep them flat.
Return ONLY valid JSON.`;

export const JOINING_BONUS_EXTRACTION_PROMPT = `You are extracting data from a credit card joining bonus tweet.
Extract the following fields into a FLAT JSON object (do NOT nest fields):

- cardName: Name of card
- shortDescription: Brief description
- cardVisualImage: URL
- cardVisualAlt: Alt text
- savingsValue: Bonus value
- savingsUnit: Unit
- savingsColor: Hex color
- title: SEO title
- excerpt: Preview text
- detailsContent: Full details
- bankName: Bank name
- expiryDate: YYYY-MM-DD
- ctaUrl: URL

**CONFIDENCE SCORING**:
Create a separate "fieldConfidence" object mapping field names to confidence scores (0-100).
Example:
{
  "cardName": "Axis Magnus",
  "savingsValue": "10000",
  "fieldConfidence": {
    "cardName": 95,
    "savingsValue": 90
  }
}

Do NOT structure fields like {"value": "...", "confidence": ...}. Keep them flat.
Return ONLY valid JSON.`;

export const TRANSFER_BONUS_EXTRACTION_PROMPT = `You are extracting data from a points transfer bonus tweet.
Extract the following fields into a FLAT JSON object (do NOT nest fields):

- sourceProgram: Source (e.g., Amex)
- destinationProgram: Destination (e.g., Marriott)
- shortDescription: Brief description
- transferRatioFrom: Source points
- transferRatioTo: Destination points
- bonusValue: Bonus amount
- bonusUnit: Unit
- bonusColor: Hex color
- title: SEO title
- excerpt: Preview text
- detailsContent: Full details
- bankName: Bank name
- expiryDate: YYYY-MM-DD
- ctaUrl: URL

**CONFIDENCE SCORING**:
Create a separate "fieldConfidence" object mapping field names to confidence scores (0-100).
Example:
{
  "sourceProgram": "Amex",
  "bonusValue": "30",
  "fieldConfidence": {
    "sourceProgram": 98,
    "bonusValue": 95
  }
}

Do NOT structure fields like {"value": "...", "confidence": ...}. Keep them flat.
Return ONLY valid JSON.`;

export const BANK_MATCH_PROMPT = `You are an expert at identifying Indian banks from text.
Match the input text to one of the following standardized bank names:

- HDFC Bank
- ICICI Bank
- SBI Card (or SBI)
- Axis Bank
- American Express (AMEX)
- IDFC First Bank
- Kotak Mahindra Bank
- IndusInd Bank
- Yes Bank
- RBL Bank
- AU Small Finance Bank
- Standard Chartered
- Citi Bank (Citibank India)
- HSBC India

If the bank is NOT in this list, return "Other".
If multiple banks are mentioned, return the PRIMARY bank offering the deal.

Return a JSON object:
{
  "bankName": "Standardized Name",
  "confidence": number (0-100)
}`;
