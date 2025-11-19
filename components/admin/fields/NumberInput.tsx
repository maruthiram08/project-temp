/**
 * Number Input Field Component
 */

'use client'

import { FieldRendererProps } from './FieldRenderer'

export function NumberInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="number"
        id={field.name}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        placeholder={field.placeholder}
        disabled={disabled}
        min={field.validation?.min}
        max={field.validation?.max}
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

      {(field.validation?.min !== undefined || field.validation?.max !== undefined) && (
        <p className="mt-1 text-xs text-gray-400">
          Range: {field.validation.min ?? '-∞'} to {field.validation.max ?? '∞'}
        </p>
      )}
    </div>
  )
}
