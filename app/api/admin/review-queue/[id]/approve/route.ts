import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { preparePostForDatabase } from '@/lib/validators';

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

        // Fetch pending post
        const pendingPost = await prisma.pendingPost.findUnique({
            where: { id },
            include: { rawTweet: true },
        });

        if (!pendingPost) {
            return NextResponse.json({ error: 'Pending post not found' }, { status: 404 });
        }

        if (pendingPost.status === 'approved') {
            return NextResponse.json({ error: 'Post already approved' }, { status: 400 });
        }

        // Parse extracted data
        let extractedData: any = {};
        try {
            extractedData = JSON.parse(pendingPost.extractedData);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid extracted data JSON' }, { status: 500 });
        }

        // Separate shared fields from category-specific fields
        const {
            title,
            excerpt,
            detailsContent,
            bankId,
            expiryDate,
            ctaUrl,
            fieldConfidence, // Remove this from categoryData
            ...categoryData
        } = extractedData;

        // Generate title from category-specific fields if not present
        let postTitle = title;
        if (!postTitle || postTitle === 'Extraction Failed' || postTitle === 'Untitled') {
            // Try to extract from category-specific fields
            if (categoryData.offerTitle) {
                postTitle = categoryData.offerTitle; // SPEND_OFFERS
            } else if (categoryData.cardName) {
                postTitle = categoryData.cardName; // LIFETIME_FREE, JOINING_BONUS
            } else if (categoryData.stackTitle) {
                postTitle = categoryData.stackTitle; // STACKING_HACKS
            } else if (categoryData.sourceProgram && categoryData.destinationProgram) {
                postTitle = `${categoryData.sourceProgram} to ${categoryData.destinationProgram} Transfer`; // TRANSFER_BONUS
            } else {
                // Fallback to first 60 chars of detailsContent or excerpt
                const fallbackText = detailsContent || excerpt || '';
                postTitle = fallbackText.length > 60
                    ? fallbackText.substring(0, 60) + '...'
                    : fallbackText || 'Untitled Post';
            }
        }

        // Generate slug
        const baseSlug = (postTitle || 'untitled')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await prisma.post.findUnique({ where: { slug } });
            if (!existing) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Prepare content (JSON structure required by Post model)
        const content = JSON.stringify([
            { type: 'text', content: detailsContent || excerpt || '' }
        ]);

        // Create Post
        const postData = {
            title: postTitle,
            slug,
            content,
            excerpt: excerpt || '',
            categoryType: pendingPost.category,
            bankId: bankId || null,
            expiryDateTime: expiryDate ? new Date(expiryDate) : null,
            detailsContent: detailsContent || '',
            ctaUrl: ctaUrl || null,
            status: 'draft', // Always start as draft
            categoryData, // Will be stringified by preparePostForDatabase
            authorId: session.user.id,
        };

        const preparedData = preparePostForDatabase(postData);

        // Transaction: Create Post, Update PendingPost, Update RawTweet
        const result = await prisma.$transaction(async (tx) => {
            const newPost = await tx.post.create({
                data: preparedData,
            });

            await tx.pendingPost.update({
                where: { id },
                data: {
                    status: 'approved',
                    publishedPostId: newPost.id,
                    adminNotes: 'Approved via Review Queue',
                },
            });

            return newPost;
        });

        return NextResponse.json({
            success: true,
            post: result,
        });

    } catch (error) {
        console.error('Approve API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
