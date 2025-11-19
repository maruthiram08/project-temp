import { prisma } from "@/lib/prisma"
import OfferCard from "@/components/OfferCard"
import Footer from "@/components/Footer"

async function getSpendOffersData() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
        contains: "SPEND_OFFERS"
      }
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      slug: true,
      categories: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Calculate stats
  const totalPosts = await prisma.post.count({
    where: { published: true, categories: { contains: "SPEND_OFFERS" } }
  })

  // Mock calculations for demo
  const endingThisWeek = Math.floor(totalPosts * 0.18)
  const avgCashback = 12.5
  const maxSavings = 5000

  return {
    posts,
    stats: {
      activeOffers: totalPosts,
      endingThisWeek,
      avgCashback,
      maxSavings,
    }
  }
}

export default async function SpendOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const data = await getSpendOffersData()
  const params = await searchParams

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-orange-500 text-3xl">⚡</span>
            <h1 className="text-4xl font-bold text-gray-900">Spend Offers</h1>
          </div>
          <p className="text-lg text-gray-600">
            Track high-value spend-based offers across all your cards
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Active Offers</div>
              <div className="text-3xl font-bold text-orange-600">
                {data.stats.activeOffers}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Ending This Week</div>
              <div className="text-3xl font-bold text-red-600">
                {data.stats.endingThisWeek}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Avg. Cashback</div>
              <div className="text-3xl font-bold text-teal-600">
                {data.stats.avgCashback}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Max Savings</div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{data.stats.maxSavings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by bank, offer name, category..."
              defaultValue={params.search}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <span>🎛️</span>
            <span className="font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {data.posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No spend offers available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <OfferCard key={post.id} post={post} layout="spend" />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
