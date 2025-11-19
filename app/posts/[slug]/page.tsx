import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PostContent from "@/components/PostContent"
import Comments from "@/components/Comments"
import ShareButtons from "@/components/ShareButtons"

type PostCategory = "SPEND_OFFERS" | "LIFETIME_FREE" | "FEATURED_CAMPAIGNS" | "STACKING_HACKS" | "REWARD_TRANSFER" | "LOYALTY_STATUS"

const categoryConfig = {
  SPEND_OFFERS: { label: "Spend Offers", color: "bg-blue-100 text-blue-800" },
  LIFETIME_FREE: { label: "Lifetime Free", color: "bg-green-100 text-green-800" },
  FEATURED_CAMPAIGNS: { label: "Featured Campaigns", color: "bg-purple-100 text-purple-800" },
  STACKING_HACKS: { label: "Stacking Hacks", color: "bg-orange-100 text-orange-800" },
  REWARD_TRANSFER: { label: "Reward Transfer", color: "bg-pink-100 text-pink-800" },
  LOYALTY_STATUS: { label: "Loyalty Status", color: "bg-indigo-100 text-indigo-800" },
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

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
    <main className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {categoryList.map((cat) => {
              const categoryInfo = categoryConfig[cat] || categoryConfig.SPEND_OFFERS
              return (
                <span key={cat} className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.color}`}>
                  {categoryInfo.label}
                </span>
              )
            })}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>By {post.author.name}</span>
            <span>•</span>
            <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
          </div>

          <PostContent content={post.content} />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <ShareButtons
              title={post.title}
              url={`${process.env.NEXTAUTH_URL}/posts/${post.slug}`}
            />
          </div>
        </div>

        <Comments postId={post.id} comments={post.comments} />
      </article>
    </main>
  )
}
