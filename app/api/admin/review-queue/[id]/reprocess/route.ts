import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processTweet } from '@/lib/ai/tweet-processor';
import { matchBank } from '@/lib/utils/bank-matcher';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch pending post and associated raw tweet
        const pendingPost = await prisma.pendingPost.findUnique({
            where: { id },
            include: { rawTweet: true },
        });

        if (!pendingPost) {
            return NextResponse.json({ error: 'Pending post not found' }, { status: 404 });
        }

        // Run AI processing again
        const result = await processTweet({
            content: pendingPost.rawTweet.content,
            authorHandle: pendingPost.rawTweet.authorHandle,
            authorName: pendingPost.rawTweet.authorName,
            tweetUrl: pendingPost.rawTweet.tweetUrl,
            postedAt: pendingPost.rawTweet.postedAt,
        });

        if (!result.isRelevant) {
            // If AI now thinks it's irrelevant, we might want to reject it or just flag it
            // For now, let's update the notes but keep it in the queue
            await prisma.pendingPost.update({
                where: { id },
                data: {
                    reviewerNotes: `Reprocessed: AI now marks this as irrelevant. Previous notes: ${pendingPost.reviewerNotes || ''}`,
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Reprocessed: AI marked as irrelevant',
            });
        }

        // Match bank again
        let bankId = undefined;
        // @ts-ignore
        const bankName = result.extractedData?.bankName;
        if (bankName) {
            const bankMatch = await matchBank(bankName);
            if (bankMatch.bankId && bankMatch.confidence > 80) {
                bankId = bankMatch.bankId;
            }
        }

        // Update PendingPost with new data
        await prisma.pendingPost.update({
            where: { id },
            data: {
                category: result.category,
                extractedData: JSON.stringify({
                    ...result.extractedData,
                    bankId,
                }),
                confidence: result.overallConfidence || 0,
                lowConfidenceFields: result.lowConfidenceFields ? JSON.stringify(result.lowConfidenceFields) : null,
                reviewerNotes: `Reprocessed. ${result.reviewerNotes || ''}`,
                // We don't automatically change status back to pending_review if it was already being worked on,
                // but usually re-processing implies a reset. Let's reset to pending_review.
                status: 'pending_review',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully reprocessed tweet',
        });

    } catch (error) {
        console.error('Reprocess API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
