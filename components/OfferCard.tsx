import Link from "next/link"
import Image from "next/image"

interface OfferCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    categories: string
    createdAt: Date
  }
  layout?: "spend" | "new-card"
}

export default function OfferCard({ post, layout = "spend" }: OfferCardProps) {
  // Calculate days remaining (mock for now)
  const daysRemaining = Math.floor(Math.random() * 30) + 1

  // Mock percentage for spend offers
  const percentage = [5, 10, 12.5, 15, 20][Math.floor(Math.random() * 5)]

  // Get category for tag
  const categories = post.categories.split(",")
  const categoryLabels: Record<string, string> = {
    "SPEND_OFFERS": "Shopping",
    "STACKING_HACKS": "Dining",
    "TRANSFER_BONUS": "Travel",
    "LIFETIME_FREE": "Lifetime Free",
  }
  const categoryLabel = categoryLabels[categories[0]] || "General"

  if (layout === "new-card") {
    // Large card layout for New Card Offers
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Card Image */}
        <div className="relative h-64 bg-gradient-to-br from-red-600 to-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-8xl opacity-50">💳</span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur text-white">
              {daysRemaining > 15 ? "🟢 Ongoing" : `📅 ${daysRemaining} days`}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Bank Logo and Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">🏦</span>
            </div>
            <span className="text-sm text-gray-500 uppercase tracking-wide">HDFC Bank</span>
          </div>

          {/* Card Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {post.excerpt || "Limited time welcome bonus"}
          </p>

          {/* Value */}
          <div className="mb-4">
            <div className="text-3xl font-bold text-blue-600">
              {Math.random() > 0.5 ? `₹${(Math.random() * 5000 + 2000).toFixed(0)}` : `${Math.floor(Math.random() * 20000 + 5000)}`}
            </div>
            <div className="text-sm text-gray-500">
              {Math.random() > 0.5 ? "savings" : "points"}
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/posts/${post.slug}`}
            className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            View Offer →
          </Link>
        </div>
      </div>
    )
  }

  // Spend offer card layout
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6">
      {/* Header: Bank + Days */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">🏦</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {["HDFC Bank", "ICICI Bank", "Axis Bank", "BOB Bank"][Math.floor(Math.random() * 4)]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">⏱ {daysRemaining} days</span>
          <span className="text-green-500">✓</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {post.title}
      </h3>

      {/* Category Tag */}
      <div className="mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          {categoryLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {post.excerpt || "Spend and get cashback"}
      </p>

      {/* Percentage Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold bg-green-500 text-white">
          {percentage}%
        </span>
      </div>

      {/* CTA */}
      <Link
        href={`/posts/${post.slug}`}
        className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
      >
        View Details →
      </Link>
    </div>
  )
}
