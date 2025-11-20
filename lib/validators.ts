/**
 * Validation utilities for dynamic form system
 * These functions are referenced by name in form schemas' validationRules
 */

import { FormValidationError, FormValidationResult } from '@/types/form-config'

// ============================================================================
// VALIDATION RESULT HELPERS
// ============================================================================

export function createValidationError(field: string, message: string): FormValidationError {
  return { field, message }
}

export function createValidationResult(errors: FormValidationError[]): FormValidationResult {
  return {
    valid: errors.length === 0,
    errors
  }
}

// ============================================================================
// GENERIC VALIDATORS
// ============================================================================

/**
 * Validate that a field is not empty
 */
export function validateRequired(value: any, fieldName: string): FormValidationError | null {
  if (value === null || value === undefined || value === '') {
    return createValidationError(fieldName, `${fieldName} is required`)
  }
  return null
}

/**
 * Validate that a value is a valid number
 */
export function validateNumericValue(value: any, fieldName: string): FormValidationError | null {
  const numValue = parseFloat(value)
  if (isNaN(numValue)) {
    return createValidationError(fieldName, `${fieldName} must be a valid number`)
  }
  return null
}

/**
 * Validate multiple numeric values
 */
export function validateNumericValues(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []

  for (const fieldName of fieldNames) {
    const value = getNestedValue(values, fieldName)
    const error = validateNumericValue(value, fieldName)
    if (error) errors.push(error)
  }

  return errors
}

/**
 * Validate a single numeric value (wrapper for validation rules)
 * This is a wrapper around validateNumericValue that returns an array
 * for use in validation rules
 */
export function validateSingleNumericValue(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []
  const fieldName = fieldNames[0] // Get the first field
  const value = getNestedValue(values, fieldName)
  const error = validateNumericValue(value, fieldName)
  if (error) errors.push(error)
  return errors
}

/**
 * Validate a single required field (wrapper for validation rules)
 * This is a wrapper around validateRequired that returns an array
 * for use in validation rules
 */
export function validateSingleRequired(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []
  const fieldName = fieldNames[0] // Get the first field
  const value = getNestedValue(values, fieldName)
  const error = validateRequired(value, fieldName)
  if (error) errors.push(error)
  return errors
}

/**
 * Validate that a value is a valid URL
 */
export function validateUrl(value: any, fieldName: string): FormValidationError | null {
  if (!value) return null // Optional URL

  try {
    new URL(value)
    return null
  } catch {
    return createValidationError(fieldName, `${fieldName} must be a valid URL`)
  }
}

/**
 * Validate that a value is a valid hex color
 */
export function validateHexColor(value: any, fieldName: string): FormValidationError | null {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/
  if (!hexPattern.test(value)) {
    return createValidationError(fieldName, `${fieldName} must be a valid hex color (e.g., #10b981)`)
  }
  return null
}

// ============================================================================
// DATE VALIDATORS
// ============================================================================

/**
 * Validate that expiry date is in the future
 */
export function validateExpiryInFuture(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []
  const fieldName = fieldNames[0] // expiryDateTime
  const expiryValue = getNestedValue(values, fieldName)

  if (!expiryValue) return errors // Optional expiry

  const expiryDate = new Date(expiryValue)
  const now = new Date()

  if (expiryDate <= now) {
    errors.push(createValidationError(fieldName, 'Expiry date must be in the future'))
  }

  return errors
}

// ============================================================================
// CATEGORY-SPECIFIC VALIDATORS
// ============================================================================

/**
 * Validate valueBackValue for Spend Offers
 * Can be: "10", "500", "5x"
 */
export function validateValueBackValue(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []
  const fieldName = fieldNames[0]
  const value = getNestedValue(values, fieldName)

  if (!value) {
    errors.push(createValidationError(fieldName, 'Value back amount is required'))
    return errors
  }

  // Check if it's a number or a number followed by 'x'
  const pattern = /^(\d+\.?\d*)(x)?$/
  if (!pattern.test(value)) {
    errors.push(createValidationError(
      fieldName,
      'Value back must be a number or multiplier (e.g., 10, 5.5, 5x)'
    ))
  }

  return errors
}

/**
 * Validate Benefit 2 dependencies for Lifetime Free Cards
 * If benefit2Text is provided, benefit2Color must also be provided
 */
export function validateBenefit2Dependencies(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []
  const benefit2Text = getNestedValue(values, 'categoryData.benefit2Text')
  const benefit2Color = getNestedValue(values, 'categoryData.benefit2Color')

  if (benefit2Text && !benefit2Color) {
    errors.push(createValidationError(
      'categoryData.benefit2Color',
      'Benefit 2 color is required when benefit 2 text is provided'
    ))
  }

  return errors
}

/**
 * Validate transfer ratio values
 * Both from and to must be valid positive numbers
 */
