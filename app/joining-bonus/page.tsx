import { prisma } from "@/lib/prisma"
import { DynamicCard } from "@/components/cards/DynamicCard"
import Link from "next/link"

async function getJoiningBonusOffers() {
  const posts = await prisma.post.findMany({
    where: {
      categoryType: "JOINING_BONUS",
      status: "active"
    },
    include: {
      bank: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return posts
}

export default async function JoiningBonusPage() {
  const posts = await getJoiningBonusOffers()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-100 hover:text-white mb-4 text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Joining Bonus Offers</h1>
          <p className="text-xl text-purple-100">
            Get rewarded for signing up with generous welcome bonuses
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No joining bonus offers available at the moment.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-purple-600 hover:text-purple-800"
            >
              Explore other categories
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {posts.length} {posts.length === 1 ? 'offer' : 'offers'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <DynamicCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
