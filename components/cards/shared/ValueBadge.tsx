/**
 * Value Badge Component
 * Displays value-back amounts, savings, bonuses, etc.
 */

'use client'

export interface ValueBadgeProps {
  value: string
  unit: string
  color: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  size?: 'sm' | 'md' | 'lg'
}

export function ValueBadge({ value, unit, color, position = 'top-right', size = 'md' }: ValueBadgeProps) {
  const positionClasses = {
    'top-right': 'absolute top-3 right-3',
    'top-left': 'absolute top-3 left-3',
    'bottom-right': 'absolute bottom-3 right-3',
    'bottom-left': 'absolute bottom-3 left-3',
    'center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div
      className={`${positionClasses[position]} ${sizeClasses[size]} rounded-lg font-bold text-white shadow-md flex items-baseline gap-1`}
      style={{ backgroundColor: color }}
    >
      <span className="text-lg">{value}</span>
      <span className="text-xs opacity-90">{unit}</span>
    </div>
  )
}
