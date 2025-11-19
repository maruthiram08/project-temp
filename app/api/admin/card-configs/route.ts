/**
 * API Route: List all CardConfigs
 * GET /api/admin/card-configs
 */

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cardConfigs = await prisma.cardConfig.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        categoryType: true,
        displayName: true,
        description: true,
        requiresBank: true,
        requiresExpiry: true,
        supportsVerification: true,
        supportsActive: true,
        supportsAuthor: true,
        cardLayout: true,
        sortOrder: true,
        isEnabled: true
      }
    })

    return NextResponse.json(cardConfigs)
  } catch (error) {
    console.error('Error fetching card configs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
