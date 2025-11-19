/**
 * Lifetime Free Card Component
 * Displays credit cards with no annual fees
 */

'use client'

import { EnrichedPost, LifetimeFreeCardData } from '@/types/categories'
import { CardComponentProps } from './CardRegistry'
import { ExpiryBadge } from './shared/ExpiryBadge'
import { VerifiedBadge } from './shared/VerifiedBadge'

export function LifetimeFreeCard({ post, layout = 'standard', onCardClick }: CardComponentProps) {
  const categoryData = post.categoryData as LifetimeFreeCardData

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(post)
    }
  }

  return (
    <div
      className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      {/* Card Visual */}
      <div
        className="h-48 p-6 flex flex-col justify-between"
        style={{
          backgroundColor: categoryData.cardBackgroundColor,
          backgroundImage: categoryData.cardBackgroundImage ? `url(${categoryData.cardBackgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Bank Logo */}
        {post.bank?.logo && (
          <img
            src={post.bank.logo}
            alt={post.bank.name}
            className="h-8 w-auto object-contain self-start bg-white/90 px-2 py-1 rounded"
          />
        )}

        {/* Card Name */}
        <h3 className="text-xl font-bold text-white drop-shadow-lg">
          {categoryData.cardName}
        </h3>
      </div>

      {/* Card Details */}
      <div className="p-6">
        {/* Fee Text */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">✓</span>
          <span className="text-lg font-semibold text-gray-900">{categoryData.feeText}</span>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-4">
          {/* Benefit 1 */}
          <div className="flex items-start gap-2">
            <span className="text-lg">{categoryData.benefit1Icon}</span>
            <span
              className="text-sm font-medium"
              style={{ color: categoryData.benefit1Color }}
            >
              {categoryData.benefit1Text}
            </span>
          </div>

          {/* Benefit 2 (optional) */}
          {categoryData.benefit2Text && (
            <div className="flex items-start gap-2">
              <span className="text-lg">{categoryData.benefit2Icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: categoryData.benefit2Color }}
              >
                {categoryData.benefit2Text}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {post.isVerified && <VerifiedBadge />}
            {post.showExpiryBadge && post.expiryDateTime && (
              <ExpiryBadge
                expiryDateTime={post.expiryDateTime}
                displayFormat={post.expiryDisplayFormat || 'date'}
              />
            )}
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {post.ctaText}
          </button>
        </div>
      </div>
    </div>
  )
}
