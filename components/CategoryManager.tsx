"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
  label: string
  description: string | null
  color: string
  parentId: string | null
  children?: Category[]
  parent?: Category | null
}

interface CategoryManagerProps {
  initialCategories: Category[]
}

const colorOptions = [
  { value: "bg-blue-100 text-blue-800", label: "Blue" },
  { value: "bg-green-100 text-green-800", label: "Green" },
  { value: "bg-purple-100 text-purple-800", label: "Purple" },
  { value: "bg-orange-100 text-orange-800", label: "Orange" },
  { value: "bg-pink-100 text-pink-800", label: "Pink" },
  { value: "bg-indigo-100 text-indigo-800", label: "Indigo" },
  { value: "bg-red-100 text-red-800", label: "Red" },
  { value: "bg-yellow-100 text-yellow-800", label: "Yellow" },
  { value: "bg-gray-100 text-gray-800", label: "Gray" },
]

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    label: "",
    description: "",
    color: "bg-gray-100 text-gray-800",
    parentId: "",
  })

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleLabelChange = (value: string) => {
    setFormData({
      ...formData,
      label: value,
      name: value.toUpperCase().replace(/\s+/g, "_"),
      slug: generateSlug(value),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories"

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save category")
      }

      // Reset form and close modal
      setFormData({
        name: "",
        slug: "",
        label: "",
        description: "",
        color: "bg-gray-100 text-gray-800",
        parentId: "",
      })
      setIsAddingCategory(false)
      setEditingCategory(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save category")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      label: category.label,
      description: category.description || "",
      color: category.color,
      parentId: category.parentId || "",
    })
    setIsAddingCategory(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete category")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingCategory(false)
    setEditingCategory(null)
    setFormData({
      name: "",
      slug: "",
      label: "",
      description: "",
      color: "bg-gray-100 text-gray-800",
      parentId: "",
    })
    setError("")
  }

  // Get parent categories (categories without a parentId)
  const parentCategories = categories.filter((cat) => !cat.parentId)

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Categories ({categories.length})
        </h2>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {isAddingCategory && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                id="label"
                value={formData.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Auto-generated)
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.color}`}>
                    Preview
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category (Optional)
                </label>
                <select
                  id="parentId"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top-level category)</option>
                  {parentCategories
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
              >
                {loading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {parentCategories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No categories yet. Create your first category!
            </div>
          ) : (
            parentCategories.map((category) => (
              <div key={category.id}>
                {/* Parent Category */}
                <div className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                          {category.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({category.children?.length || 0} subcategories)
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-2">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={loading || (category.children && category.children.length > 0)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title={category.children && category.children.length > 0 ? "Delete subcategories first" : ""}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Child Categories */}
                  {category.children && category.children.length > 0 && (
                    <div className="mt-4 ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                      {category.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${child.color}`}>
                                {child.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {child.slug}
                              </span>
                            </div>
                            {child.description && (
                              <p className="text-xs text-gray-500 mt-1">{child.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(child)}
                              className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(child.id)}
                              disabled={loading}
                              className="px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
