/**
 * API Route: CardConfig CRUD operations
 * GET /api/admin/card-configs - List all CardConfigs
 * POST /api/admin/card-configs - Create new CardConfig
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cardConfigs = await prisma.cardConfig.findMany({
      orderBy: { sortOrder: 'asc' }
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const cardConfig = await prisma.cardConfig.create({
      data: {
        categoryType: body.categoryType,
        displayName: body.displayName,
        description: body.description || '',
        formSchema: body.formSchema || '{}',
        renderConfig: body.renderConfig || '{}',
        requiresBank: body.requiresBank || false,
        requiresExpiry: body.requiresExpiry || false,
        supportsVerification: body.supportsVerification || false,
        supportsActive: body.supportsActive || false,
        supportsAuthor: body.supportsAuthor || false,
        cardLayout: body.cardLayout || 'standard',
        sortOrder: body.sortOrder || 0,
        isEnabled: body.isEnabled !== undefined ? body.isEnabled : true
      }
    })

    return NextResponse.json(cardConfig)
  } catch (error: any) {
    console.error('Error creating card config:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
