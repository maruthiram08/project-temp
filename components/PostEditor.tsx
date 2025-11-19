"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ContentBlock {
  type: "text" | "image" | "youtube" | "url"
  content: string
}

interface Category {
  id: string
  name: string
  slug: string
  label: string
  description: string | null
  color: string
  parentId: string | null
  children?: Category[]
}

interface PostEditorProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    categories: string
    published: boolean
  }
}

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")

  // Parse categories from comma-separated string
  const initialCategories = initialData?.categories
    ? initialData.categories.split(",").filter(c => c.trim())
    : []
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)

  const [categories, setCategories] = useState<Category[]>([])
  const [published, setPublished] = useState(initialData?.published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)

          // Set default category if none selected
          if (selectedCategories.length === 0 && data.length > 0) {
            setSelectedCategories([data[0].name])
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  let initialBlocks: ContentBlock[] = [{ type: "text", content: "" }]
  if (initialData?.content) {
    try {
      initialBlocks = JSON.parse(initialData.content)
    } catch (e) {
      initialBlocks = [{ type: "text", content: initialData.content }]
    }
  }

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(initialBlocks)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!initialData?.id) {
      setSlug(generateSlug(value))
    }
  }

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Don't allow removing all categories
        if (prev.length === 1) return prev
        return prev.filter(c => c !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
  }

  // Get all categories including children as a flat list
  const allCategories = categories.reduce<Category[]>((acc, cat) => {
    acc.push(cat)
    if (cat.children) {
      acc.push(...cat.children)
    }
    return acc
  }, [])

  const addBlock = (type: ContentBlock["type"]) => {
    setContentBlocks([...contentBlocks, { type, content: "" }])
  }

  const updateBlock = (index: number, content: string) => {
    const newBlocks = [...contentBlocks]
    newBlocks[index].content = content
    setContentBlocks(newBlocks)
  }

  const removeBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === contentBlocks.length - 1)
    ) {
      return
    }

    const newBlocks = [...contentBlocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ]
    setContentBlocks(newBlocks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required")
      setLoading(false)
      return
    }

    const contentJson = JSON.stringify(contentBlocks)

    try {
      const url = initialData?.id
        ? `/api/posts/${initialData.id}`
        : "/api/posts/create"

      const response = await fetch(url, {
        method: initialData?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content: contentJson,
          categories: selectedCategories.join(","),
          published,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save post")
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) *
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /posts/{slug || "your-post-slug"}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Preview)
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Short summary of the post..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories * (Select one or more)
          </label>
          <div className="space-y-4">
            {categories.filter(cat => !cat.parentId).map((parentCat) => (
              <div key={parentCat.id}>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => toggleCategory(parentCat.name)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${parentCat.color.replace('text-', 'border-').replace('-800', '-300')} ${parentCat.color} ${
                      selectedCategories.includes(parentCat.name)
                        ? "ring-2 ring-offset-2 ring-gray-400 font-semibold"
                        : "opacity-60"
                    }`}
                    title={parentCat.description || ""}
                  >
                    {parentCat.label}
                  </button>
                </div>
                {parentCat.children && parentCat.children.length > 0 && (
                  <div className="ml-6 flex flex-wrap gap-2">
                    {parentCat.children.map((childCat) => (
                      <button
                        key={childCat.id}
                        type="button"
                        onClick={() => toggleCategory(childCat.name)}
                        className={`px-3 py-1.5 text-sm rounded-full border-2 transition-all ${childCat.color.replace('text-', 'border-').replace('-800', '-300')} ${childCat.color} ${
                          selectedCategories.includes(childCat.name)
                            ? "ring-2 ring-offset-2 ring-gray-400 font-semibold"
                            : "opacity-60"
                        }`}
                        title={childCat.description || ""}
                      >
                        ↳ {childCat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Selected: {selectedCategories.map(name => {
                const cat = allCategories.find(c => c.name === name)
                return cat?.label || name
              }).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Content Blocks</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addBlock("text")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Text
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Image
            </button>
            <button
              type="button"
              onClick={() => addBlock("youtube")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + YouTube
            </button>
            <button
              type="button"
              onClick={() => addBlock("url")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              + Link
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {block.type}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, "down")}
                    disabled={index === contentBlocks.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {block.type === "text" ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={6}
                  placeholder="Enter text content..."
                />
              ) : (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    block.type === "image"
                      ? "Enter image URL..."
                      : block.type === "youtube"
                      ? "Enter YouTube URL..."
                      : "Enter URL..."
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Publish immediately
          </span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {loading ? "Saving..." : initialData?.id ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
