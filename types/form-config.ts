/**
 * TypeScript types for dynamic form generation system
 * These interfaces define the structure of form schemas stored in CardConfig
 */

// ============================================================================
// FORM FIELD TYPES
// ============================================================================

export const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  DATE: 'date',
  DATETIME: 'datetime',
  COLOR: 'color',
  IMAGE: 'image',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  URL: 'url',
  ARRAY: 'array'
} as const

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES]

export const CONDITIONAL_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  EXISTS: 'exists',
  NOT_EMPTY: 'notEmpty'
} as const

export type ConditionalOperator = typeof CONDITIONAL_OPERATORS[keyof typeof CONDITIONAL_OPERATORS]

// ============================================================================
// FORM FIELD INTERFACE
// ============================================================================

export interface FormFieldValidation {
  min?: number
  max?: number
  pattern?: string
  custom?: string  // Function name for custom validation
}

export interface FormFieldShowIf {
  field: string
  operator: ConditionalOperator
  value?: any
}

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  name: string                    // Field path (supports nested: "categoryData.offerTitle")
  label: string
  type: FieldType
  placeholder?: string
  required: boolean
  defaultValue?: any

  // Validation
  validation?: FormFieldValidation

  // Conditional Display
  showIf?: FormFieldShowIf

  // Field-specific config
  options?: FormFieldOption[]     // For select/multiselect
  accept?: string                 // For image uploads (e.g., "image/*")
  arrayItemType?: 'text' | 'object' // For array fields
  arrayMaxItems?: number

  // UI hints
  helpText?: string
  section?: string                // Groups fields into sections
  order?: number
}

// ============================================================================
// FORM SECTION INTERFACE
// ============================================================================

export interface FormSection {
  id: string
  title: string
  description?: string
  order: number
  collapsed?: boolean
}

// ============================================================================
// VALIDATION RULE INTERFACE
// ============================================================================

export interface ValidationRule {
  ruleName: string
  errorMessage: string
  fields: string[]
  validator: string               // Function name
}

// ============================================================================
// FORM SCHEMA INTERFACE
// ============================================================================

export interface FormSchema {
  sections: FormSection[]
  fields: FormField[]
  validationRules?: ValidationRule[]
}

// ============================================================================
// RENDER CONFIG INTERFACES
// ============================================================================

export const LAYOUT_TYPES = {
  CARD: 'card',
  LIST: 'list',
  GRID: 'grid'
} as const

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES]

export const ELEMENT_LAYOUTS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
} as const

export type ElementLayout = typeof ELEMENT_LAYOUTS[keyof typeof ELEMENT_LAYOUTS]

export const BADGE_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  CENTER: 'center'
} as const

export type BadgePosition = typeof BADGE_POSITIONS[keyof typeof BADGE_POSITIONS]

export const IMAGE_TYPES = {
  BACKGROUND: 'background',
  BANNER: 'banner',
  HERO: 'hero'
} as const

export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES]

export const HOVER_EFFECTS = {
  LIFT: 'lift',
  GLOW: 'glow',
  SCALE: 'scale',
  NONE: 'none'
} as const

export type HoverEffect = typeof HOVER_EFFECTS[keyof typeof HOVER_EFFECTS]

export interface RenderElementHeader {
  show: boolean
  fields: string[]
  layout: ElementLayout
}

export interface RenderElementTitle {
  field: string
  maxLines?: number
  fontSize?: string
}

export interface RenderElementDescription {
  field: string
  maxLines?: number
}

export interface RenderElementBadge {
  valueField: string
  unitField: string
  colorField: string
  position: BadgePosition
}

export interface RenderElementImage {
  field: string
  type: ImageType
  aspectRatio?: string
}

export interface RenderElementFooter {
  show: boolean
  fields: string[]
}

export interface RenderElements {
  header?: RenderElementHeader
  title?: RenderElementTitle
  description?: RenderElementDescription
  badge?: RenderElementBadge
  image?: RenderElementImage
  footer?: RenderElementFooter
}

export interface RenderLayout {
  type: LayoutType
  columns?: number
  gap?: string
  aspectRatio?: string
}

export interface RenderTheme {
  borderRadius?: string
  shadow?: string
  hoverEffect?: HoverEffect
  padding?: string
}

export interface RenderShowIf {
  field: string
  operator: 'exists' | 'equals' | 'notEmpty'
  value?: any
}

export interface RenderConfig {
  component: string             // Component name in registry
  layout: RenderLayout
  elements: RenderElements
  showIf?: RenderShowIf[]
  theme: RenderTheme
}

// ============================================================================
// CARD CONFIG (Combined Form + Render)
// ============================================================================

export interface CardConfigData {
  id: string
  categoryType: string
  displayName: string
  description?: string | null

  // JSON strings in DB, parsed objects here
  formSchema: FormSchema
  renderConfig: RenderConfig

  // Feature flags
  requiresBank: boolean
  requiresExpiry: boolean
  supportsVerification: boolean
  supportsActive: boolean
  supportsAuthor: boolean

  // Display settings
  cardLayout: 'standard' | 'premium' | 'compact'
  sortOrder: number
  isEnabled: boolean

  // Metadata
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Extract field values from form schema
 */
export type FormValues = Record<string, any>

/**
 * Form validation errors
 */
export interface FormValidationError {
  field: string
  message: string
}

export interface FormValidationResult {
  valid: boolean
  errors: FormValidationError[]
}
