'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FormGenerator } from '@/components/admin/FormGenerator'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [postData, setPostData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchPost()
    }
  }, [status, session, id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }

      const post = await response.json()

      // Parse categoryData from JSON string
      const enrichedPost = {
        ...post,
        categoryData: post.categoryData ? JSON.parse(post.categoryData) : {},
        detailsImages: post.detailsImages ? JSON.parse(post.detailsImages) : []
      }

      setPostData(enrichedPost)
      setSelectedCategory(enrichedPost.categoryType)
    } catch (err: any) {
      console.error('Error fetching post:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          categoryType: selectedCategory, // Use selected category
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update post')
      }

      // Redirect to admin dashboard on success
      router.push('/admin')
    } catch (error: any) {
      console.error('Error updating post:', error)
      alert('Error updating post: ' + error.message)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete post')
      }

      alert('Post deleted successfully')
      router.push('/admin')
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert('Error deleting post: ' + error.message)
    }
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

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Post</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!postData) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update the details below to modify the post
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Post
          </button>
        </div>

        {/* Category Selector */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Type
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              if (confirm('Changing category will reset the form. Continue?')) {
                setSelectedCategory(e.target.value);
              }
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          >
            <option value="OTHER" disabled>Select a Category</option>
            <option value="SPEND_OFFERS">Spend Offer</option>
            <option value="LIFETIME_FREE">Lifetime Free</option>
            <option value="STACKING_HACKS">Stacking Hack</option>
            <option value="JOINING_BONUS">Joining Bonus</option>
            <option value="TRANSFER_BONUS">Transfer Bonus</option>
            <option value="NEWS">News</option>
            <option value="DEVALUATION">Devaluation</option>
          </select>
          {selectedCategory === 'OTHER' && (
            <p className="mt-2 text-sm text-red-600">
              Please select a valid category to edit this post.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Note: Changing the category will update the post's category type
          </p>
        </div>

        {/* Dynamic Form Generator */}
        {selectedCategory !== 'OTHER' && (
          <FormGenerator
            key={selectedCategory} // Force re-mount when category changes
            categoryType={selectedCategory}
            initialData={{
              ...postData,
              categoryType: selectedCategory, // Override with selected category
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </main>
  )
}
