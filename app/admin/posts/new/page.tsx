'use client'

import { useState, useRef } from 'react'
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

  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const pendingStatusRef = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
      const payload: any = {
        ...data,
        categoryType: selectedCategory
      };

      // If a status change was requested via buttons
      const statusToUse = pendingStatusRef.current || pendingStatus;
      if (statusToUse) {
        payload.status = statusToUse;
        payload.published = statusToUse === 'active';
      } else {
        // Default to draft if not specified
        payload.status = 'draft';
        payload.published = false;
      }

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      const post = await response.json()

      // Clear ref
      pendingStatusRef.current = null;

      alert(`Post ${payload.status === 'active' ? 'published' : 'created as draft'} successfully!`);

      // Redirect to admin dashboard on success
      router.push('/admin')
    } catch (error: any) {
      console.error('Error creating post:', error)
      alert('Error creating post: ' + error.message)
      // Don't re-throw, just let the user try again
    } finally {
      setIsSaving(false);
    }
  }

  const handleCreateDraft = () => {
    setPendingStatus('draft');
    pendingStatusRef.current = 'draft';
    (document.getElementById('new-post-form') as HTMLFormElement)?.requestSubmit();
  }

  const handlePublish = () => {
    if (confirm('Are you sure you want to publish this post immediately?')) {
      setPendingStatus('active');
      pendingStatusRef.current = 'active';
      (document.getElementById('new-post-form') as HTMLFormElement)?.requestSubmit();
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new post
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Type Selector */}
            <div className="bg-white rounded-lg shadow-sm p-6">
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
              formId="new-post-form"
            />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {/* Publish Button */}
                <button
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isSaving && pendingStatus === 'active' ? 'Publishing...' : 'Publish Post'}
                </button>

                {/* Create Draft Button */}
                <button
                  onClick={handleCreateDraft}
                  disabled={isSaving}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving && pendingStatus === 'draft' ? 'Saving...' : 'Save as Draft'}
                </button>

                <button
                  onClick={handleCancel}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
