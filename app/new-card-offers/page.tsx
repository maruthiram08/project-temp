import { prisma } from "@/lib/prisma"
import { DynamicCard } from "@/components/cards/DynamicCard"
import Footer from "@/components/Footer"
import Link from "next/link"

async function getNewCardOffersData(tab?: string) {
  // Determine which category to filter by based on tab
  const categoryFilter = tab === "ltf" ? "LIFETIME_FREE" : "JOINING_BONUS"

  const posts = await prisma.post.findMany({
    where: {
      status: "active",
      OR: [
        { categoryType: categoryFilter },
        { categoryType: "NEW_CARD_OFFERS" },
      ]
    },
    include: {
      bank: true
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { posts }
}

export default async function NewCardOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const activeTab = params.tab || "joining-bonus"
  const data = await getNewCardOffersData(activeTab)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            New Card Offers
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the best new card launches and exclusive joining bonuses
          </p>

          {/* Tabs */}
          <div className="flex gap-4">
            <Link
              href="/new-card-offers?tab=joining-bonus"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "joining-bonus"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Joining Bonus Offers
            </Link>
            <Link
              href="/new-card-offers?tab=ltf"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === "ltf"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              LTF Offers
            </Link>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {data.posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No offers available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <DynamicCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
