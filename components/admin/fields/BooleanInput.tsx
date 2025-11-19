/**
 * Boolean Toggle/Checkbox Input Field Component
 */

'use client'

import { FieldRendererProps } from './FieldRenderer'

export function BooleanInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const isChecked = value === true || value === 'true'

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={field.name}
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              h-4 w-4 rounded border-gray-300
              text-blue-600 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : ''}
            `}
          />
        </div>
        <div className="ml-3">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.helpText && (
            <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
          )}
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
