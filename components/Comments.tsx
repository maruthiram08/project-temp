"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: Date
  user: {
    name: string
  } | null
}

interface CommentsProps {
  postId: string
  comments: Comment[]
}

export default function Comments({ postId, comments: initialComments }: CommentsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setError("Comment cannot be empty")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to post comment")
      }

      const comment = await response.json()
      setComments([comment, ...comments])
      setNewComment("")
      router.refresh()
    } catch (err) {
      setError("Failed to post comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in
            </Link>{" "}
            to comment on this post
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">
                  {comment.authorName}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
