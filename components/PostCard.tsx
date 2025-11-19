import Link from "next/link"

type PostCategory = "SPEND_OFFERS" | "LIFETIME_FREE" | "FEATURED_CAMPAIGNS" | "STACKING_HACKS" | "REWARD_TRANSFER" | "LOYALTY_STATUS"

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt: string | null
    slug: string
    categories: string
    createdAt: string
    author: {
      name: string
    }
    _count: {
      comments: number
    }
  }
}

const categoryConfig = {
  SPEND_OFFERS: { label: "Spend Offers", color: "bg-blue-100 text-blue-800" },
  LIFETIME_FREE: { label: "Lifetime Free", color: "bg-green-100 text-green-800" },
  FEATURED_CAMPAIGNS: { label: "Featured Campaigns", color: "bg-purple-100 text-purple-800" },
  STACKING_HACKS: { label: "Stacking Hacks", color: "bg-orange-100 text-orange-800" },
  REWARD_TRANSFER: { label: "Reward Transfer", color: "bg-pink-100 text-pink-800" },
  LOYALTY_STATUS: { label: "Loyalty Status", color: "bg-indigo-100 text-indigo-800" },
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Parse categories from comma-separated string
  const categoryList = post.categories
    ? post.categories.split(",").filter(c => c.trim()).map(c => c.trim() as PostCategory)
    : ["SPEND_OFFERS" as PostCategory]

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {categoryList.map((cat) => {
            const categoryInfo = categoryConfig[cat] || categoryConfig.SPEND_OFFERS
            return (
              <span key={cat} className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.color}`}>
                {categoryInfo.label}
              </span>
            )
          })}
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>By {post.author.name}</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>{post._count.comments} comments</span>
          </div>
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}
