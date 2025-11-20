import { prisma } from "@/lib/prisma"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import { DynamicCard } from "@/components/cards/DynamicCard"
import Link from "next/link"

async function getHomePageData() {
  // Get stats
  const totalPosts = await prisma.post.count({
    where: { status: "active" }
  })
  const totalCategories = 5 // We have 5 fixed category types now

  // Get posts for each category type (limit to 3 per category for homepage)
  const [spendOffers, lifetimeFree, stackingHacks, joiningBonus, transferBonus] = await Promise.all([
    prisma.post.findMany({
      where: { categoryType: "SPEND_OFFERS", status: "active" },
      include: { bank: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.post.findMany({
      where: { categoryType: "LIFETIME_FREE", status: "active" },
      include: { bank: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.post.findMany({
      where: { categoryType: "STACKING_HACKS", status: "active" },
      include: { bank: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.post.findMany({
      where: { categoryType: "JOINING_BONUS", status: "active" },
      include: { bank: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.post.findMany({
      where: { categoryType: "TRANSFER_BONUS", status: "active" },
      include: { bank: true },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ])

  return {
    stats: {
      totalPosts,
      totalCategories,
      activeOffers: totalPosts,
    },
    categories: [
      {
        id: "spend-offers",
        title: "Spend Offers",
        description: "Maximize your spending with cashback and rewards",
        posts: spendOffers,
        href: "/spend-offers",
        color: "blue"
      },
      {
        id: "lifetime-free",
        title: "Lifetime Free Cards",
        description: "No annual fees, all benefits",
        posts: lifetimeFree,
        href: "/lifetime-free",
        color: "green"
      },
      {
        id: "stacking-hacks",
        title: "Stacking Hacks",
        description: "Combine offers to maximize your rewards",
        posts: stackingHacks,
        href: "/stacking-hacks",
        color: "orange"
      },
      {
        id: "joining-bonus",
        title: "Joining Bonus Offers",
        description: "Get rewarded for signing up",
        posts: joiningBonus,
        href: "/joining-bonus",
        color: "purple"
      },
      {
        id: "transfer-bonus",
        title: "Transfer Bonus Offers",
        description: "Maximize your loyalty points with transfer bonuses",
        posts: transferBonus,
        href: "/transfer-bonus",
        color: "pink"
      }
    ]
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

      {/* Category Sections */}
      {data.categories.map((category, index) => {
        // Skip if no posts
        if (category.posts.length === 0) return null

        const bgColor = index % 2 === 0 ? "bg-white" : "bg-gray-50"

        return (
          <section key={category.id} className={`py-16 ${bgColor}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <Link
                  href={category.href}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.posts.map((post) => (
                  <DynamicCard key={post.id} post={post} />
                ))}
              </div>

              {/* View All Button (Mobile) */}
              <div className="mt-8 text-center lg:hidden">
                <Link
                  href={category.href}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All {category.title}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )
      })}

      {/* Empty State */}
      {data.categories.every(cat => cat.posts.length === 0) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No posts available yet
            </h2>
            <p className="text-gray-600 mb-8">
              Check back soon for exciting credit card offers and deals!
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}
