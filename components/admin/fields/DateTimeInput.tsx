/**
 * Date/DateTime Input Field Component
 */

'use client'

import { FieldRendererProps } from './FieldRenderer'

export function DateTimeInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const inputType = field.type === 'datetime' ? 'datetime-local' : 'date'

  const formatValue = (val: any) => {
    if (!val) return ''

    try {
      const date = new Date(val)
      if (field.type === 'datetime') {
        // Format as YYYY-MM-DDTHH:mm for datetime-local input
        return date.toISOString().slice(0, 16)
      } else {
        // Format as YYYY-MM-DD for date input
        return date.toISOString().slice(0, 10)
      }
    } catch {
      return ''
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={inputType}
        id={field.name}
        value={formatValue(value)}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
        `}
      />

      {field.helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
