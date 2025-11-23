/**
 * API Route: CardConfig operations by category type
 * GET /api/admin/card-configs/[categoryType] - Get specific CardConfig
 * PUT /api/admin/card-configs/[categoryType] - Update CardConfig
 * DELETE /api/admin/card-configs/[categoryType] - Delete CardConfig
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, withRetry } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryType: string }> }
) {
  try {
    const { categoryType } = await params

    // Use retry logic for database connection issues
    const cardConfig = await withRetry(() =>
      prisma.cardConfig.findUnique({
        where: { categoryType }
      })
    )

    if (!cardConfig) {
      return NextResponse.json(
        { error: 'Card config not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(cardConfig)
  } catch (error) {
    console.error('Error fetching card config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryType: string }> }
) {
  try {
    const { categoryType } = await params
    const body = await request.json()

    const cardConfig = await prisma.cardConfig.update({
      where: { categoryType },
      data: {
        displayName: body.displayName,
        description: body.description,
        formSchema: body.formSchema,
        renderConfig: body.renderConfig,
        requiresBank: body.requiresBank,
        requiresExpiry: body.requiresExpiry,
        supportsVerification: body.supportsVerification,
        supportsActive: body.supportsActive,
        supportsAuthor: body.supportsAuthor,
        cardLayout: body.cardLayout,
        sortOrder: body.sortOrder,
        isEnabled: body.isEnabled
      }
    })

    return NextResponse.json(cardConfig)
  } catch (error: any) {
    console.error('Error updating card config:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryType: string }> }
) {
  try {
    const { categoryType } = await params

    await prisma.cardConfig.delete({
      where: { categoryType }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting card config:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
