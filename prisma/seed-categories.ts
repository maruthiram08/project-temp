import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding categories...")

  // Check if categories already exist
  const existingCategories = await prisma.category.count()
  if (existingCategories > 0) {
    console.log("Categories already exist. Skipping seed.")
    return
  }

  // Create parent category: Spend Offers
  const spendOffers = await prisma.category.create({
    data: {
      name: "SPEND_OFFERS",
      slug: "spend-offers",
      label: "Spend Offers",
      description: "Credit card spend offers and bonuses",
      color: "bg-blue-100 text-blue-800",
    },
  })
  console.log(`Created: ${spendOffers.label}`)

  // Create parent category: New Card Offers
  const newCardOffers = await prisma.category.create({
    data: {
      name: "NEW_CARD_OFFERS",
      slug: "new-card-offers",
      label: "New Card Offers",
      description: "New credit card offers and promotions",
      color: "bg-green-100 text-green-800",
    },
  })
  console.log(`Created: ${newCardOffers.label}`)

  // Create child categories for New Card Offers
  const ltfOffers = await prisma.category.create({
    data: {
      name: "LTF_OFFERS",
      slug: "ltf-offers",
      label: "LTF Offers",
      description: "Lifetime free card offers",
      color: "bg-green-100 text-green-800",
      parentId: newCardOffers.id,
    },
  })
  console.log(`  ├─ Created: ${ltfOffers.label}`)

  const joiningBonus = await prisma.category.create({
    data: {
      name: "JOINING_BONUS",
      slug: "joining-bonus-offers",
      label: "Joining Bonus Offers",
      description: "Cards with joining bonus offers",
      color: "bg-green-100 text-green-800",
      parentId: newCardOffers.id,
    },
  })
  console.log(`  └─ Created: ${joiningBonus.label}`)

  // Create parent category: Stacking Hacks
  const stackingHacks = await prisma.category.create({
    data: {
      name: "STACKING_HACKS",
      slug: "stacking-hacks",
      label: "Stacking Hacks",
      description: "Tips to stack multiple offers",
      color: "bg-orange-100 text-orange-800",
    },
  })
  console.log(`Created: ${stackingHacks.label}`)

  // Create parent category: Hotel/Airline Deals
  const hotelAirlineDeals = await prisma.category.create({
    data: {
      name: "HOTEL_AIRLINE_DEALS",
      slug: "hotel-airline-deals",
      label: "Hotel/Airline Deals",
      description: "Hotel and airline related deals",
      color: "bg-purple-100 text-purple-800",
    },
  })
  console.log(`Created: ${hotelAirlineDeals.label}`)

  // Create child categories for Hotel/Airline Deals
  const transferBonus = await prisma.category.create({
    data: {
      name: "TRANSFER_BONUS",
      slug: "transfer-bonus-deals",
      label: "Transfer Bonus Deals",
      description: "Points/miles transfer bonus offers",
      color: "bg-purple-100 text-purple-800",
      parentId: hotelAirlineDeals.id,
    },
  })
  console.log(`  ├─ Created: ${transferBonus.label}`)

  const statusOffers = await prisma.category.create({
    data: {
      name: "STATUS_OFFERS",
      slug: "hotel-airline-status-offers",
      label: "Hotel/Airline Status Offers",
      description: "Hotel and airline loyalty status benefits",
      color: "bg-purple-100 text-purple-800",
      parentId: hotelAirlineDeals.id,
    },
  })
  console.log(`  └─ Created: ${statusOffers.label}`)

  console.log("\n✓ Categories seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
