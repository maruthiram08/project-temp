import { z } from 'zod';
import { CATEGORY_TYPES } from '@/types/categories';

// ============================================================================
// RELEVANCE CHECK SCHEMA
// ============================================================================

export const relevanceSchema = z.object({
    isRelevant: z.boolean().describe('Whether the tweet is related to credit cards, deals, offers, or loyalty programs'),
    confidence: z.coerce.number().min(0).max(100).describe('Confidence score 0-100'),
    reason: z.string().describe('Brief explanation of the decision'),
}).passthrough();

export type RelevanceResult = z.infer<typeof relevanceSchema>;

// ============================================================================
// CATEGORY DETECTION SCHEMA
// ============================================================================

export const categoryDetectionSchema = z.object({
    category: z.enum([
        CATEGORY_TYPES.SPEND_OFFERS,
        CATEGORY_TYPES.LIFETIME_FREE,
        CATEGORY_TYPES.STACKING_HACKS,
        CATEGORY_TYPES.JOINING_BONUS,
        CATEGORY_TYPES.TRANSFER_BONUS,
    ]).describe('Detected category type'),
    confidence: z.coerce.number().min(0).max(100).describe('Confidence score 0-100'),
    reasoning: z.string().describe('Brief explanation of category choice'),
}).passthrough();

export type CategoryDetectionResult = z.infer<typeof categoryDetectionSchema>;

// ============================================================================
// FIELD EXTRACTION SCHEMAS (Category-Specific)
// ============================================================================

// Spend Offers
export const spendOfferExtractionSchema = z.object({
    offerTitle: z.string().describe('Concise offer title in English'),
    shortDescription: z.string().optional().describe('Brief description (1-2 sentences) in English'),
    valueBackValue: z.string().describe('Numeric value of benefit (e.g., "10", "500")'),
    valueBackUnit: z.string().describe('Unit of benefit (%, ₹, pts, x)'),
    valueBackColor: z.string().describe('Hex color for badge (e.g., #10B981 for green)'),

    // Shared fields
    title: z.string().optional().describe('Post title for CMS'),
    excerpt: z.string().optional().describe('Short preview text'),
    detailsContent: z.string().optional().describe('Full description with all details'),
    bankName: z.string().optional().describe('Bank name if mentioned'),
    expiryDate: z.string().optional().describe('Expiry date in ISO format YYYY-MM-DD if mentioned'),
    ctaUrl: z.string().optional().describe('External  link URL if mentioned'),

    // Confidence tracking
    fieldConfidence: z.record(z.string(), z.coerce.number()).describe('Confidence score per field (0-100)'),
}).passthrough();

// Lifetime Free Cards
export const lifetimeFreeExtractionSchema = z.object({
    cardName: z.string().describe('Credit card name'),
    cardBackgroundColor: z.string().describe('Hex color for card background'),
    cardBackgroundImage: z.string().optional().describe('URL to card image if available'),
    feeText: z.string().describe('Text describing zero fee (e.g., "₹0 annual fee forever")'),

    benefit1Icon: z.string().describe('Icon name or emoji for first benefit'),
    benefit1Text: z.string().describe('Description of first benefit'),
    benefit1Color: z.string().describe('Hex color for first benefit badge'),

    benefit2Icon: z.string().optional().describe('Icon name or emoji for second benefit'),
    benefit2Text: z.string().optional().describe('Description of second benefit'),
    benefit2Color: z.string().optional().describe('Hex color for second benefit badge'),

    applyUrl: z.string().optional().describe('Application URL if mentioned'),

    // Shared fields
    title: z.string().optional().describe('Post title for CMS'),
    excerpt: z.string().optional().describe('Short preview text'),
    detailsContent: z.string().optional().describe('Full description with all details'),
    bankName: z.string().optional().describe('Bank name if mentioned'),

    fieldConfidence: z.record(z.string(), z.coerce.number()).describe('Confidence score per field (0-100)'),
}).passthrough();

