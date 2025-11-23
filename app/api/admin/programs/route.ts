/**
 * API Routes: Admin Programs (Hotels/Airlines) CRUD
 * GET /api/admin/programs - List all programs
 * POST /api/admin/programs - Create new program
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all programs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const includeStats = searchParams.get('stats') === 'true'
        const type = searchParams.get('type') // 'airline', 'hotel', or null for all

        const where = type ? { type } : {}

        const programs = await prisma.program.findMany({
            where,
            orderBy: { name: 'asc' },
            ...(includeStats && {
                include: {
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                }
            })
        })

        return NextResponse.json(programs)
    } catch (error) {
        console.error('Error fetching programs:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST - Create new program
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !(session.user as any)?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        // Validate required fields
        if (!data.name) {
            return NextResponse.json(
                { error: 'Program name is required' },
                { status: 400 }
            )
        }

        if (!data.type || !['airline', 'hotel', 'other'].includes(data.type)) {
            return NextResponse.json(
                { error: 'Valid program type is required (airline, hotel, or other)' },
                { status: 400 }
            )
        }

        // Generate slug from name if not provided
        const slug = data.slug || data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        // Create program
        const program = await prisma.program.create({
            data: {
                name: data.name,
                slug,
                type: data.type,
                logo: data.logo || null,
                brandColor: data.brandColor || null,
                description: data.description || null
            }
        })

        return NextResponse.json(program, { status: 201 })
    } catch (error: any) {
        console.error('Error creating program:', error)

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
