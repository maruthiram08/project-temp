import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import PostEditor from "@/components/PostEditor"

async function getPost(id: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id, authorId: userId },
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.isAdmin) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const post = await getPost(id, session.user.id)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
        <PostEditor
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content: post.content,
            categories: post.categories,
            published: post.published,
          }}
        />
      </div>
    </main>
  )
}
