/**
 * Card Component Registry
 * Maps category types to their respective card components
 */

import { EnrichedPost } from '@/types/categories'
import { SpendOfferCard } from './SpendOfferCard'
import { LifetimeFreeCard } from './LifetimeFreeCard'
import { StackingHackCard } from './StackingHackCard'
import { JoiningBonusCard } from './JoiningBonusCard'
import { TransferBonusCard } from './TransferBonusCard'

// ============================================================================
// TYPES
// ============================================================================

export interface CardComponentProps {
  post: EnrichedPost
  layout?: 'standard' | 'compact' | 'premium'
  onCardClick?: (post: EnrichedPost) => void
}

export type CardComponent = React.ComponentType<CardComponentProps>

// ============================================================================
// REGISTRY
// ============================================================================

export const CardRegistry: Record<string, CardComponent> = {
  SPEND_OFFERS: SpendOfferCard,
  LIFETIME_FREE: LifetimeFreeCard,
  STACKING_HACKS: StackingHackCard,
  JOINING_BONUS: JoiningBonusCard,
  TRANSFER_BONUS: TransferBonusCard
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the card component for a given category type
 * Returns null if no component is registered
 */
export function getCardComponent(categoryType: string): CardComponent | null {
  return CardRegistry[categoryType] || null
}

/**
 * Check if a card component exists for a category type
 */
export function hasCardComponent(categoryType: string): boolean {
  return categoryType in CardRegistry
}

/**
 * Get all registered category types
 */
export function getRegisteredCategoryTypes(): string[] {
  return Object.keys(CardRegistry)
}
