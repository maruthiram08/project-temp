import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { extractedData, category } = body;

        if (!extractedData) {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        await prisma.pendingPost.update({
            where: { id },
            data: {
                extractedData: JSON.stringify(extractedData),
                category: category, // Allow changing category if needed
                // Reset low confidence fields since manual edit implies review
                lowConfidenceFields: '[]',
                status: 'pending_approval', // Move to pending approval after edit
            },
        });

        return NextResponse.json({
            success: true,
        });

    } catch (error) {
        console.error('Update API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
