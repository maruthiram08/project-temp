/**
 * Seed script for creating sample posts across all 5 category types
 * Run with: npx tsx prisma/seed-sample-posts.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSamplePosts() {
  console.log('🌱 Starting sample posts seed...\n')

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { isAdmin: true }
  })

  if (!admin) {
    console.error('❌ No admin user found. Please run the main seed script first.')
    return
  }

  // Get some banks for posts
  const banks = await prisma.bank.findMany({ take: 5 })

  if (banks.length === 0) {
    console.error('❌ No banks found. Please run the bank seed script first.')
    return
  }

  const samplePosts = [
    // Spend Offers (3 posts)
    {
      title: "10% Cashback on Dining with HDFC Credit Cards",
      slug: "hdfc-10-percent-dining-cashback",
      excerpt: "Get 10% cashback on all dining transactions with HDFC Bank credit cards",
      content: JSON.stringify([
        { type: 'text', content: 'Enjoy 10% cashback on all dining transactions across India with your HDFC Bank credit card. This offer is valid at all restaurants, cafes, and food delivery platforms.' }
      ]),
      categoryType: 'SPEND_OFFERS',
      categoryData: JSON.stringify({
        offerTitle: '10% Cashback on Dining',
        shortDescription: 'Get instant cashback on all restaurant bills',
        valueBackValue: '10',
        valueBackUnit: '%',
        valueBackColor: '#10b981'
      }),
      bankId: banks[0]?.id,
      isVerified: true,
      expiryDateTime: new Date('2025-12-31'),
      showExpiryBadge: true,
      detailsContent: 'Terms and Conditions:\n- Valid on all HDFC credit cards\n- Maximum cashback: ₹1,000 per month\n- Minimum transaction: ₹500',
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "₹500 off on BigBasket with Axis Bank Cards",
      slug: "axis-bigbasket-500-off",
      excerpt: "Save ₹500 on your BigBasket orders with Axis Bank credit cards",
      content: JSON.stringify([
        { type: 'text', content: 'Get flat ₹500 discount on BigBasket when you shop for ₹2,500 or more using Axis Bank credit cards.' }
      ]),
      categoryType: 'SPEND_OFFERS',
      categoryData: JSON.stringify({
        offerTitle: '₹500 off on BigBasket',
        shortDescription: 'Flat discount on groceries',
        valueBackValue: '500',
        valueBackUnit: '₹',
        valueBackColor: '#3b82f6'
      }),
      bankId: banks[1]?.id,
      isVerified: true,
      expiryDateTime: new Date('2025-11-30'),
      showExpiryBadge: true,
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "5x Reward Points on Travel Bookings",
      slug: "icici-5x-travel-points",
      excerpt: "Earn 5x reward points on all travel bookings with ICICI credit cards",
      content: JSON.stringify([
        { type: 'text', content: 'Book flights, hotels, and holiday packages to earn 5x reward points on your ICICI credit card.' }
      ]),
      categoryType: 'SPEND_OFFERS',
      categoryData: JSON.stringify({
        offerTitle: '5x Travel Rewards',
        shortDescription: 'Accelerated rewards on travel',
        valueBackValue: '5',
        valueBackUnit: 'x',
        valueBackColor: '#f59e0b'
      }),
      bankId: banks[2]?.id,
      isVerified: false,
      status: 'active',
      published: true,
      authorId: admin.id
    },

    // Lifetime Free Cards (2 posts)
    {
      title: "Amazon Pay ICICI Credit Card - Lifetime Free",
      slug: "amazon-pay-icici-ltf",
      excerpt: "No annual fees ever. Get cashback on Amazon and everywhere else",
      content: JSON.stringify([
        { type: 'text', content: 'The Amazon Pay ICICI Credit Card is a lifetime free credit card offering excellent cashback benefits.' }
      ]),
      categoryType: 'LIFETIME_FREE',
      categoryData: JSON.stringify({
        cardName: 'Amazon Pay ICICI Card',
        cardBackgroundColor: '#FF9900',
        feeText: 'No Annual Fees',
        benefit1Icon: '🛒',
        benefit1Text: '5% on Amazon',
        benefit1Color: '#10b981',
        benefit2Icon: '💳',
        benefit2Text: '1% everywhere',
        benefit2Color: '#3b82f6',
        applyUrl: 'https://www.icicibank.com/amazoncard'
      }),
      bankId: banks[2]?.id,
      isVerified: true,
      detailsContent: 'Features:\n- 5% cashback on Amazon\n- 1% cashback on other spends\n- No joining or annual fees',
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "Axis Bank Flipkart Credit Card - No Fees",
      slug: "axis-flipkart-ltf",
      excerpt: "Lifetime free card with Flipkart benefits",
      content: JSON.stringify([
        { type: 'text', content: 'Get the Axis Bank Flipkart Credit Card with no annual fees and great cashback.' }
      ]),
      categoryType: 'LIFETIME_FREE',
      categoryData: JSON.stringify({
        cardName: 'Flipkart Axis Bank Card',
        cardBackgroundColor: '#2874F0',
        feeText: '₹0 Forever',
        benefit1Icon: '🎁',
        benefit1Text: '5% on Flipkart',
        benefit1Color: '#8b5cf6',
        benefit2Icon: '⚡',
        benefit2Text: '4% on partners',
        benefit2Color: '#f59e0b',
        applyUrl: 'https://www.axisbank.com/flipkartcard'
      }),
      bankId: banks[1]?.id,
      isVerified: true,
      status: 'active',
      published: true,
      authorId: admin.id
    },

    // Stacking Hacks (2 posts)
    {
      title: "Stack Credit Card + Wallet Offers for 20% Savings",
      slug: "stack-card-wallet-20-percent",
      excerpt: "Combine credit card and wallet cashback for maximum savings",
      content: JSON.stringify([
        { type: 'text', content: 'Learn how to stack credit card offers with wallet cashback to get up to 20% total savings.' }
      ]),
      categoryType: 'STACKING_HACKS',
      categoryData: JSON.stringify({
        stackTitle: 'Card + Wallet Stack',
        categoryLabel: 'Shopping',
        stackTypeTags: ['Cashback', 'Wallet'],
        mainRewardValue: '20',
        mainRewardUnit: '%',
        extraSavingValue: '15',
        extraSavingUnit: '%',
        baseRateValue: '5',
        baseRateUnit: '%',
        authorName: 'Credit Card Expert',
        authorHandle: '@ccexpert',
        authorPlatform: 'twitter'
      }),
      isVerified: true,
      detailsContent: 'How to Stack:\n1. Use credit card for base cashback (5%)\n2. Pay through wallet for extra cashback (15%)\n3. Total savings: 20%',
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "Triple Stack: Card + Coupon + Sale = 30% Off",
      slug: "triple-stack-30-percent",
      excerpt: "Master the art of triple stacking for maximum discounts",
      content: JSON.stringify([
        { type: 'text', content: 'Combine credit card offers, coupons, and sales to get up to 30% total discount.' }
      ]),
      categoryType: 'STACKING_HACKS',
      categoryData: JSON.stringify({
        stackTitle: 'Triple Stack Technique',
        categoryLabel: 'E-commerce',
        stackTypeTags: ['Sale', 'Coupon', 'Card Offer'],
        mainRewardValue: '30',
        mainRewardUnit: '%',
        extraSavingValue: '20',
        extraSavingUnit: '%',
        baseRateValue: '10',
        baseRateUnit: '%'
      }),
      isVerified: false,
      status: 'active',
      published: true,
      authorId: admin.id
    },

    // Joining Bonus (2 posts)
    {
      title: "Get 5,000 Bonus Points - HDFC Regalia Credit Card",
      slug: "hdfc-regalia-5000-points",
      excerpt: "Welcome bonus of 5,000 reward points on card approval",
      content: JSON.stringify([
        { type: 'text', content: 'Apply for the HDFC Regalia Credit Card and receive 5,000 bonus reward points instantly.' }
      ]),
      categoryType: 'JOINING_BONUS',
      categoryData: JSON.stringify({
        cardName: 'HDFC Regalia',
        shortDescription: 'Premium lifestyle credit card',
        cardVisualImage: 'https://via.placeholder.com/400x250/004C8F/FFFFFF?text=HDFC+Regalia',
        savingsValue: '5000',
        savingsUnit: 'pts',
        savingsColor: '#8b5cf6'
      }),
      bankId: banks[0]?.id,
      isVerified: true,
      expiryDateTime: new Date('2025-12-31'),
      showExpiryBadge: true,
      detailsContent: 'Joining Benefits:\n- 5,000 bonus points on approval\n- 2 complimentary airport lounge visits per quarter\n- Fuel surcharge waiver',
      ctaUrl: 'https://www.hdfcbank.com/regalia',
      ctaAction: 'external',
      ctaText: 'Apply Now',
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "₹2,000 Amazon Voucher on Card Activation",
      slug: "sbi-cashback-2000-voucher",
      excerpt: "Get ₹2,000 Amazon voucher as welcome bonus",
      content: JSON.stringify([
        { type: 'text', content: 'Activate your SBI Cashback Credit Card and receive ₹2,000 Amazon voucher within 30 days.' }
      ]),
      categoryType: 'JOINING_BONUS',
      categoryData: JSON.stringify({
        cardName: 'SBI Cashback Card',
        shortDescription: 'Best cashback credit card',
        cardVisualImage: 'https://via.placeholder.com/400x250/22409A/FFFFFF?text=SBI+Cashback',
        savingsValue: '2000',
        savingsUnit: '₹',
        savingsColor: '#10b981'
      }),
      bankId: banks[3]?.id,
      isVerified: true,
      status: 'active',
      published: true,
      authorId: admin.id
    },

    // Transfer Bonus (2 posts)
    {
      title: "30% Bonus on Amex to Marriott Points Transfer",
      slug: "amex-marriott-30-percent-bonus",
      excerpt: "Limited time: Get 30% bonus when transferring Amex points to Marriott",
      content: JSON.stringify([
        { type: 'text', content: 'Transfer your American Express Membership Rewards points to Marriott Bonvoy and receive 30% bonus points.' }
      ]),
      categoryType: 'TRANSFER_BONUS',
      categoryData: JSON.stringify({
        sourceProgram: 'Amex Membership Rewards',
        destinationProgram: 'Marriott Bonvoy',
        shortDescription: 'Boost your hotel points',
        transferRatioFrom: '1',
        transferRatioTo: '1',
        bonusValue: '30',
        bonusUnit: '%',
        bonusColor: '#8b5cf6'
      }),
      bankId: banks[4]?.id,
      isVerified: true,
      expiryDateTime: new Date('2025-11-25'),
      showExpiryBadge: true,
      detailsContent: 'Transfer Details:\n- Base ratio: 1:1\n- Bonus: 30% extra points\n- Effective ratio: 1:1.3\n- Valid till Nov 25, 2025',
      status: 'active',
      published: true,
      authorId: admin.id
    },
    {
      title: "40% Bonus - Transfer Points to Air India",
      slug: "hdfc-air-india-40-percent",
      excerpt: "Transfer HDFC reward points to Air India with 40% bonus",
      content: JSON.stringify([
        { type: 'text', content: 'Convert your HDFC reward points to Air India Flying Returns miles with a generous 40% bonus.' }
      ]),
      categoryType: 'TRANSFER_BONUS',
      categoryData: JSON.stringify({
        sourceProgram: 'HDFC Rewards',
        destinationProgram: 'Air India Flying Returns',
        shortDescription: 'Maximize your airline miles',
        transferRatioFrom: '100',
        transferRatioTo: '1',
        bonusValue: '40',
        bonusUnit: '%',
        bonusColor: '#f59e0b'
      }),
      bankId: banks[0]?.id,
      isVerified: true,
      detailsContent: 'Transfer Info:\n- Base: 100 points = 1 mile\n- With bonus: 100 points = 1.4 miles\n- No transfer fees',
      status: 'active',
      published: true,
      authorId: admin.id
    },
  ]

  let created = 0
  let skipped = 0

  for (const postData of samplePosts) {
    try {
      const existing = await prisma.post.findUnique({
        where: { slug: postData.slug }
      })

      if (existing) {
        console.log(`⏭️  Skipped: ${postData.title} (already exists)`)
        skipped++
        continue
      }

      await prisma.post.create({
        data: postData
      })

      console.log(`✅ Created: ${postData.title}`)
      created++
    } catch (error) {
      console.error(`❌ Error creating ${postData.title}:`, error)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Created: ${created} posts`)
  console.log(`   Skipped: ${skipped} posts`)
  console.log(`   Total: ${samplePosts.length} posts`)
  console.log(`\n✅ Sample posts seed completed!`)
}

async function main() {
  try {
    await seedSamplePosts()
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
