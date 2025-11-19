import { prisma } from "@/lib/prisma"
import OfferCard from "@/components/OfferCard"
import Footer from "@/components/Footer"
import Link from "next/link"

async function getHotelAirlineData(tab?: string) {
  // Determine which category to filter by based on tab
  const categoryFilter = tab === "status" ? "STATUS_OFFERS" : "TRANSFER_BONUS"

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { categories: { contains: categoryFilter } },
        { categories: { contains: "HOTEL_AIRLINE_DEALS" } },
      ]
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

  return { posts }
}

export default async function HotelAirlineDealsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const activeTab = params.tab || "transfer-bonus"
  const data = await getHotelAirlineData(activeTab)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-purple-500 text-3xl">✈️</span>
            <h1 className="text-4xl font-bold text-gray-900">
              Hotel/Airline Deals
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Maximize your travel rewards with exclusive hotel and airline offers
          </p>

          {/* Tabs */}
          <div className="flex gap-4">
            <Link
              href="/hotel-airline-deals?tab=transfer-bonus"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "transfer-bonus"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Transfer Bonus Deals
            </Link>
            <Link
              href="/hotel-airline-deals?tab=status"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "status"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hotel/Airline Status Offers
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
