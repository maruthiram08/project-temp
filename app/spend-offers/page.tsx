'use client'

import { useState, useEffect } from "react"
import { DynamicCard } from "@/components/cards/DynamicCard"
import { PostOverlay } from "@/components/PostOverlay"
import { EnrichedPost } from "@/types/categories"
import Link from "next/link"

export default function SpendOffersPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<EnrichedPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts?categoryType=SPEND_OFFERS&status=active')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleCardClick = (post: EnrichedPost) => {
    setSelectedPost(post)
  }

  const handleCloseOverlay = () => {
    setSelectedPost(null)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading offers...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4 text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Spend Offers</h1>
          <p className="text-xl text-blue-100">
            Discover the best cashback, rewards, and discount offers for your spending
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No spend offers available at the moment.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
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
                <DynamicCard
                  key={post.id}
                  post={post}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Post Details Overlay */}
      {selectedPost && (
        <PostOverlay
          post={selectedPost}
          onClose={handleCloseOverlay}
        />
      )}
    </main>
  )
}
