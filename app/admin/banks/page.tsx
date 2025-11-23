'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Bank {
  id: string
  name: string
  slug: string
  logo: string | null
  brandColor: string | null
  description: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

export default function BanksManagementPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    brandColor: '',
    description: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchBanks()
    }
  }, [status, session])

  const fetchBanks = async () => {
    try {
      const response = await fetch('/api/admin/banks?stats=true')
      if (response.ok) {
        const data = await response.json()
        setBanks(data)
      }
    } catch (error) {
      console.error('Error fetching banks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingBank
        ? `/api/admin/banks/${editingBank.id}`
        : '/api/admin/banks'

      const method = editingBank ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchBanks()
        resetForm()
        alert(`Bank ${editingBank ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save bank')
      }
    } catch (error) {
      console.error('Error saving bank:', error)
      alert('Failed to save bank')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank)
    setFormData({
      name: bank.name,
      slug: bank.slug,
      logo: bank.logo || '',
      brandColor: bank.brandColor || '',
      description: bank.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (bank: Bank) => {
    if (!confirm(`Are you sure you want to delete ${bank.name}?`)) {
      return
    }

    setDeletingId(bank.id)
    try {
      const response = await fetch(`/api/admin/banks/${bank.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchBanks()
        alert('Bank deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete bank')
      }
    } catch (error) {
      console.error('Error deleting bank:', error)
      alert('Failed to delete bank')
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo: '',
      brandColor: '',
      description: ''
    })
    setEditingBank(null)
    setShowForm(false)
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!session?.user?.isAdmin) {
    router.push('/auth/signin')
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Manage Banks</h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove banks from your system</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : '+ Add New Bank'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingBank ? 'Edit Bank' : 'Add New Bank'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., hdfc-bank"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Color
                </label>
                <input
                  type="text"
                  value={formData.brandColor}
                  onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#004C8F"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the bank"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitting ? 'Saving...' : editingBank ? 'Update Bank' : 'Create Bank'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banks List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No banks yet. Add your first bank!
                  </td>
                </tr>
              ) : (
                banks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {bank.logo && (
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="h-8 w-auto"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bank.name}
                          </div>
                          {bank.description && (
                            <div className="text-xs text-gray-500">{bank.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank._count?.posts || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bank.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(bank)}
                        disabled={deletingId === bank.id}
                        className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bank)}
                        disabled={deletingId === bank.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {deletingId === bank.id && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                        )}
                        {deletingId === bank.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
