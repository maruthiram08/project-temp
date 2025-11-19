/**
 * Image Input Field Component
 * Supports URL input (file upload can be added later)
 */

'use client'

import { useState } from 'react'
import { FieldRendererProps } from './FieldRenderer'

export function ImageInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const [preview, setPreview] = useState(value || '')
  const [imageError, setImageError] = useState(false)

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setPreview(newValue)
    setImageError(false)
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="url"
        id={field.name}
        value={value || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
        `}
      />

      {preview && !imageError && (
        <div className="mt-3 border border-gray-200 rounded-lg p-2 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            onError={() => setImageError(true)}
            className="max-h-48 mx-auto rounded"
          />
        </div>
      )}

      {imageError && preview && (
        <div className="mt-3 border border-red-200 rounded-lg p-4 bg-red-50 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-red-600">Failed to load image</p>
        </div>
      )}

      {field.helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
