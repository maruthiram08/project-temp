import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processTweet } from '@/lib/ai/tweet-processor';
import { matchBank } from '@/lib/utils/bank-matcher';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { tweetIds } = body as { tweetIds: string[] };

        if (!tweetIds || !Array.isArray(tweetIds) || tweetIds.length === 0) {
            return NextResponse.json({ error: 'No tweet IDs provided' }, { status: 400 });
        }

        // Fetch tweets
        const tweets = await prisma.rawTweet.findMany({
            where: {
                id: { in: tweetIds },
            },
        });

        const results = [];

        for (const tweet of tweets) {
            try {
                // Process with AI
                const result = await processTweet({
                    content: tweet.content,
                    authorHandle: tweet.authorHandle,
                    authorName: tweet.authorName,
                    tweetUrl: tweet.tweetUrl,
                    postedAt: tweet.postedAt,
                });

                // Update RawTweet status
                await prisma.rawTweet.update({
                    where: { id: tweet.id },
                    data: {
                        processed: true,
                        isRelevant: result.isRelevant,
                    },
                });

                // If relevant and successfully extracted
                if (result.isRelevant && result.category && result.extractedData) {
                    // ... (existing success logic) ...
                    // Try to match bank
                    let bankId = undefined;
                    // @ts-ignore - extractedData type is union, but all have bankName optional
                    const bankName = result.extractedData.bankName;

                    if (bankName) {
                        const bankMatch = await matchBank(bankName);
                        if (bankMatch.bankId && bankMatch.confidence > 80) {
                            bankId = bankMatch.bankId;
                        }
                    }

                    // Determine status based on confidence
                    let status = 'pending_review';
                    if ((result.overallConfidence || 0) < 60) {
                        status = 'needs_manual_entry';
                    } else if ((result.overallConfidence || 0) > 80) {
                        status = 'pending_approval';
                    }

                    // Create PendingPost
                    const pendingPost = await prisma.pendingPost.create({
                        data: {
                            rawTweetId: tweet.id,
                            category: result.category,
                            extractedData: JSON.stringify({
                                ...result.extractedData,
                                bankId, // Add matched bank ID to data
                            }),
                            confidence: result.overallConfidence || 0,
                            status,
                            lowConfidenceFields: result.lowConfidenceFields ? JSON.stringify(result.lowConfidenceFields) : null,
                            reviewerNotes: result.reviewerNotes,
                        },
                    });

                    results.push({
                        tweetId: tweet.id,
                        success: true,
                        pendingPostId: pendingPost.id,
                    });

                } else if (result.isRelevant) {
                    // Relevant but extraction failed or missing data - Create Manual Entry
                    const pendingPost = await prisma.pendingPost.create({
                        data: {
                            rawTweetId: tweet.id,
                            category: 'OTHER', // Default to OTHER for manual fix
                            extractedData: JSON.stringify({
                                title: 'Extraction Failed',
                                detailsContent: tweet.content,
                                fieldConfidence: {},
                            }),
                            confidence: result.relevanceConfidence || 0,
                            status: 'needs_manual_entry',
                            reviewerNotes: `Extraction failed or incomplete. AI Error: ${result.error || 'Unknown error'}. Manual review required.`,
                        },
                    });

                    results.push({
                        tweetId: tweet.id,
                        success: true,
                        pendingPostId: pendingPost.id,
                        note: 'Created manual review entry for failed extraction',
                    });

                } else {
                    // Irrelevant tweet - Skip completely as per latest user request
                    results.push({
                        tweetId: tweet.id,
                        success: true,
                        relevant: false,
                        note: 'Skipped irrelevant tweet',
                    });
                }

            } catch (error) {
                console.error(`Failed to process tweet ${tweet.id}:`, error);
                results.push({
                    tweetId: tweet.id,
                    success: false,
                    error: error instanceof Error ? error.message : 'Processing failed',
                });
            }
        }

        return NextResponse.json({
            success: true,
            results,
        });

    } catch (error) {
        console.error('Process API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
