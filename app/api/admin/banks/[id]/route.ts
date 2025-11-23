/**
 * API Routes: Admin Banks CRUD (Single Bank)
 * GET /api/admin/banks/[id] - Get single bank
 * PUT /api/admin/banks/[id] - Update bank
 * DELETE /api/admin/banks/[id] - Delete bank
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch single bank by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bank = await prisma.bank.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!bank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 })
    }

    return NextResponse.json(bank)
  } catch (error) {
    console.error('Error fetching bank:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update bank
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

    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 })
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
    if (data.logo !== undefined) updateData.logo = data.logo
    if (data.brandColor !== undefined) updateData.brandColor = data.brandColor
    if (data.description !== undefined) updateData.description = data.description

    // Update bank
    const updatedBank = await prisma.bank.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedBank)
  } catch (error: any) {
    console.error('Error updating bank:', error)

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

// DELETE - Delete bank
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
    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!existingBank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 })
    }

    // Prevent deletion if bank has associated posts
    if (existingBank._count.posts > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete bank. It has ${existingBank._count.posts} associated post(s).`,
          postsCount: existingBank._count.posts
        },
        { status: 409 }
      )
    }

    // Delete bank
    await prisma.bank.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Bank "${existingBank.name}" deleted successfully`
    })
  } catch (error: any) {
    console.error('Error deleting bank:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
