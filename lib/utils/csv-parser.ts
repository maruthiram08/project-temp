/**
 * CSV/Excel Parser for Tweet Import
 * Parses uploaded files into tweet data objects
 */

import Papa from 'papaparse';

export interface TweetCSVRow {
    tweet_url: string;
    tweet_text: string;
    author_handle: string;
    author_name?: string;
    posted_date?: string;
    likes?: string;
    retweets?: string;
}

export interface ParsedTweet {
    tweetUrl: string;
    tweetId: string;
    content: string;
    authorHandle: string;
    authorName: string;
    postedAt: Date;
    metadata?: {
        likes?: number;
        retweets?: number;
    };
}

export interface ParseResult {
    success: boolean;
    tweets: ParsedTweet[];
    errors: string[];
    warnings: string[];
}

/**
 * Parse CSV file to tweet objects
 */
export async function parseCSV(fileContent: string): Promise<ParseResult> {
    return new Promise((resolve) => {
        const tweets: ParsedTweet[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        Papa.parse<TweetCSVRow>(fileContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: (results) => {
                // Validate required columns
                const requiredColumns = ['tweet_url', 'tweet_text', 'author_handle'];
                const headers = results.meta.fields || [];

                const missingColumns = requiredColumns.filter(col => !headers.includes(col));
                if (missingColumns.length > 0) {
                    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
                    resolve({ success: false, tweets: [], errors, warnings });
                    return;
                }

                // Process each row
                results.data.forEach((row, index) => {
                    const rowNum = index + 2; // +2 because: +1 for header, +1 for 1-indexed

                    try {
                        // Validate required fields
                        if (!row.tweet_url || !row.tweet_text || !row.author_handle) {
                            warnings.push(`Row ${rowNum}: Missing required fields, skipped`);
                            return;
                        }

                        // Extract tweet ID from URL
                        const tweetId = extractTweetId(row.tweet_url);
                        if (!tweetId) {
                            warnings.push(`Row ${rowNum}: Invalid tweet URL format: ${row.tweet_url}`);
                            return;
                        }

                        // Parse posted date
                        let postedAt: Date;
                        if (row.posted_date) {
                            postedAt = new Date(row.posted_date);
                            if (isNaN(postedAt.getTime())) {
                                warnings.push(`Row ${rowNum}: Invalid date "${row.posted_date}", using current date`);
                                postedAt = new Date();
                            }
                        } else {
                            postedAt = new Date();
                        }

                        // Create tweet object
                        const tweet: ParsedTweet = {
                            tweetUrl: row.tweet_url.trim(),
                            tweetId,
                            content: row.tweet_text.trim(),
                            authorHandle: row.author_handle.trim().replace(/^@/, ''), // Remove @ if present
                            authorName: row.author_name?.trim() || row.author_handle.trim().replace(/^@/, ''),
                            postedAt,
                        };

                        // Add optional metadata
                        if (row.likes || row.retweets) {
                            tweet.metadata = {
                                likes: row.likes ? parseInt(row.likes, 10) : undefined,
                                retweets: row.retweets ? parseInt(row.retweets, 10) : undefined,
                            };
                        }

                        tweets.push(tweet);
                    } catch (error) {
                        errors.push(`Row ${rowNum}: ${error instanceof Error ? error.message : 'Parse error'}`);
                    }
                });

                // Summary
                if (tweets.length === 0 && errors.length === 0) {
                    errors.push('No valid tweets found in CSV');
                }

                resolve({
                    success: errors.length === 0,
                    tweets,
                    errors,
                    warnings,
                });
            },
            error: (error) => {
                errors.push(`CSV parse error: ${error.message}`);
                resolve({ success: false, tweets: [], errors, warnings });
            },
        });
    });
}

/**
 * Extract tweet ID from Twitter/X URL
 */
export function extractTweetId(url: string): string | null {
    // Patterns:
    // https://twitter.com/username/status/1234567890
    // https://x.com/username/status/1234567890
    // twitter.com/username/status/1234567890

    const patterns = [
        /(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/i,
        /status\/(\d+)/i,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate tweet URL format
 */
export function isValidTweetUrl(url: string): boolean {
    return extractTweetId(url) !== null;
}

/**
 * Generate sample CSV template
 */
export function generateSampleCSV(): string {
    const headers = [
        'tweet_url',
        'tweet_text',
        'author_handle',
        'author_name',
        'posted_date',
        'likes',
        'retweets',
    ];

    const sampleRows = [
        [
            'https://twitter.com/AmazingCreditC/status/1234567890',
            'HDFC Infinia - 10% cashback on groceries at BigBasket. Valid till March 31!',
            '@AmazingCreditC',
            'Amazing Credit Cards',
            '2024-01-15',
            '125',
            '45',
        ],
        [
            'https://twitter.com/CardDeals/status/9876543210',
            'ICICI Amazon Pay Card - ₹0 annual fee forever + 5% cashback on Amazon',
            '@CardDeals',
            'Card Deals India',
            '2024-01-16',
            '89',
            '23',
        ],
    ];

    return Papa.unparse({
        fields: headers,
        data: sampleRows,
    });
}

/**
 * Export utilities
 */
export const csvUtils = {
    parseCSV,
    extractTweetId,
    isValidTweetUrl,
    generateSampleCSV,
};
