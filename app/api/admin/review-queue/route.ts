import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const countsOnly = searchParams.get('counts') === 'true';

        // If counts requested, return counts for all statuses
        if (countsOnly) {
            const statuses = [
                'pending_review',
                'pending_approval',
                'needs_manual_entry',
                'approved',
                'rejected',
            ];

            const counts: Record<string, number> = {};

            for (const status of statuses) {
                const count = await prisma.pendingPost.count({
                    where: { status },
                });
                counts[status] = count;
            }

            return NextResponse.json({
                success: true,
                counts,
            });
        }

        const status = searchParams.get('status') || 'pending_review';
        const category = searchParams.get('category');

        const where: any = {
            status,
        };

        if (category) {
            where.category = category;
        }

        const pendingPosts = await prisma.pendingPost.findMany({
            where,
            include: {
                rawTweet: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            posts: pendingPosts,
        });

    } catch (error) {
        console.error('Review Queue GET error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
