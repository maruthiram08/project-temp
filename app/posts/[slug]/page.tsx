import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PostContent from "@/components/PostContent"
import Comments from "@/components/Comments"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

const categoryConfig: Record<string, { label: string; color: string; href: string }> = {
  SPEND_OFFERS: { label: "Spend Offers", color: "bg-blue-100 text-blue-800", href: "/spend-offers" },
  LIFETIME_FREE: { label: "Lifetime Free", color: "bg-green-100 text-green-800", href: "/lifetime-free" },
  STACKING_HACKS: { label: "Stacking Hacks", color: "bg-orange-100 text-orange-800", href: "/stacking-hacks" },
  JOINING_BONUS: { label: "Joining Bonus", color: "bg-purple-100 text-purple-800", href: "/joining-bonus" },
  TRANSFER_BONUS: { label: "Transfer Bonus", color: "bg-pink-100 text-pink-800", href: "/transfer-bonus" },
}

async function getPost(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, status: "active" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      bank: {
        select: {
          name: true,
          logo: true,
          brandColor: true
        }
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

  const categoryInfo = categoryConfig[post.categoryType] || {
    label: post.categoryType,
    color: "bg-gray-100 text-gray-800",
    href: "/"
  }

  // Parse categoryData if it exists
  let categoryData: any = {}
  try {
    categoryData = post.categoryData ? JSON.parse(post.categoryData) : {}
  } catch (e) {
    console.error("Error parsing categoryData:", e)
  }

  // Parse detailsImages if it exists
  let detailsImages: string[] = []
  try {
    detailsImages = post.detailsImages ? JSON.parse(post.detailsImages) : []
  } catch (e) {
    console.error("Error parsing detailsImages:", e)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <Link href={categoryInfo.href}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                  {categoryInfo.label}
                </span>
              </Link>
            </div>

            {/* Bank Logo & Verification */}
            {post.bank && (
              <div className="flex items-center gap-3 mb-4">
                {post.bank.logo && (
                  <img
                    src={post.bank.logo}
                    alt={post.bank.name}
                    className="h-8 w-auto"
                  />
                )}
                <span className="text-gray-700 font-medium">{post.bank.name}</span>
                {post.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span>By {post.author.name}</span>
              <span>•</span>
              <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
              {post.expiryDateTime && post.showExpiryBadge && (
                <>
                  <span>•</span>
                  <span className="text-red-600 font-medium">
                    Expires: {new Date(post.expiryDateTime).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <PostContent content={post.content} />
            </div>

            {/* Details Content (if available) */}
            {post.detailsContent && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
                <div className="prose max-w-none">
                  {post.detailsContent.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Details Images */}
            {detailsImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailsImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Detail image ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            {post.ctaUrl && post.ctaAction === 'external' && (
              <div className="mt-8">
                <a
                  href={post.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {post.ctaText || 'Learn More'} →
                </a>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <ShareButtons
                title={post.title}
                url={`${process.env.NEXTAUTH_URL}/posts/${post.slug}`}
              />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <Comments postId={post.id} comments={post.comments} />
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href={categoryInfo.href}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to {categoryInfo.label}
          </Link>
        </div>
      </article>
    </main>
  )
}
