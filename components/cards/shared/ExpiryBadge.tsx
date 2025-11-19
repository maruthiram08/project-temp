/**
 * Expiry Badge Component
 * Displays expiry dates with optional countdown
 */

'use client'

import { useEffect, useState } from 'react'
import { ExpiryDisplayFormat } from '@/types/categories'

export interface ExpiryBadgeProps {
  expiryDateTime: Date
  displayFormat?: ExpiryDisplayFormat
  className?: string
}

export function ExpiryBadge({ expiryDateTime, displayFormat = 'date', className = '' }: ExpiryBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (displayFormat === 'date') return

    const calculateTimeLeft = () => {
      const now = new Date()
      const expiry = new Date(expiryDateTime)
      const diff = expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`)
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m left`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [expiryDateTime, displayFormat])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const isExpiringSoon = () => {
    const now = new Date()
    const expiry = new Date(expiryDateTime)
    const diff = expiry.getTime() - now.getTime()
    const daysLeft = diff / (1000 * 60 * 60 * 24)
    return daysLeft <= 7 && daysLeft > 0
  }

  const isExpired = () => {
    return new Date(expiryDateTime) <= new Date()
  }

  const getBadgeColor = () => {
    if (isExpired()) return 'bg-red-100 text-red-700 border-red-200'
    if (isExpiringSoon()) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${getBadgeColor()} ${className}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {displayFormat === 'date' && <span>{formatDate(expiryDateTime)}</span>}
      {displayFormat === 'countdown' && <span>{timeLeft}</span>}
      {displayFormat === 'both' && (
        <span>
          {formatDate(expiryDateTime)} • {timeLeft}
        </span>
      )}
    </div>
  )
}
