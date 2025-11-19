/**
 * Dynamic Card Component
 * Universal wrapper that renders the appropriate card component based on categoryType
 */

'use client'

import { EnrichedPost } from '@/types/categories'
import { getCardComponent } from './CardRegistry'
import { enrichPost } from '@/lib/validators'

// ============================================================================
// FALLBACK CARD
// ============================================================================

function FallbackCard({ post }: { post: any }) {
  return (
    <div className="p-6 border border-red-300 rounded-lg bg-red-50">
      <p className="text-red-600 font-semibold">⚠️ No card component found</p>
      <p className="text-sm text-red-500 mt-1">
        Category type: <code className="bg-red-100 px-1 py-0.5 rounded">{post.categoryType}</code>
      </p>
      <p className="text-sm text-gray-600 mt-2">{post.title}</p>
    </div>
  )
}

// ============================================================================
// DYNAMIC CARD
// ============================================================================

export interface DynamicCardProps {
  post: any // Raw post from database
  layout?: 'standard' | 'compact' | 'premium'
  onCardClick?: (post: EnrichedPost) => void
}

export function DynamicCard({ post, layout = 'standard', onCardClick }: DynamicCardProps) {
  // Get the appropriate card component
  const CardComponent = getCardComponent(post.categoryType)

  if (!CardComponent) {
    console.error(`No card component registered for category type: ${post.categoryType}`)
    return <FallbackCard post={post} />
  }

  // Enrich the post with parsed data
  const enrichedPost = enrichPost(post) as EnrichedPost

  return (
    <div className="dynamic-card-wrapper">
      <CardComponent
        post={enrichedPost}
        layout={layout}
        onCardClick={onCardClick}
      />
    </div>
  )
}
