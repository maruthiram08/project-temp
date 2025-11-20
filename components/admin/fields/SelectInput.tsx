/**
 * Select Dropdown Input Field Component
 */

'use client'

import { useState, useEffect } from 'react'
import { FieldRendererProps } from './FieldRenderer'

interface SelectOption {
  label: string
  value: string
}

export function SelectInput({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const [options, setOptions] = useState<SelectOption[]>(field.options || [])
  const [loading, setLoading] = useState(false)

  // Fetch dynamic options for bankId field
  useEffect(() => {
    async function fetchBanks() {
      if (field.name === 'bankId') {
        setLoading(true)
        try {
          const response = await fetch('/api/admin/banks')
          if (response.ok) {
            const banks = await response.json()
            const bankOptions = banks.map((bank: any) => ({
              label: bank.name,
              value: bank.id
            }))
            setOptions(bankOptions)
          }
        } catch (error) {
          console.error('Error fetching banks:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBanks()
  }, [field.name])

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={field.name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
        `}
      >
        <option value="">
          {loading ? 'Loading...' : `Select ${field.label}...`}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {field.helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