export function validateTransferRatio(values: Record<string, any>, fieldNames: string[]): FormValidationError[] {
  const errors: FormValidationError[] = []

  const fromField = 'categoryData.transferRatioFrom'
  const toField = 'categoryData.transferRatioTo'

  const fromValue = getNestedValue(values, fromField)
  const toValue = getNestedValue(values, toField)

  const fromNum = parseFloat(fromValue)
  const toNum = parseFloat(toValue)

  if (isNaN(fromNum) || fromNum <= 0) {
    errors.push(createValidationError(fromField, 'Transfer ratio "from" must be a positive number'))
  }

  if (isNaN(toNum) || toNum <= 0) {
    errors.push(createValidationError(toField, 'Transfer ratio "to" must be a positive number'))
  }

  return errors
}

// ============================================================================
// FORM-LEVEL VALIDATION
// ============================================================================

/**
 * Validate an entire post against a form schema
 */
export async function validatePost(
  postData: Record<string, any>,
  formSchema: any
): Promise<FormValidationResult> {
  const errors: FormValidationError[] = []

  // 1. Validate individual fields
  for (const field of formSchema.fields) {
    const value = getNestedValue(postData, field.name)

    // Check required
    if (field.required && !value) {
      errors.push(createValidationError(field.name, `${field.label} is required`))
      continue
    }

    // Skip validation if field is optional and empty
    if (!field.required && !value) continue

    // Check validation rules
    if (field.validation) {
      const validationErrors = validateFieldRules(value, field.name, field.validation)
      errors.push(...validationErrors)
    }

    // Type-specific validation
    if (field.type === 'url' && value) {
      const urlError = validateUrl(value, field.name)
      if (urlError) errors.push(urlError)
    }

    if (field.type === 'color' && value) {
      const colorError = validateHexColor(value, field.name)
      if (colorError) errors.push(colorError)
    }

    if (field.type === 'number' && value) {
      const numError = validateNumericValue(value, field.name)
      if (numError) errors.push(numError)
    }
  }

  // 2. Validate business rules
  if (formSchema.validationRules) {
    for (const rule of formSchema.validationRules) {
      const validator = getValidator(rule.validator)
      if (validator) {
        const ruleErrors = await validator(postData, rule.fields)
        errors.push(...ruleErrors)
      }
    }
  }

  return createValidationResult(errors)
}

/**
 * Validate field-level rules (min, max, pattern)
 */
function validateFieldRules(
  value: any,
  fieldName: string,
  rules: any
): FormValidationError[] {
  const errors: FormValidationError[] = []

  if (rules.min !== undefined && value.length < rules.min) {
    errors.push(createValidationError(fieldName, `Minimum length is ${rules.min}`))
  }

  if (rules.max !== undefined && value.length > rules.max) {
    errors.push(createValidationError(fieldName, `Maximum length is ${rules.max}`))
  }

  if (rules.pattern) {
    const regex = new RegExp(rules.pattern)
    if (!regex.test(value)) {
      errors.push(createValidationError(fieldName, `Invalid format`))
    }
  }

  return errors
}

/**
 * Get validator function by name
 */
function getValidator(validatorName: string): Function | null {
  const validators: Record<string, Function> = {
    validateExpiryInFuture,
    validateValueBackValue,
    validateBenefit2Dependencies,
    validateNumericValue,
    validateNumericValues,
    validateSingleNumericValue,
    validateRequired,
    validateSingleRequired,
    validateTransferRatio
  }

  return validators[validatorName] || null
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'categoryData.offerTitle')
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

/**
 * Set nested value in object using dot notation
 * Example: setNestedValue(obj, 'categoryData.offerTitle', 'New Title')
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const parts = path.split('.')
  const lastPart = parts.pop()!

  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {}
    return acc[part]
  }, obj)

  target[lastPart] = value
}

/**
 * Parse categoryData from JSON string if needed
 */
export function parseCategoryData(post: any): any {
  if (typeof post.categoryData === 'string') {
    try {
      return {
        ...post,
        categoryData: JSON.parse(post.categoryData)
      }
    } catch (e) {
      console.error('Failed to parse categoryData:', e)
      return post
    }
  }
  return post
}

/**
 * Parse detailsImages from JSON string if needed
 */
export function parseDetailsImages(post: any): any {
  if (typeof post.detailsImages === 'string') {
    try {
      return {
        ...post,
        detailsImages: JSON.parse(post.detailsImages)
      }
    } catch (e) {
      console.error('Failed to parse detailsImages:', e)
      return { ...post, detailsImages: [] }
    }
  }
  return post
}

/**
 * Prepare post data for database storage
 * Converts categoryData object to JSON string and detailsImages array to JSON string
 */
export function preparePostForDatabase(post: any): any {
  const prepared = { ...post }

  if (typeof prepared.categoryData === 'object') {
    prepared.categoryData = JSON.stringify(prepared.categoryData)
  }

  if (Array.isArray(prepared.detailsImages)) {
    prepared.detailsImages = JSON.stringify(prepared.detailsImages)
  }

  return prepared
}

/**
 * Enrich post with parsed data for frontend consumption
 */
export function enrichPost(post: any): any {
  let enriched = parseCategoryData(post)
  enriched = parseDetailsImages(enriched)
  return enriched
}
