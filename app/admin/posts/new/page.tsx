import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PostEditor from "@/components/PostEditor"

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.isAdmin) {
    redirect("/auth/signin")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
        <PostEditor />
      </div>
    </main>
  )
}
