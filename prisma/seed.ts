import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const hashedPassword = await hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@creditcards.com" },
    update: {},
    create: {
      email: "admin@creditcards.com",
      password: hashedPassword,
      name: "Admin User",
      isAdmin: true,
    },
  })

  console.log("✓ Admin user created:")
  console.log("  Email: admin@creditcards.com")
  console.log("  Password: admin123")
  console.log("  Please change the password after first login!")

  // Create a sample post (compatible with new schema)
  const samplePost = await prisma.post.upsert({
    where: { slug: "welcome-to-credit-card-deals" },
    update: {},
    create: {
      title: "Welcome to Credit Card Deals!",
      slug: "welcome-to-credit-card-deals",
      excerpt: "Your ultimate guide to credit card offers, tips, and tricks.",
      content: JSON.stringify([
        {
          type: "text",
          content:
            "Welcome to our credit card deals platform! Here you'll find the best credit card offers, exclusive deals, and expert tips to maximize your rewards.",
        },
        {
          type: "text",
          content:
            "Whether you're looking for cashback cards, travel rewards, or low-interest options, we've got you covered with comprehensive reviews and comparisons.",
        },
      ]),
      categoryType: "SPEND_OFFERS", // New required field
      published: true,
      status: "active", // New field with default
      authorId: admin.id,
    },
  })

  console.log("✓ Sample post created")

  // Create default CardConfig categories
  const cardConfigs = [
    {
      categoryType: "SPEND_OFFERS",
      displayName: "Spend Offers",
      description: "Special spend-based offers and deals",
      formSchema: JSON.stringify({
        fields: [
          { name: "offerDetails", type: "textarea", label: "Offer Details", required: true },
          { name: "minSpend", type: "number", label: "Minimum Spend", required: false },
          { name: "maxReward", type: "number", label: "Maximum Reward", required: false }
        ]
      }),
      renderConfig: JSON.stringify({
        layout: "standard",
        showBadge: true
      }),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: true,
      cardLayout: "standard",
      sortOrder: 1,
      isEnabled: true
    },
    {
      categoryType: "LIFETIME_FREE",
      displayName: "Lifetime Free Cards",
      description: "Credit cards with no annual fees",
      formSchema: JSON.stringify({
        fields: [
          { name: "features", type: "textarea", label: "Key Features", required: true },
          { name: "eligibility", type: "textarea", label: "Eligibility Criteria", required: false }
        ]
      }),
      renderConfig: JSON.stringify({
        layout: "standard",
        showBadge: true
      }),
      requiresBank: true,
      requiresExpiry: false,
      supportsVerification: true,
      supportsActive: true,
      cardLayout: "standard",
      sortOrder: 2,
      isEnabled: true
    },
    {
      categoryType: "STACKING_HACKS",
      displayName: "Stacking Hacks",
      description: "Tips and tricks for maximizing rewards",
      formSchema: JSON.stringify({
        fields: [
          { name: "hackDetails", type: "textarea", label: "Hack Details", required: true },
          { name: "cardsInvolved", type: "text", label: "Cards Involved", required: false }
        ]
      }),
      renderConfig: JSON.stringify({
        layout: "standard",
        showBadge: true
      }),
      requiresBank: false,
      requiresExpiry: false,
      supportsVerification: true,
      supportsActive: true,
      cardLayout: "standard",
      sortOrder: 3,
      isEnabled: true
    },
    {
      categoryType: "JOINING_BONUS",
      displayName: "Joining Bonus",
      description: "Welcome bonuses and joining offers",
      formSchema: JSON.stringify({
        fields: [
          { name: "bonusAmount", type: "number", label: "Bonus Amount", required: true },
          { name: "conditions", type: "textarea", label: "Bonus Conditions", required: true }
        ]
      }),
      renderConfig: JSON.stringify({
        layout: "standard",
        showBadge: true
      }),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: true,
      cardLayout: "premium",
      sortOrder: 4,
      isEnabled: true
    },
    {
      categoryType: "TRANSFER_BONUS",
      displayName: "Transfer Bonus",
      description: "Balance transfer offers and bonuses",
      formSchema: JSON.stringify({
        fields: [
          { name: "transferRate", type: "number", label: "Transfer Rate (%)", required: true },
          { name: "duration", type: "text", label: "Offer Duration", required: true }
        ]
      }),
      renderConfig: JSON.stringify({
        layout: "standard",
        showBadge: true
      }),
      requiresBank: true,
      requiresExpiry: true,
      supportsVerification: true,
      supportsActive: true,
      cardLayout: "standard",
      sortOrder: 5,
      isEnabled: true
    }
  ]

  for (const config of cardConfigs) {
    await prisma.cardConfig.upsert({
      where: { categoryType: config.categoryType },
      update: {},
      create: config
    })
  }

  console.log("✓ Default CardConfig categories created:")
  console.log("  - Spend Offers")
  console.log("  - Lifetime Free Cards")
  console.log("  - Stacking Hacks")
  console.log("  - Joining Bonus")
  console.log("  - Transfer Bonus")

  console.log("\nSeeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
