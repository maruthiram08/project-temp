/**
 * Transfer Bonus Card Component
 * Displays loyalty program transfer bonuses
 */

'use client'

import { EnrichedPost, TransferBonusData } from '@/types/categories'
import { CardComponentProps } from './CardRegistry'
import { ValueBadge } from './shared/ValueBadge'
import { ExpiryBadge } from './shared/ExpiryBadge'
import { VerifiedBadge } from './shared/VerifiedBadge'

export function TransferBonusCard({ post, layout = 'standard', onCardClick }: CardComponentProps) {
  const categoryData = post.categoryData as TransferBonusData

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(post)
    }
  }

  return (
    <div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Bonus Badge */}
      <ValueBadge
        value={categoryData.bonusValue}
        unit={categoryData.bonusUnit}
        color={categoryData.bonusColor}
        position="top-right"
        size={layout === 'compact' ? 'sm' : 'md'}
      />

      <div className="p-6">
        {/* Bank Logo & Badges */}
        <div className="flex items-center gap-2 mb-4">
          {post.bank?.logo && (
            <img
              src={post.bank.logo}
              alt={post.bank.name}
              className="h-8 w-auto object-contain"
            />
          )}
          {post.isVerified && <VerifiedBadge />}
          {post.statusBadgeText && (
            <span
              className="text-xs font-medium px-2 py-1 rounded"
              style={{
                backgroundColor: post.statusBadgeColor ? `${post.statusBadgeColor}20` : '#10b98120',
                color: post.statusBadgeColor || '#10b981'
              }}
            >
              {post.statusBadgeText}
            </span>
          )}
        </div>

        {/* Transfer Programs */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            {/* Source Program */}
            <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">From</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {categoryData.sourceProgram}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">
                {categoryData.transferRatioFrom}:{categoryData.transferRatioTo}
              </span>
            </div>

            {/* Destination Program */}
            <div className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">To</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {categoryData.destinationProgram}
              </p>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
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

          <button className="ml-auto text-sm font-medium text-purple-600 hover:text-purple-700">
            {post.ctaText} →
          </button>
        </div>
      </div>
    </div>
  )
}
