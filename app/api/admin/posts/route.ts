/**
 * API Routes: Admin Posts CRUD
 * GET /api/admin/posts - List all posts with filters
 * POST /api/admin/posts - Create new post
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { preparePostForDatabase } from '@/lib/validators'

const prisma = new PrismaClient()

// GET - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryType = searchParams.get('categoryType')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (categoryType) where.categoryType = categoryType
    if (status) where.status = status

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          bank: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Fetch CardConfig for validation
    const cardConfig = await prisma.cardConfig.findUnique({
      where: { categoryType: data.categoryType }
    })

    if (!cardConfig) {
      return NextResponse.json(
        { error: 'Invalid category type' },
        { status: 400 }
      )
    }

    // TODO: Add validation using validatePost() from lib/validators
    // For now, we'll skip validation to get the basic flow working

    // Prepare data for database (convert objects/arrays to JSON strings)
    const preparedData = preparePostForDatabase(data)

    // Generate slug from title if not provided
    if (!preparedData.slug) {
      preparedData.slug = preparedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        ...preparedData,
        authorId: (session.user as any).id
      },
      include: {
        bank: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
