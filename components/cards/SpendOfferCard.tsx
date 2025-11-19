/**
 * Spend Offer Card Component
 * Displays cashback, rewards, and discount offers
 */

'use client'

import { EnrichedPost, SpendOfferData } from '@/types/categories'
import { CardComponentProps } from './CardRegistry'
import { ValueBadge } from './shared/ValueBadge'
import { ExpiryBadge } from './shared/ExpiryBadge'
import { VerifiedBadge } from './shared/VerifiedBadge'

export function SpendOfferCard({ post, layout = 'standard', onCardClick }: CardComponentProps) {
  const categoryData = post.categoryData as SpendOfferData

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(post)
    }
  }

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer ${
        layout === 'compact' ? 'p-4' : 'p-6'
      }`}
      onClick={handleClick}
    >
      {/* Value Back Badge */}
      <ValueBadge
        value={categoryData.valueBackValue}
        unit={categoryData.valueBackUnit}
        color={categoryData.valueBackColor}
        position="top-right"
        size={layout === 'compact' ? 'sm' : 'md'}
      />

      {/* Bank Logo & Verified Badge */}
      <div className="flex items-center gap-2 mb-3">
        {post.bank?.logo && (
          <img
            src={post.bank.logo}
            alt={post.bank.name}
            className="h-8 w-auto object-contain"
          />
        )}
        {post.isVerified && <VerifiedBadge />}
      </div>

      {/* Offer Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {categoryData.offerTitle}
      </h3>

      {/* Short Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {categoryData.shortDescription}
      </p>

      {/* Footer: Expiry & CTA */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        {post.showExpiryBadge && post.expiryDateTime && (
          <ExpiryBadge
            expiryDateTime={post.expiryDateTime}
            displayFormat={post.expiryDisplayFormat || 'date'}
          />
        )}

        <button className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700">
          {post.ctaText} →
        </button>
      </div>
    </div>
  )
}
