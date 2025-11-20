'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FormGenerator } from '@/components/admin/FormGenerator'

const CATEGORY_TYPES = [
  { value: 'SPEND_OFFERS', label: 'Spend Offers' },
  { value: 'LIFETIME_FREE', label: 'Lifetime Free Cards' },
  { value: 'STACKING_HACKS', label: 'Stacking Hacks' },
  { value: 'JOINING_BONUS', label: 'Joining Bonus' },
  { value: 'TRANSFER_BONUS', label: 'Transfer Bonus' }
]

export default function NewPostPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [selectedCategory, setSelectedCategory] = useState('SPEND_OFFERS')

  if (status === 'loading') {
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

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          categoryType: selectedCategory
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      const post = await response.json()

      // Redirect to admin dashboard on success
      router.push('/admin')
    } catch (error: any) {
      console.error('Error creating post:', error)
      alert('Error creating post: ' + error.message)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new post
          </p>
        </div>

        {/* Category Type Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Type *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORY_TYPES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Select the type of post you want to create. Different types have different fields.
          </p>
        </div>

        {/* Dynamic Form Generator */}
        <FormGenerator
          categoryType={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </main>
  )
}
