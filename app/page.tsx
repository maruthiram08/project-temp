import { prisma } from "@/lib/prisma"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import CategorySection from "@/components/CategorySection"
import Footer from "@/components/Footer"

async function getHomePageData() {
  // Get all published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
      categories: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get stats for hero section
  const totalPosts = await prisma.post.count({ where: { published: true } })
  const totalCategories = await prisma.category.count()

  // Filter posts by category
  const spendOffersPosts = posts.filter(p => p.categories.includes("SPEND_OFFERS"))
  const premiumCampaignsPosts = posts.filter(p => p.categories.includes("FEATURED_CAMPAIGNS") || p.categories.includes("NEW_CARD_OFFERS"))
  const lifetimeFreeCardsPosts = posts.filter(p => p.categories.includes("LTF_OFFERS") || p.categories.includes("LIFETIME_FREE"))
  const stackingHacksPosts = posts.filter(p => p.categories.includes("STACKING_HACKS"))
  const transferBonusesPosts = posts.filter(p => p.categories.includes("TRANSFER_BONUS") || p.categories.includes("REWARD_TRANSFER"))
  const statusOffersPosts = posts.filter(p => p.categories.includes("STATUS_OFFERS") || p.categories.includes("LOYALTY_STATUS"))

  return {
    stats: {
      totalPosts,
      totalCategories,
      activeOffers: totalPosts, // For now, all posts are active offers
    },
    spendOffersPosts,
    premiumCampaignsPosts,
    lifetimeFreeCardsPosts,
    stackingHacksPosts,
    transferBonusesPosts,
    statusOffersPosts,
  }
}

export default async function Home() {
  const data = await getHomePageData()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero stats={data.stats} />

      {/* Features Section */}
      <Features />

      {/* Spend Offers Section */}
      <CategorySection
        title="Spend Offers"
        description="Maximize your spending with these exclusive offers"
        categorySlug="SPEND_OFFERS"
        posts={data.spendOffersPosts}
        bgColor="bg-white"
        layout="cards"
      />

      {/* Premium Campaigns Section */}
      <CategorySection
        title="Premium Campaigns"
        description="Exclusive offers for premium credit cards"
        categorySlug="FEATURED_CAMPAIGNS"
        posts={data.premiumCampaignsPosts}
        bgColor="bg-gray-50"
        layout="premium"
      />

      {/* Lifetime Free Cards Section */}
      <CategorySection
        title="Lifetime Free Cards"
        description="No annual fees, all benefits"
        categorySlug="LTF_OFFERS"
        posts={data.lifetimeFreeCardsPosts}
        bgColor="bg-white"
        layout="cards"
      />

      {/* Stacking Hacks Section */}
      <CategorySection
        title="Stacking Hacks"
        description="Combine offers to maximize your rewards"
        categorySlug="STACKING_HACKS"
        posts={data.stackingHacksPosts}
        bgColor="bg-gray-50"
        layout="full-width"
      />

      {/* Transfer Bonuses Section */}
      <CategorySection
        title="Transfer Bonuses"
        description="Get extra value when transferring points"
        categorySlug="TRANSFER_BONUS"
        posts={data.transferBonusesPosts}
        bgColor="bg-white"
        layout="cards"
      />

      {/* Status Offers Section */}
      <CategorySection
        title="Status Offers"
        description="Unlock elite status benefits faster"
        categorySlug="STATUS_OFFERS"
        posts={data.statusOffersPosts}
        bgColor="bg-gray-50"
        layout="cards"
      />

      {/* Footer */}
      <Footer />
    </main>
  )
}