// Stacking Hacks
export const stackingHackExtractionSchema = z.object({
    stackTitle: z.string().describe('Title of the stacking strategy'),
    categoryLabel: z.string().describe('Category (e.g., Dining, Travel, Shopping)'),
    stackTypeTags: z.array(z.string()).describe('Tags like Cashback, Points, Discount'),

    mainRewardValue: z.string().describe('Total combined reward value'),
    mainRewardUnit: z.string().describe('Unit (%, ₹, pts)'),
    extraSavingValue: z.string().describe('Additional bonus from stacking'),
    extraSavingUnit: z.string().describe('Unit (%, ₹, pts)'),
    baseRateValue: z.string().describe('Base reward without stacking'),
    baseRateUnit: z.string().describe('Unit (%, ₹, pts)'),

    bannerImage: z.string().optional().describe('Banner image URL if available'),
    authorName: z.string().optional().describe('Author name if mentioned'),
    authorHandle: z.string().optional().describe('Author Twitter handle if mentioned'),
    authorPlatform: z.string().optional().describe('Platform (twitter, linkedin, etc.)'),

    // Shared fields
    title: z.string().optional().describe('Post title for CMS'),
    excerpt: z.string().optional().describe('Short preview text'),
    detailsContent: z.string().optional().describe('Full description with all steps'),
    bankName: z.string().optional().describe('Bank name if mentioned'),

    fieldConfidence: z.record(z.string(), z.coerce.number()).describe('Confidence score per field (0-100)'),
}).passthrough();

// Joining Bonus
export const joiningBonusExtractionSchema = z.object({
    cardName: z.string().describe('Credit card name'),
    shortDescription: z.string().optional().describe('Brief description of joining offer'),

    cardVisualImage: z.string().optional().describe('Card image URL if available'),
    cardVisualAlt: z.string().optional().describe('Alt text for card image'),

    savingsValue: z.string().describe('Value of joining bonus (e.g., "10000")'),
    savingsUnit: z.string().describe('Unit (₹, pts, miles)'),
    savingsColor: z.string().describe('Hex color for savings badge'),

    // Shared fields
    title: z.string().optional().describe('Post title for CMS'),
    excerpt: z.string().optional().describe('Short preview text'),
    detailsContent: z.string().optional().describe('Full description including fee vs reward comparison'),
    bankName: z.string().optional().describe('Bank name if mentioned'),
    expiryDate: z.string().optional().describe('Offer expiry date in ISO format YYYY-MM-DD if mentioned'),
    ctaUrl: z.string().optional().describe('Application URL if mentioned'),

    fieldConfidence: z.record(z.string(), z.coerce.number()).describe('Confidence score per field (0-100)'),
}).passthrough();

// Transfer Bonus
export const transferBonusExtractionSchema = z.object({
    sourceProgram: z.string().describe('Source loyalty program name'),
    destinationProgram: z.string().describe('Destination loyalty program name'),
    shortDescription: z.string().optional().describe('Brief description of transfer offer'),

    transferRatioFrom: z.string().describe('Source points amount (e.g., "1000")'),
    transferRatioTo: z.string().describe('Destination points amount (e.g., "1000")'),

    bonusValue: z.string().describe('Bonus percentage or points (e.g., "15")'),
    bonusUnit: z.string().describe('Unit (%, pts, miles)'),
    bonusColor: z.string().describe('Hex color for bonus badge'),

    // Shared fields
    title: z.string().optional().describe('Post title for CMS'),
    excerpt: z.string().optional().describe('Short preview text'),
    detailsContent: z.string().optional().describe('Full description with transfer details'),
    bankName: z.string().optional().describe('Bank/program name if applicable'),
    expiryDate: z.string().optional().describe('Offer expiry date in ISO format YYYY-MM-DD if mentioned'),
    ctaUrl: z.string().optional().describe('Transfer page URL if mentioned'),

    fieldConfidence: z.record(z.string(), z.coerce.number()).describe('Confidence score per field (0-100)'),
}).passthrough();

export type SpendOfferExtraction = z.infer<typeof spendOfferExtractionSchema>;
export type LifetimeFreeExtraction = z.infer<typeof lifetimeFreeExtractionSchema>;
export type StackingHackExtraction = z.infer<typeof stackingHackExtractionSchema>;
export type JoiningBonusExtraction = z.infer<typeof joiningBonusExtractionSchema>;
export type TransferBonusExtraction = z.infer<typeof transferBonusExtractionSchema>;

export type ExtractionResult =
    | SpendOfferExtraction
    | LifetimeFreeExtraction
    | StackingHackExtraction
    | JoiningBonusExtraction
    | TransferBonusExtraction;

// ============================================================================
// BANK MATCHING SCHEMA
// ============================================================================

export const bankMatchSchema = z.object({
    bankName: z.string().describe('Extracted bank name'),
    confidence: z.coerce.number().min(0).max(100).describe('Confidence in bank name extraction'),
    alternativeNames: z.array(z.string()).optional().describe('Alternative bank names if multiple possibilities'),
}).passthrough();

export type BankMatchResult = z.infer<typeof bankMatchSchema>;
