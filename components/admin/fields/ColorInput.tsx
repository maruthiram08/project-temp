/**
 * Color Picker Input Field Component
 */

'use client'

import { FieldRendererProps } from './FieldRenderer'

export function ColorInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          id={field.name}
          value={value || field.defaultValue || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            h-10 w-20 border rounded-lg shadow-sm cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        />

        <input
          type="text"
          value={value || field.defaultValue || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 border rounded-lg shadow-sm font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          `}
        />

        {value && (
          <div
            className="h-10 w-10 rounded border border-gray-300"
            style={{ backgroundColor: value }}
            title={value}
          />
        )}
      </div>

      {field.helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
