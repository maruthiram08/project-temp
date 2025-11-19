import Link from "next/link"
import Image from "next/image"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  categories: string
  createdAt: Date
  author: {
    name: string | null
  } | null
}

interface CategorySectionProps {
  title: string
  description?: string
  categorySlug: string
  posts: Post[]
  bgColor?: string
  layout?: "cards" | "premium" | "full-width"
  showViewAll?: boolean
}

export default function CategorySection({
  title,
  description,
  categorySlug,
  posts,
  bgColor = "bg-gray-50",
  layout = "cards",
  showViewAll = true
}: CategorySectionProps) {
  if (posts.length === 0) return null

  // Limit to 3 posts for homepage
  const displayPosts = posts.slice(0, 3)

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
          {showViewAll && (
            <Link
              href={`/?category=${categorySlug}`}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
            >
              View All →
            </Link>
          )}
        </div>

        {/* Posts Grid */}
        {layout === "premium" ? (
          // Large image cards for Premium Campaigns
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Placeholder for large card image */}
                  <div className="relative h-48 bg-gradient-to-br from-red-600 to-black flex items-center justify-center">
                    <span className="text-white text-6xl">💳</span>
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur">
                        Premium
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-600 text-sm">💎</span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ₹2,500+
                    </div>
                    <div className="text-sm text-gray-500">Annual fee</div>
                    <button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : layout === "full-width" ? (
          // Full width cards for Stacking Hacks
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
                  {/* Image placeholder */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        12.5% Cashback
                      </div>
                      <div className="text-xs text-gray-600">
                        Limited time offer
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Standard cards for Spend Offers and others
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    <span className="text-sm font-medium text-gray-900">
                      {post.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <Link
                  href={`/posts/${post.slug}`}
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center font-medium py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  View Offer
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
