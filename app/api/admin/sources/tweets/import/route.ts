import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ParsedTweet } from '@/lib/utils/csv-parser';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { tweets } = body as { tweets: ParsedTweet[] };

        if (!tweets || !Array.isArray(tweets) || tweets.length === 0) {
            return NextResponse.json({ error: 'No tweets provided' }, { status: 400 });
        }

        // Process imports in transaction
        let importedCount = 0;
        const errors: string[] = [];

        for (const tweet of tweets) {
            try {
                // Check if tweet already exists
                const existing = await prisma.rawTweet.findUnique({
                    where: { tweetUrl: tweet.tweetUrl },
                });

                if (existing) {
                    // Update existing tweet if needed, or skip
                    // For now, we'll just skip duplicates
                    continue;
                }

                await prisma.rawTweet.create({
                    data: {
                        tweetUrl: tweet.tweetUrl,
                        tweetId: tweet.tweetId,
                        content: tweet.content,
                        authorHandle: tweet.authorHandle,
                        authorName: tweet.authorName,
                        postedAt: new Date(tweet.postedAt),
                        isRelevant: null, // To be checked by AI
                        processed: false,
                    },
                });
                importedCount++;
            } catch (error) {
                console.error(`Failed to import tweet ${tweet.tweetUrl}:`, error);
                errors.push(`Failed to import ${tweet.tweetUrl}`);
            }
        }

        return NextResponse.json({
            success: true,
            count: importedCount,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error) {
        console.error('Import API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
