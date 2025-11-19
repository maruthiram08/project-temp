/**
 * TextArea Input Field Component
 */

'use client'

import { FieldRendererProps } from './FieldRenderer'

export function TextAreaInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={field.name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={disabled}
        rows={6}
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

      {field.validation?.max && (
        <p className="mt-1 text-xs text-gray-400">
          {value?.length || 0} / {field.validation.max} characters
        </p>
      )}
    </div>
  )
}
