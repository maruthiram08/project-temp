/**
 * Stacking Hack Card Component
 * Displays reward stacking strategies
 */

'use client'

import { EnrichedPost, StackingHackData } from '@/types/categories'
import { CardComponentProps } from './CardRegistry'
import { ValueBadge } from './shared/ValueBadge'

export function StackingHackCard({ post, layout = 'standard', onCardClick }: CardComponentProps) {
  const categoryData = post.categoryData as StackingHackData

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
      {/* Banner Image (optional) */}
      {categoryData.bannerImage && (
        <div className="h-32 overflow-hidden">
          <img
            src={categoryData.bannerImage}
            alt={categoryData.stackTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Main Reward Badge */}
        <ValueBadge
          value={categoryData.mainRewardValue}
          unit={categoryData.mainRewardUnit}
          color="#8b5cf6"
          position="top-right"
          size={layout === 'compact' ? 'sm' : 'md'}
        />

        {/* Category Label & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">
            {categoryData.categoryLabel}
          </span>
          {categoryData.stackTypeTags.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Stack Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {categoryData.stackTitle}
        </h3>

        {/* Reward Breakdown */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Reward</span>
            <span className="text-2xl font-bold text-purple-600">
              {categoryData.mainRewardValue}{categoryData.mainRewardUnit}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-500">Base: </span>
              <span className="font-semibold text-gray-700">
                {categoryData.baseRateValue}{categoryData.baseRateUnit}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Extra: </span>
              <span className="font-semibold text-green-600">
                +{categoryData.extraSavingValue}{categoryData.extraSavingUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Author Attribution (if provided) */}
        {categoryData.authorName && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>
              Shared by {categoryData.authorName}
              {categoryData.authorHandle && ` • ${categoryData.authorHandle}`}
            </span>
          </div>
        )}

        {/* CTA */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
          {post.ctaText}
        </button>
      </div>
    </div>
  )
}
