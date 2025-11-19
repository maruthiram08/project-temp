/**
 * URL Input Field Component with validation preview
 */

'use client'

import { useState } from 'react'
import { FieldRendererProps } from './FieldRenderer'

export function URLInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const [isValid, setIsValid] = useState(true)

  const validateURL = (url: string) => {
    if (!url) {
      setIsValid(true)
      return
    }

    try {
      new URL(url)
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
  }

  const handleChange = (newValue: string) => {
    onChange(newValue)
    validateURL(newValue)
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="url"
          id={field.name}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder || 'https://example.com'}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error || !isValid ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          `}
        />

        {value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isValid ? (
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>

      {value && isValid && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
        >
          Open in new tab
          <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      {field.helpText && !error && isValid && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {!isValid && value && (
        <p className="mt-1 text-xs text-red-600">Please enter a valid URL</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
