/**
 * TypeScript types for category-specific data structures
 * These interfaces define the shape of data stored in Post.categoryData JSON field
 */

// ============================================================================
// CATEGORY DATA INTERFACES
// ============================================================================

/**
 * Track 1: Spend Offers
 * Value-back offers from banks (cashback, rewards, discounts)
 */
export interface SpendOfferData {
  offerTitle: string
  shortDescription: string
  valueBackValue: string      // e.g., "10", "500", "5x"
  valueBackUnit: string        // e.g., "%", "₹", "pts", "x"
  valueBackColor: string       // Hex color for badge
}

/**
 * Track 2: Lifetime Free Cards
 * Credit cards with no annual fees
 */
export interface LifetimeFreeCardData {
  cardName: string
  cardBackgroundColor: string
  cardBackgroundImage?: string
  feeText: string              // e.g., "₹0 annual fee forever"

  // Benefit 1 (required)
  benefit1Icon: string
  benefit1Text: string
  benefit1Color: string

  // Benefit 2 (optional)
  benefit2Icon?: string
  benefit2Text?: string
  benefit2Color?: string

  applyUrl: string             // External application URL
}

/**
 * Track 3: Stacking Hacks
 * Strategies to maximize rewards by stacking multiple offers
 */
export interface StackingHackData {
  stackTitle: string
  categoryLabel: string        // e.g., "Dining", "Travel"
  stackTypeTags: string[]      // e.g., ["Cashback", "Points", "Discount"]

  // Reward breakdown
  mainRewardValue: string      // Total combined reward
  mainRewardUnit: string       // e.g., "%", "₹", "pts"
  extraSavingValue: string     // Additional bonus from stacking
  extraSavingUnit: string
  baseRateValue: string        // Base reward without stacking
  baseRateUnit: string

  // Visual and attribution
  bannerImage?: string
  authorName?: string
  authorHandle?: string
  authorPlatform?: string      // e.g., "twitter", "linkedin"
}

/**
 * Track 4: Joining Bonus
 * Welcome offers and signup bonuses for new cardholders
 */
export interface JoiningBonusData {
  cardName: string
  shortDescription: string

  // Card visual (hero image)
  cardVisualImage: string      // Required
  cardVisualAlt?: string

  // Savings badge
  savingsValue: string         // e.g., "10000"
  savingsUnit: string          // e.g., "₹", "pts"
  savingsColor: string         // Hex color for badge
}

/**
 * Track 5: Transfer Bonuses
 * Bonus miles/points for transferring between loyalty programs
 */
export interface TransferBonusData {
  sourceProgram: string        // e.g., "Axis Edge Rewards"
  destinationProgram: string   // e.g., "Singapore Airlines KrisFlyer"
  shortDescription: string

  // Transfer ratio
  transferRatioFrom: string    // e.g., "1000"
  transferRatioTo: string      // e.g., "1000"

  // Bonus badge
  bonusValue: string           // e.g., "15"
  bonusUnit: string            // e.g., "%"
  bonusColor: string           // Hex color for badge
}

/**
 * Union type of all category data types
 */
export type CategoryData =
  | SpendOfferData
  | LifetimeFreeCardData
  | StackingHackData
  | JoiningBonusData
  | TransferBonusData

// ============================================================================
// CATEGORY TYPE CONSTANTS
// ============================================================================

export const CATEGORY_TYPES = {
  SPEND_OFFERS: 'SPEND_OFFERS',
  LIFETIME_FREE: 'LIFETIME_FREE',
  STACKING_HACKS: 'STACKING_HACKS',
  JOINING_BONUS: 'JOINING_BONUS',
  TRANSFER_BONUS: 'TRANSFER_BONUS'
} as const

export type CategoryType = typeof CATEGORY_TYPES[keyof typeof CATEGORY_TYPES]

// ============================================================================
// DISPLAY FORMAT ENUMS
// ============================================================================

export const EXPIRY_DISPLAY_FORMAT = {
  DATE: 'date',
  COUNTDOWN: 'countdown',
  BOTH: 'both'
} as const

export type ExpiryDisplayFormat = typeof EXPIRY_DISPLAY_FORMAT[keyof typeof EXPIRY_DISPLAY_FORMAT]

export const POST_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
} as const

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS]

export const CTA_ACTION = {
  OVERLAY: 'overlay',
  EXTERNAL: 'external',
  INTERNAL: 'internal'
} as const

export type CTAAction = typeof CTA_ACTION[keyof typeof CTA_ACTION]

// ============================================================================
// ENRICHED POST TYPE
// ============================================================================

/**
 * Post with parsed categoryData
 * Use this type when working with posts after JSON parsing
 */
export interface EnrichedPost<T extends CategoryData = CategoryData> {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null

  // Category system
  categoryType: CategoryType
  categoryData: T

  // Conditional shared fields
  bankId?: string | null
  bank?: {
    id: string
    name: string
    slug: string
    logo?: string | null
    brandColor?: string | null
  } | null
  isVerified?: boolean | null

  // Expiry
  expiryDateTime?: Date | null
  showExpiryBadge: boolean
  expiryDisplayFormat?: ExpiryDisplayFormat | null

  // Operational status
  isActive?: boolean | null
  statusBadgeText?: string | null
  statusBadgeColor?: string | null

  // Details/overlay
  detailsContent?: string | null
  detailsImages?: string[] | null

  // CTA
  ctaText: string
  ctaUrl?: string | null
  ctaAction: CTAAction

  // Status
  published: boolean
  status: PostStatus

  // Metadata
  authorId: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isSpendOfferData(data: CategoryData): data is SpendOfferData {
  return 'offerTitle' in data && 'valueBackValue' in data
}

export function isLifetimeFreeCardData(data: CategoryData): data is LifetimeFreeCardData {
  return 'cardName' in data && 'feeText' in data && 'benefit1Icon' in data
}

export function isStackingHackData(data: CategoryData): data is StackingHackData {
  return 'stackTitle' in data && 'stackTypeTags' in data
}

export function isJoiningBonusData(data: CategoryData): data is JoiningBonusData {
  return 'cardVisualImage' in data && 'savingsValue' in data
}

export function isTransferBonusData(data: CategoryData): data is TransferBonusData {
  return 'sourceProgram' in data && 'destinationProgram' in data
}
