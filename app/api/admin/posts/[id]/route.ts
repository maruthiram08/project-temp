/**
 * API Routes: Admin Posts CRUD (Single Post)
 * GET /api/admin/posts/[id] - Get single post
 * PUT /api/admin/posts/[id] - Update post
 * DELETE /api/admin/posts/[id] - Delete post
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { preparePostForDatabase, validatePost } from '@/lib/validators'

const prisma = new PrismaClient()

// GET - Fetch single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any)?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        bank: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            brandColor: true
          }
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categoryRelations: {
          include: {
            category: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update post
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

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Fetch CardConfig for validation
    const cardConfig = await prisma.cardConfig.findUnique({
      where: { categoryType: data.categoryType || existingPost.categoryType }
    })

    if (!cardConfig) {
      return NextResponse.json(
        { error: 'Invalid category type' },
        { status: 400 }
      )
    }

    // Validate post data
    const formSchema = JSON.parse(cardConfig.formSchema)
    const validationResult = await validatePost(data, formSchema)

    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validationResult.errors },
        { status: 400 }
      )
    }

    // Prepare data for database
    const preparedData = preparePostForDatabase(data)

    // Update slug if title changed
    if (data.title && data.title !== existingPost.title && !data.slug) {
      preparedData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: preparedData,
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

    return NextResponse.json(updatedPost)
  } catch (error: any) {
    console.error('Error updating post:', error)

    // Handle unique constraint violations (e.g., duplicate slug)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete post
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
    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, title: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete post (cascade will handle related records)
    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Post "${existingPost.title}" deleted successfully`
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
