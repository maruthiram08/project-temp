/**
 * Post Details Overlay Component
 * Shows full post details in a modal overlay
 */

'use client'

import { EnrichedPost } from '@/types/categories'
import { useEffect } from 'react'

interface PostOverlayProps {
  post: EnrichedPost
  onClose: () => void
}

export function PostOverlay({ post, onClose }: PostOverlayProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Parse detailsImages if it's a JSON string
  const detailsImages = typeof post.detailsImages === 'string'
    ? JSON.parse(post.detailsImages)
    : post.detailsImages || []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            {post.bank?.logo && (
              <img
                src={post.bank.logo}
                alt={post.bank.name}
                className="h-10 w-auto object-contain"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
              {post.bank && (
                <p className="text-sm text-gray-600">{post.bank.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close overlay"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Excerpt */}
          {post.excerpt && (
            <div>
              <p className="text-lg text-gray-700">{post.excerpt}</p>
            </div>
          )}

          {/* Details Content */}
          {post.detailsContent && (
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {post.detailsContent}
              </div>
            </div>
          )}

          {/* Details Images */}
          {detailsImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
              <div className="grid grid-cols-1 gap-4">
                {detailsImages.map((imageUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Detail ${index + 1}`}
                    className="w-full rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Expiry Information */}
          {post.expiryDateTime && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-amber-900">
                  Expires: {new Date(post.expiryDateTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          {post.ctaUrl && (
            <div>
              <a
                href={post.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {post.ctaText || 'View Details'} →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
