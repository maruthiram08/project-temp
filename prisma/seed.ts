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
