/**
 * API Routes: Admin Banks CRUD
 * GET /api/admin/banks - List all banks
 * POST /api/admin/banks - Create new bank
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all banks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'

    const banks = await prisma.bank.findMany({
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

    return NextResponse.json(banks)
  } catch (error) {
    console.error('Error fetching banks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new bank
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
        { error: 'Bank name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name if not provided
    const slug = data.slug || data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Create bank
    const bank = await prisma.bank.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo || null,
        brandColor: data.brandColor || null,
        description: data.description || null
      }
    })

    return NextResponse.json(bank, { status: 201 })
  } catch (error: any) {
    console.error('Error creating bank:', error)

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A bank with this name or slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
