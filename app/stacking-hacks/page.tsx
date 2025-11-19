import { prisma } from "@/lib/prisma"
import OfferCard from "@/components/OfferCard"
import Footer from "@/components/Footer"

async function getStackingHacksData() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: {
        contains: "STACKING_HACKS"
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

  return { posts }
}

export default async function StackingHacksPage() {
  const data = await getStackingHacksData()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-orange-500 text-3xl">🎯</span>
            <h1 className="text-4xl font-bold text-gray-900">Stacking Hacks</h1>
          </div>
          <p className="text-lg text-gray-600">
            Combine offers to maximize your rewards and get the best value
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {data.posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No stacking hacks available at the moment. Check back soon!
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
