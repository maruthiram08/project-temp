/**
 * Tweet Processing Pipeline
 * Multi-stage AI extraction for credit card content
 */

import { openai, AI_MODELS, AI_CONFIG } from './openai-client';
import {
    relevanceSchema,
    categoryDetectionSchema,
    spendOfferExtractionSchema,
    lifetimeFreeExtractionSchema,
    stackingHackExtractionSchema,
    joiningBonusExtractionSchema,
    transferBonusExtractionSchema,
    type RelevanceResult,
    type CategoryDetectionResult,
    type ExtractionResult,
} from './schemas';
import {
    RELEVANCE_FILTER_PROMPT,
    CATEGORY_DETECTION_PROMPT,
    SPEND_OFFER_EXTRACTION_PROMPT,
    LIFETIME_FREE_EXTRACTION_PROMPT,
    STACKING_HACK_EXTRACTION_PROMPT,
    JOINING_BONUS_EXTRACTION_PROMPT,
    TRANSFER_BONUS_EXTRACTION_PROMPT,
} from './prompts';
import { CATEGORY_TYPES } from '@/types/categories';
import { zodResponseFormat } from 'openai/helpers/zod';

// ============================================================================
// TYPES
// ============================================================================

export interface TweetData {
    content: string;
    authorHandle: string;
    authorName: string;
    tweetUrl: string;
    postedAt: Date;
}

export interface ProcessingResult {
    isRelevant: boolean;
    relevanceConfidence: number;
    category?: string;
    categoryConfidence?: number;
    extractedData?: ExtractionResult;
    overallConfidence?: number;
    lowConfidenceFields?: string[];
    reviewerNotes?: string;
    error?: string;
}

// ============================================================================
// STAGE 1: RELEVANCE FILTER
// ============================================================================

export async function checkRelevance(tweet: TweetData): Promise<RelevanceResult> {
    try {
        const completion = await openai.chat.completions.create({
            model: AI_MODELS.RELEVANCE_FILTER,
            messages: [
                {
                    role: 'system',
                    content: RELEVANCE_FILTER_PROMPT,
                },
                {
                    role: 'user',
                    content: `Tweet:\n${tweet.content}\n\nAuthor: ${tweet.authorHandle}`,
                },
            ],
            temperature: AI_CONFIG.TEMPERATURE,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content in relevance check response');
        }

        // Extract JSON from markdown code blocks if present
        let jsonContent = content.trim();
        const jsonMatch = jsonContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }

        const parsed = JSON.parse(jsonContent);
        const result = relevanceSchema.parse(parsed);
        return result;
    } catch (error) {
        console.error('Relevance check error:', error);
        throw new Error('Failed to check tweet relevance');
    }
}

// ============================================================================
// STAGE 2: CATEGORY DETECTION
// ============================================================================

export async function detectCategory(tweet: TweetData): Promise<CategoryDetectionResult> {
    try {
        const completion = await openai.chat.completions.create({
            model: AI_MODELS.EXTRACTION,
            messages: [
                {
                    role: 'system',
                    content: CATEGORY_DETECTION_PROMPT,
                },
                {
                    role: 'user',
                    content: `Tweet:\n${tweet.content}\n\nAuthor: ${tweet.authorHandle}\nPosted: ${tweet.postedAt.toISOString()}`,
                },
            ],
            temperature: AI_CONFIG.TEMPERATURE,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content in category detection response');
        }

        // Extract JSON from markdown code blocks if present
        let jsonContent = content.trim();
        const jsonMatch = jsonContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }

        const parsed = JSON.parse(jsonContent);
        const result = categoryDetectionSchema.parse(parsed);
        return result;
    } catch (error) {
        console.error('Category detection error:', error);
        throw new Error('Failed to detect category');
    }
}

// ============================================================================
// STAGE 3: FIELD EXTRACTION
// ============================================================================

export async function extractFields(
    tweet: TweetData,
    category: string
): Promise<ExtractionResult> {
    // Select schema and prompt based on category
    const { schema, prompt } = getExtractionConfig(category);

    let parsedData: any = null;
    try {
        const completion = await openai.chat.completions.create({
            model: AI_MODELS.EXTRACTION,
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
                {
                    role: 'user',
                    content: `Tweet Content:\n${tweet.content}\n\nAuthor: ${tweet.authorHandle}\nURL: ${tweet.tweetUrl}\nPosted: ${tweet.postedAt.toISOString()}`,
                },
            ],
            temperature: AI_CONFIG.TEMPERATURE,
            max_tokens: AI_CONFIG.MAX_TOKENS,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content in field extraction response');
        }

        // Extract JSON from markdown code blocks if present
        let jsonContent = content.trim();
        const jsonMatch = jsonContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
        }

        parsedData = JSON.parse(jsonContent);

        // Log the parsed data for debugging
        console.log('[AI] Parsed extraction data:', JSON.stringify(parsedData, null, 2));

        const result = schema.parse(parsedData);

        // Fill in missing shared fields if needed
        // @ts-ignore - we know these fields exist on the result type even if optional in schema
        if (!result.title) {
            // @ts-ignore
            result.title = (result.offerTitle || result.cardName || result.stackTitle || 'New Offer') + ' - Deal Alert';
        }

        // @ts-ignore
        if (!result.excerpt) {
            // @ts-ignore
            result.excerpt = result.shortDescription || (result.detailsContent ? result.detailsContent.substring(0, 150) + '...' : 'Check out this new credit card deal.');
        }

        // @ts-ignore
        if (!result.detailsContent) {
            // @ts-ignore
            result.detailsContent = result.excerpt || 'No details provided.';
        }

        return result as ExtractionResult;
    } catch (error) {
        console.error('Field extraction error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        // Log the category for context
        console.error('Failed category:', category);
        throw new Error(`Failed to extract fields for category: ${category}. Data: ${JSON.stringify(parsedData)}`);
    }
}

