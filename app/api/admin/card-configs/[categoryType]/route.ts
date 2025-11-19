/**
 * API Route: Get CardConfig by category type
 * GET /api/admin/card-configs/[categoryType]
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryType: string } }
) {
  try {
    const { categoryType } = params

    const cardConfig = await prisma.cardConfig.findUnique({
      where: { categoryType }
    })

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
