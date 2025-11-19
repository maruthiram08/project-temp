/**
 * Array Input Field Component
 * Allows adding/removing multiple text items
 */

'use client'

import { useState, useEffect } from 'react'
import { FieldRendererProps } from './FieldRenderer'

export function ArrayInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const [items, setItems] = useState<string[]>(Array.isArray(value) ? value : [])
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    if (Array.isArray(value)) {
      setItems(value)
    }
  }, [value])

  const addItem = () => {
    if (!newItem.trim() || disabled) return

    const maxItems = field.arrayMaxItems || 10
    if (items.length >= maxItems) return

    const updatedItems = [...items, newItem.trim()]
    setItems(updatedItems)
    onChange(updatedItems)
    setNewItem('')
  }

  const removeItem = (index: number) => {
    if (disabled) return

    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    onChange(updatedItems)
  }

  const updateItem = (index: number, newValue: string) => {
    if (disabled) return

    const updatedItems = [...items]
    updatedItems[index] = newValue
    setItems(updatedItems)
    onChange(updatedItems)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Existing Items */}
      {items.length > 0 && (
        <div className="space-y-2 mb-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={disabled}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove item"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Item */}
      {(!field.arrayMaxItems || items.length < field.arrayMaxItems) && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            placeholder={`Add ${field.label.toLowerCase()}...`}
            disabled={disabled}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <button
            type="button"
            onClick={addItem}
            disabled={disabled || !newItem.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}

      {field.helpText && !error && (
        <p className="mt-2 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <p className="mt-2 text-xs text-gray-400">
        {items.length} / {field.arrayMaxItems || '∞'} items
      </p>
    </div>
  )
}
