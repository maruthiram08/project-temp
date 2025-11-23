/**
 * API Routes: Admin Posts CRUD
 * GET /api/admin/posts - List all posts with filters
 * POST /api/admin/posts - Create new post
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { preparePostForDatabase } from '@/lib/validators'
import { authOptions } from '@/lib/auth'
import { prisma, withRetry } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET - List posts with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Session user:', session.user)

    // Verify that the user exists in the database
    const userId = (session.user as any).id
    const userExists = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: userId }
      })
    )

    if (!userExists) {
      console.error('User not found in database. Session user ID:', userId)
      return NextResponse.json(
        {
          error: 'User not found in database. Please ensure the database is seeded with admin user. Run: npm run seed',
          details: 'The authenticated user does not exist in the database. This usually happens when the production database has not been seeded.'
        },
        { status: 400 }
      )
    }

    const data = await request.json()
    console.log('[POST /api/admin/posts] Received create data:', JSON.stringify(data, null, 2))

    // Fetch CardConfig for validation (with retry for Neon wake-up)
    const cardConfig = await withRetry(() =>
      prisma.cardConfig.findUnique({
        where: { categoryType: data.categoryType }
      })
    )

    if (!cardConfig) {
      return NextResponse.json(
        { error: 'Invalid category type' },
        { status: 400 }
      )
    }

    // TODO: Add validation using validatePost() from lib/validators
    // For now, we'll skip validation to get the basic flow working

    // Extract title from categoryData if not directly provided
    let title = data.title
    if (!title) {
      if (data.categoryData?.offerTitle) {
        title = data.categoryData.offerTitle
      } else if (data.categoryData?.cardName) {
        title = data.categoryData.cardName
      } else if (data.categoryData?.stackTitle) {
        title = data.categoryData.stackTitle
      } else if (data.categoryData?.sourceProgram) {
        // For Transfer Bonus - use source program as title
        title = data.categoryData.sourceProgram
      } else if (data.categoryData?.bonusTitle) {
        // For Joining Bonus - use bonus title
        title = data.categoryData.bonusTitle
      }
    }

    // Extract excerpt/shortDescription from categoryData if not provided
    let excerpt = data.excerpt
    if (!excerpt && data.categoryData?.shortDescription) {
      excerpt = data.categoryData.shortDescription
    }

    // Generate content from detailsContent or shortDescription if not provided
    let content = data.content
    if (!content) {
      const contentText = data.detailsContent || excerpt || title || 'No content provided'
      content = JSON.stringify([
        { type: 'text', content: contentText }
      ])
    }

    // Generate slug from title if not provided
    let slug = data.slug
    if (!slug && title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      slug = baseSlug
      let counter = 1

      // Check for uniqueness and append suffix if needed (with retry)
      while (true) {
        const existingPost = await withRetry(() =>
          prisma.post.findUnique({
            where: { slug }
          })
        )

        if (!existingPost) {
          break
        }

        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Prepare data for database (convert objects/arrays to JSON strings)
    const preparedData = preparePostForDatabase({
      ...data,
      title,
      excerpt,
      content,
      slug
    })

    // Sync published status with status field
    if (data.status) {
      preparedData.published = data.status === 'active'
    }

    // Log data for debugging
    console.log('Creating post with data:', {
      ...preparedData,
      authorId: (session.user as any).id
    })

    // Create post (with retry for Neon wake-up)
    const post = await withRetry(() =>
      prisma.post.create({
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
    )

    // Revalidate pages to show new post immediately
    revalidatePath('/')
    revalidatePath('/spend-offers')
    revalidatePath('/lifetime-free')
    revalidatePath('/stacking-hacks')
    revalidatePath('/joining-bonus')
    revalidatePath('/transfer-bonus')
    revalidatePath('/admin')

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
