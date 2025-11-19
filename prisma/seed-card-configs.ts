/**
 * Seed script for CardConfig data
 * Run with: npx tsx prisma/seed-card-configs.ts
 */

import { PrismaClient } from '@prisma/client'
import { spendOffersFormSchema, spendOffersRenderConfig } from '../config/categories/spend-offers'
import { lifetimeFreeFormSchema, lifetimeFreeRenderConfig } from '../config/categories/lifetime-free'
import { stackingHacksFormSchema, stackingHacksRenderConfig } from '../config/categories/stacking-hacks'
import { joiningBonusFormSchema, joiningBonusRenderConfig } from '../config/categories/joining-bonus'
import { transferBonusFormSchema, transferBonusRenderConfig } from '../config/categories/transfer-bonus'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CardConfig seed...')

  // ============================================================================
  // SPEND OFFERS
  // ============================================================================
  const spendOffers = await prisma.cardConfig.upsert({
    where: { categoryType: 'SPEND_OFFERS' },
    create: {
      categoryType: 'SPEND_OFFERS',
      displayName: 'Spend Offers',
      description: 'Cashback, rewards, and discounts on card spending',
      formSchema: JSON.stringify(spendOffersFormSchema),
      renderConfig: JSON.stringify(spendOffersRenderConfig),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'standard',
      sortOrder: 1,
      isEnabled: true
    },
    update: {
      displayName: 'Spend Offers',
      description: 'Cashback, rewards, and discounts on card spending',
      formSchema: JSON.stringify(spendOffersFormSchema),
      renderConfig: JSON.stringify(spendOffersRenderConfig),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'standard',
      sortOrder: 1,
      isEnabled: true
    }
  })
  console.log('✅ Spend Offers:', spendOffers.categoryType)

  // ============================================================================
  // LIFETIME FREE CARDS
  // ============================================================================
  const lifetimeFree = await prisma.cardConfig.upsert({
    where: { categoryType: 'LIFETIME_FREE' },
    create: {
      categoryType: 'LIFETIME_FREE',
      displayName: 'Lifetime Free Cards',
      description: 'Credit cards with no annual fees',
      formSchema: JSON.stringify(lifetimeFreeFormSchema),
      renderConfig: JSON.stringify(lifetimeFreeRenderConfig),
      requiresBank: true,
      requiresExpiry: false, // Optional expiry
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'premium',
      sortOrder: 2,
      isEnabled: true
    },
    update: {
      displayName: 'Lifetime Free Cards',
      description: 'Credit cards with no annual fees',
      formSchema: JSON.stringify(lifetimeFreeFormSchema),
      renderConfig: JSON.stringify(lifetimeFreeRenderConfig),
      requiresBank: true,
      requiresExpiry: false,
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'premium',
      sortOrder: 2,
      isEnabled: true
    }
  })
  console.log('✅ Lifetime Free Cards:', lifetimeFree.categoryType)

  // ============================================================================
  // STACKING HACKS
  // ============================================================================
  const stackingHacks = await prisma.cardConfig.upsert({
    where: { categoryType: 'STACKING_HACKS' },
    create: {
      categoryType: 'STACKING_HACKS',
      displayName: 'Stacking Hacks',
      description: 'Strategies to maximize rewards by combining offers',
      formSchema: JSON.stringify(stackingHacksFormSchema),
      renderConfig: JSON.stringify(stackingHacksRenderConfig),
      requiresBank: false, // No bank relationship
      requiresExpiry: false,
      supportsVerification: false,
      supportsActive: false,
      supportsAuthor: true, // Supports author attribution
      cardLayout: 'standard',
      sortOrder: 3,
      isEnabled: true
    },
    update: {
      displayName: 'Stacking Hacks',
      description: 'Strategies to maximize rewards by combining offers',
      formSchema: JSON.stringify(stackingHacksFormSchema),
      renderConfig: JSON.stringify(stackingHacksRenderConfig),
      requiresBank: false,
      requiresExpiry: false,
      supportsVerification: false,
      supportsActive: false,
      supportsAuthor: true,
      cardLayout: 'standard',
      sortOrder: 3,
      isEnabled: true
    }
  })
  console.log('✅ Stacking Hacks:', stackingHacks.categoryType)

  // ============================================================================
  // JOINING BONUS
  // ============================================================================
  const joiningBonus = await prisma.cardConfig.upsert({
    where: { categoryType: 'JOINING_BONUS' },
    create: {
      categoryType: 'JOINING_BONUS',
      displayName: 'Joining Bonus',
      description: 'Welcome offers and signup bonuses for new cardholders',
      formSchema: JSON.stringify(joiningBonusFormSchema),
      renderConfig: JSON.stringify(joiningBonusRenderConfig),
      requiresBank: true,
      requiresExpiry: true, // Always required
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'premium',
      sortOrder: 4,
      isEnabled: true
    },
    update: {
      displayName: 'Joining Bonus',
      description: 'Welcome offers and signup bonuses for new cardholders',
      formSchema: JSON.stringify(joiningBonusFormSchema),
      renderConfig: JSON.stringify(joiningBonusRenderConfig),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'premium',
      sortOrder: 4,
      isEnabled: true
    }
  })
  console.log('✅ Joining Bonus:', joiningBonus.categoryType)

  // ============================================================================
  // TRANSFER BONUS
  // ============================================================================
  const transferBonus = await prisma.cardConfig.upsert({
    where: { categoryType: 'TRANSFER_BONUS' },
    create: {
      categoryType: 'TRANSFER_BONUS',
      displayName: 'Transfer Bonuses',
      description: 'Bonus miles/points for transferring between loyalty programs',
      formSchema: JSON.stringify(transferBonusFormSchema),
      renderConfig: JSON.stringify(transferBonusRenderConfig),
      requiresBank: true,
      requiresExpiry: true, // Always required
      supportsVerification: false, // Optional
      supportsActive: true, // Supports isActive toggle
      supportsAuthor: false,
      cardLayout: 'standard',
      sortOrder: 5,
      isEnabled: true
    },
    update: {
      displayName: 'Transfer Bonuses',
      description: 'Bonus miles/points for transferring between loyalty programs',
      formSchema: JSON.stringify(transferBonusFormSchema),
      renderConfig: JSON.stringify(transferBonusRenderConfig),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: false,
      supportsActive: true,
      supportsActive: true,
      supportsAuthor: false,
      cardLayout: 'standard',
      sortOrder: 5,
      isEnabled: true
    }
  })
  console.log('✅ Transfer Bonuses:', transferBonus.categoryType)

  console.log('\n🎉 CardConfig seed completed successfully!')
  console.log('\nSummary:')
  console.log('  • 5 category types configured')
  console.log('  • Form schemas and render configs set')
  console.log('  • Feature flags configured per category')
  console.log('\nNext steps:')
  console.log('  1. Run the Prisma migration: npx prisma migrate dev')
  console.log('  2. Verify configs: Check your database')
  console.log('  3. Start building the admin UI!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
