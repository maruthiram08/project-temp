/**
 * API Routes: Admin Programs (Single Program)
 * GET /api/admin/programs/[id] - Get single program
 * PUT /api/admin/programs/[id] - Update program
 * DELETE /api/admin/programs/[id] - Delete program
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch single program by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const program = await prisma.program.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 })
        }

        return NextResponse.json(program)
    } catch (error) {
        console.error('Error fetching program:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update program
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !(session.user as any)?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const data = await request.json()

        // Check if program exists
        const existingProgram = await prisma.program.findUnique({
            where: { id }
        })

        if (!existingProgram) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 })
        }

        // Validate type if provided
        if (data.type && !['airline', 'hotel', 'other'].includes(data.type)) {
            return NextResponse.json(
                { error: 'Valid program type is required (airline, hotel, or other)' },
                { status: 400 }
            )
        }

        // Update slug if name changed
        const updateData: any = {}
        if (data.name) {
            updateData.name = data.name
            if (!data.slug) {
                updateData.slug = data.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
            }
        }
        if (data.slug) updateData.slug = data.slug
        if (data.type) updateData.type = data.type
        if (data.logo !== undefined) updateData.logo = data.logo
        if (data.brandColor !== undefined) updateData.brandColor = data.brandColor
        if (data.description !== undefined) updateData.description = data.description

        // Update program
        const updatedProgram = await prisma.program.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(updatedProgram)
    } catch (error: any) {
        console.error('Error updating program:', error)

        // Handle unique constraint violations
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'A program with this name or slug already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete program
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !(session.user as any)?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        // Check if program exists
        const existingProgram = await prisma.program.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        if (!existingProgram) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 })
        }

        // Prevent deletion if program has associated posts
        if (existingProgram._count.posts > 0) {
            return NextResponse.json(
                {
                    error: `Cannot delete program. It has ${existingProgram._count.posts} associated post(s).`,
                    postsCount: existingProgram._count.posts
                },
                { status: 409 }
            )
        }

        // Delete program
        await prisma.program.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: `Program "${existingProgram.name}" deleted successfully`
        })
    } catch (error: any) {
        console.error('Error deleting program:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
