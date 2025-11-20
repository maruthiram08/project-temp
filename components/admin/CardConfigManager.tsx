'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CardConfig {
  id: string
  categoryType: string
  displayName: string
  description: string | null
  formSchema: string
  renderConfig: string
  requiresBank: boolean
  requiresExpiry: boolean
  supportsVerification: boolean
  supportsActive: boolean
  supportsAuthor: boolean
  cardLayout: string
  sortOrder: number
  isEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

interface CardConfigManagerProps {
  initialCardConfigs: CardConfig[]
}

export default function CardConfigManager({ initialCardConfigs }: CardConfigManagerProps) {
  const router = useRouter()
  const [cardConfigs, setCardConfigs] = useState(initialCardConfigs)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<CardConfig | null>(null)
  const [formData, setFormData] = useState({
    categoryType: '',
    displayName: '',
    description: '',
    requiresBank: false,
    requiresExpiry: false,
    supportsVerification: false,
    supportsActive: false,
    supportsAuthor: false,
    cardLayout: 'standard',
    sortOrder: 0,
    isEnabled: true
  })

  const resetForm = () => {
    setFormData({
      categoryType: '',
      displayName: '',
      description: '',
      requiresBank: false,
      requiresExpiry: false,
      supportsVerification: false,
      supportsActive: false,
      supportsAuthor: false,
      cardLayout: 'standard',
      sortOrder: 0,
      isEnabled: true
    })
    setShowAddForm(false)
    setEditingConfig(null)
  }

  const handleEdit = (config: CardConfig) => {
    setEditingConfig(config)
    setFormData({
      categoryType: config.categoryType,
      displayName: config.displayName,
      description: config.description || '',
      requiresBank: config.requiresBank,
      requiresExpiry: config.requiresExpiry,
      supportsVerification: config.supportsVerification,
      supportsActive: config.supportsActive,
      supportsAuthor: config.supportsAuthor,
      cardLayout: config.cardLayout,
      sortOrder: config.sortOrder,
      isEnabled: config.isEnabled
    })
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingConfig) {
        // Update existing config
        const response = await fetch(`/api/admin/card-configs/${editingConfig.categoryType}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update card config')
        }
      } else {
        // Create new config
        const response = await fetch('/api/admin/card-configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            formSchema: JSON.stringify({ fields: [] }),
            renderConfig: JSON.stringify({ layout: 'standard' })
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create card config')
        }
      }

      resetForm()
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async (categoryType: string) => {
    if (!confirm('Are you sure you want to delete this card type? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/card-configs/${categoryType}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete card config')
      }

      router.refresh()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleToggleEnabled = async (config: CardConfig) => {
    try {
      const response = await fetch(`/api/admin/card-configs/${config.categoryType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          isEnabled: !config.isEnabled
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update card config')
      }

      router.refresh()
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Card Types ({cardConfigs.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showAddForm ? 'Cancel' : '+ Add Card Type'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingConfig ? 'Edit Card Type' : 'Add New Card Type'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Type (Unique ID) *
                </label>
                <input
                  type="text"
                  value={formData.categoryType}
                  onChange={(e) => setFormData({ ...formData, categoryType: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SPEND_OFFERS"
                  required
                  disabled={!!editingConfig}
                />
                <p className="text-xs text-gray-500 mt-1">Use UPPERCASE with underscores (e.g., SPEND_OFFERS)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spend Offers"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description of this card type..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Layout
                </label>
                <select
                  value={formData.cardLayout}
                  onChange={(e) => setFormData({ ...formData, cardLayout: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Feature Flags */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Feature Flags</h4>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresBank}
                    onChange={(e) => setFormData({ ...formData, requiresBank: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Requires Bank</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresExpiry}
                    onChange={(e) => setFormData({ ...formData, requiresExpiry: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Requires Expiry</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supportsVerification}
                    onChange={(e) => setFormData({ ...formData, supportsVerification: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Supports Verification</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supportsActive}
                    onChange={(e) => setFormData({ ...formData, supportsActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Supports Active Status</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.supportsAuthor}
                    onChange={(e) => setFormData({ ...formData, supportsAuthor: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Supports Author</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingConfig ? 'Update' : 'Create'} Card Type
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Card Configs List */}
      <div className="space-y-4">
        {cardConfigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No card types yet. Click "Add Card Type" to create one.
          </div>
        ) : (
          cardConfigs.map((config) => (
            <div
              key={config.id}
              className={`bg-white rounded-lg shadow-md p-6 ${!config.isEnabled ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {config.displayName}
                    </h3>
                    <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded">
                      {config.categoryType}
                    </span>
                    {!config.isEnabled && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                  {config.description && (
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      Layout: {config.cardLayout}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      Order: {config.sortOrder}
                    </span>
                    {config.requiresBank && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        Requires Bank
                      </span>
                    )}
                    {config.requiresExpiry && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        Requires Expiry
                      </span>
                    )}
                    {config.supportsVerification && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        Supports Verification
                      </span>
                    )}
                    {config.supportsActive && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        Supports Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleEnabled(config)}
                    className={`px-3 py-1 text-sm rounded ${
                      config.isEnabled
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {config.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleEdit(config)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(config.categoryType)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
