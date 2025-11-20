/**
 * Joining Bonus Card Component
 * Displays welcome offers and signup bonuses
 */

'use client'

import { EnrichedPost, JoiningBonusData } from '@/types/categories'
import { CardComponentProps } from './CardRegistry'
import { ValueBadge } from './shared/ValueBadge'
import { ExpiryBadge } from './shared/ExpiryBadge'
import { VerifiedBadge } from './shared/VerifiedBadge'

export function JoiningBonusCard({ post, layout = 'standard', onCardClick }: CardComponentProps) {
  const categoryData = post.categoryData as JoiningBonusData

  // Handle missing category data
  if (!categoryData) {
    return (
      <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-600">Invalid post data</p>
      </div>
    )
  }

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(post)
    }
  }

  return (
    <div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
      onClick={handleClick}
    >
      {/* Savings Badge */}
      <ValueBadge
        value={categoryData.savingsValue}
        unit={categoryData.savingsUnit}
        color={categoryData.savingsColor}
        position="top-right"
        size="lg"
      />

      {/* Bank Logo & Verified */}
      <div className="p-6 pb-0">
        <div className="flex items-center gap-2 mb-4">
          {post.bank?.logo && (
            <img
              src={post.bank.logo}
              alt={post.bank.name}
              className="h-8 w-auto object-contain"
            />
          )}
          {post.isVerified && <VerifiedBadge />}
        </div>
      </div>

      {/* Card Visual Image (Hero) */}
      <div className="px-6 mb-4">
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <img
            src={categoryData.cardVisualImage}
            alt={categoryData.cardVisualAlt || categoryData.cardName}
            className="w-full h-40 object-contain bg-gradient-to-br from-gray-50 to-gray-100"
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="px-6 pb-6">
        {/* Card Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {categoryData.cardName}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {categoryData.shortDescription}
        </p>

        {/* Footer: Expiry & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {post.expiryDateTime && (
            <ExpiryBadge
              expiryDateTime={post.expiryDateTime}
              displayFormat={post.expiryDisplayFormat || 'date'}
            />
          )}

          <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            {post.ctaText} →
          </button>
        </div>
      </div>
    </div>
  )
}
