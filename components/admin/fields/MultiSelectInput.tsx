/**
 * Multi-Select Input Field Component
 */

'use client'

import { useState } from 'react'
import { FieldRendererProps } from './FieldRenderer'

export function MultiSelectInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(value || [])

  const handleToggle = (optionValue: string) => {
    if (disabled) return

    let newValues: string[]
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue)
    } else {
      newValues = [...selectedValues, optionValue]
    }

    setSelectedValues(newValues)
    onChange(newValues)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-2">
        {field.options?.map((option) => {
          const isSelected = selectedValues.includes(option.value)
          return (
            <label
              key={option.value}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          )
        })}
      </div>

      {field.helpText && !error && (
        <p className="mt-2 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {selectedValues.length > 0 && (
        <p className="mt-2 text-xs text-gray-600">
          {selectedValues.length} selected
        </p>
      )}
    </div>
  )
}