function getExtractionConfig(category: string) {
    switch (category) {
        case CATEGORY_TYPES.SPEND_OFFERS:
            return {
                schema: spendOfferExtractionSchema,
                prompt: SPEND_OFFER_EXTRACTION_PROMPT,
            };
        case CATEGORY_TYPES.LIFETIME_FREE:
            return {
                schema: lifetimeFreeExtractionSchema,
                prompt: LIFETIME_FREE_EXTRACTION_PROMPT,
            };
        case CATEGORY_TYPES.STACKING_HACKS:
            return {
                schema: stackingHackExtractionSchema,
                prompt: STACKING_HACK_EXTRACTION_PROMPT,
            };
        case CATEGORY_TYPES.JOINING_BONUS:
            return {
                schema: joiningBonusExtractionSchema,
                prompt: JOINING_BONUS_EXTRACTION_PROMPT,
            };
        case CATEGORY_TYPES.TRANSFER_BONUS:
            return {
                schema: transferBonusExtractionSchema,
                prompt: TRANSFER_BONUS_EXTRACTION_PROMPT,
            };
        default:
            throw new Error(`Unknown category: ${category}`);
    }
}

// ============================================================================
// STAGE 4: CONFIDENCE CALCULATION
// ============================================================================

function calculateOverallConfidence(extractedData: ExtractionResult): {
    overall: number;
    lowConfidenceFields: string[];
    notes: string[];
} {
    const fieldConfidence = extractedData.fieldConfidence || {};
    const scores = Object.values(fieldConfidence) as number[];

    if (scores.length === 0) {
        return {
            overall: 50,
            lowConfidenceFields: [],
            notes: ['No confidence scores provided by AI'],
        };
    }

    // Calculate average confidence
    const overall = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Identify low-confidence fields (< 70)
    const lowConfidenceFields = Object.entries(fieldConfidence)
        .filter(([_, score]) => score < 70)
        .map(([field]) => field);

    // Generate reviewer notes
    const notes: string[] = [];
    if (lowConfidenceFields.length > 0) {
        notes.push(`Low confidence fields: ${lowConfidenceFields.join(', ')}`);
    }
    if (overall < 60) {
        notes.push('Overall extraction confidence is low. Manual review recommended.');
    } else if (overall < 80) {
        notes.push('Some fields may need verification. Review flagged fields.');
    }

    return {
        overall: Math.round(overall),
        lowConfidenceFields,
        notes,
    };
}

// ============================================================================
// COMPLETE PIPELINE
// ============================================================================

export async function processTweet(tweet: TweetData): Promise<ProcessingResult> {
    try {
        // Stage 1: Check relevance
        console.log(`[AI] Stage 1: Checking relevance for ${tweet.tweetUrl}`);
        const relevanceResult = await checkRelevance(tweet);

        if (!relevanceResult.isRelevant) {
            return {
                isRelevant: false,
                relevanceConfidence: relevanceResult.confidence,
            };
        }

        // Stage 2: Detect category
        console.log(`[AI] Stage 2: Detecting category`);
        const categoryResult = await detectCategory(tweet);

        // Stage 3: Extract fields
        console.log(`[AI] Stage 3: Extracting fields for ${categoryResult.category}`);
        const extractedData = await extractFields(tweet, categoryResult.category);

        // Stage 4: Calculate confidence
        console.log(`[AI] Stage 4: Calculating confidence scores`);
        const { overall, lowConfidenceFields, notes } = calculateOverallConfidence(extractedData);

        return {
            isRelevant: true,
            relevanceConfidence: relevanceResult.confidence,
            category: categoryResult.category,
            categoryConfidence: categoryResult.confidence,
            extractedData,
            overallConfidence: overall,
            lowConfidenceFields,
            reviewerNotes: notes.join(' '),
        };
    } catch (error) {
        console.error('[AI] Processing error:', error);
        return {
            isRelevant: true, // Assume relevant to trigger manual review
            relevanceConfidence: 50,
            error: error instanceof Error ? error.message : 'Unknown processing error',
            reviewerNotes: 'AI processing failed. Manual entry required.',
        };
    }
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

export async function processTweetBatch(
    tweets: TweetData[],
    onProgress?: (processed: number, total: number) => void
): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        console.log(`[AI] Processing tweet ${i + 1}/${tweets.length}: ${tweet.tweetUrl}`);

        try {
            const result = await processTweet(tweet);
            results.push(result);
        } catch (error) {
            console.error(`[AI] Failed to process tweet ${tweet.tweetUrl}:`, error);
            results.push({
                isRelevant: false,
                relevanceConfidence: 0,
                error: error instanceof Error ? error.message : 'Processing failed',
            });
        }

        // Call progress callback
        if (onProgress) {
            onProgress(i + 1, tweets.length);
        }

        // Small delay to avoid rate limits
        if (i < tweets.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
}
