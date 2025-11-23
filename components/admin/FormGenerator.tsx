/**
 * Form Generator Component
 * Dynamically generates forms based on CardConfig
 */

'use client'

import { useState, useEffect } from 'react'
import { FormSchema, FormSection, FormField, FormValidationError } from '@/types/form-config'
import { FieldRenderer } from './fields/FieldRenderer'
import { getNestedValue, setNestedValue, validatePost } from '@/lib/validators'

export interface FormGeneratorProps {
  categoryType: string
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  onCancel: () => void
  formId?: string
}

export function FormGenerator({ categoryType, initialData, onSubmit, onCancel, formId }: FormGeneratorProps) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Fetch CardConfig and parse formSchema
  useEffect(() => {
    async function fetchCardConfig() {
      const maxRetries = 3
      let lastError: Error | undefined

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(`/api/admin/card-configs/${categoryType}`)
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to fetch card config: ${errorText}`)
          }

          const cardConfig = await response.json()
          const schema = JSON.parse(cardConfig.formSchema)
          setFormSchema(schema)

          // Expand all sections by default
          const sectionIds = schema.sections?.map((s: FormSection) => s.id) || []
          setExpandedSections(new Set(sectionIds))

          // Initialize form data with default values
          if (!initialData) {
            const defaults: Record<string, any> = { categoryType }
            schema.fields.forEach((field: FormField) => {
              if (field.defaultValue !== undefined) {
                setNestedValue(defaults, field.name, field.defaultValue)
              }
            })
            setFormData(defaults)
          }

          setIsLoading(false)
          return // Success - exit the retry loop
        } catch (error: any) {
          lastError = error
          console.error(`Error fetching card config (attempt ${attempt + 1}/${maxRetries}):`, error)

          // Check if this is a connection error worth retrying
          const isConnectionError =
            error?.message?.includes("Can't reach database") ||
            error?.message?.includes('Failed to fetch') ||
            error?.message?.includes('500')

          // Don't retry non-connection errors
          if (!isConnectionError || attempt === maxRetries - 1) {
            setIsLoading(false)
            break
          }

          // Wait before retrying with exponential backoff
          const delay = 1000 * Math.pow(2, attempt)
          console.warn(`Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      if (lastError) {
        console.error('Failed to fetch card config after retries:', lastError)
      }
    }

    fetchCardConfig()
  }, [categoryType, initialData])

  const handleFieldChange = (fieldName: string, value: any) => {
    const newFormData = { ...formData }
    setNestedValue(newFormData, fieldName, value)
    setFormData(newFormData)

    // Clear error for this field
    if (errors[fieldName]) {
      const newErrors = { ...errors }
      delete newErrors[fieldName]
      setErrors(newErrors)
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formSchema) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validationResult = await validatePost(formData, formSchema)

      if (!validationResult.valid) {
        // Convert validation errors to error map
        const errorMap: Record<string, string> = {}
        validationResult.errors.forEach((error: FormValidationError) => {
          errorMap[error.field] = error.message
        })
        setErrors(errorMap)

        // Scroll to first error
        const firstErrorField = Object.keys(errorMap)[0]
        const element = document.getElementById(firstErrorField)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })

        return
      }

      // Submit data
      await onSubmit(formData)
    } catch (error: any) {
      console.error('Form submission error:', error)
      // Handle API errors
      if (error.errors) {
        setErrors(error.errors)
      }
    } finally {
      // Always reset submitting state
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!formSchema) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load form configuration for category: {categoryType}</p>
      </div>
    )
  }

  // Check if field should be shown based on showIf condition
  const shouldShowField = (field: FormField): boolean => {
    if (!field.showIf) return true

    const fieldValue = getNestedValue(formData, field.showIf.field)

    switch (field.showIf.operator) {
      case 'equals':
        return fieldValue === field.showIf.value
      case 'notEquals':
        return fieldValue !== field.showIf.value
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(field.showIf.value)
      case 'greaterThan':
        return fieldValue > field.showIf.value
      case 'lessThan':
        return fieldValue < field.showIf.value
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== ''
      case 'notEmpty':
        return Boolean(fieldValue)
      default:
        return true
    }
  }

  // Group fields by section
  const fieldsBySection = formSchema.fields.reduce((acc, field) => {
    const sectionId = field.section || 'default'
    if (!acc[sectionId]) acc[sectionId] = []
    acc[sectionId].push(field)
    return acc
  }, {} as Record<string, FormField[]>)

  // Sort sections by order
  const sortedSections = [...(formSchema.sections || [])].sort((a, b) => a.order - b.order)

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {/* Form Sections */}
      {sortedSections.map((section) => {
        const sectionFields = (fieldsBySection[section.id] || []).sort((a, b) => (a.order || 0) - (b.order || 0))
        const isExpanded = expandedSections.has(section.id)

        return (
          <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Section Fields */}
            {isExpanded && (
              <div className="px-6 py-4 space-y-4">
                {sectionFields.map((field) => {
                  if (!shouldShowField(field)) return null

                  return (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={getNestedValue(formData, field.name)}
                      onChange={(value) => handleFieldChange(field.name, value)}
                      error={errors[field.name]}
                      disabled={isSubmitting}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

    </form>
  )
}
