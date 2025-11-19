import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CategoryManager from "@/components/CategoryManager"

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      children: {
        orderBy: {
          createdAt: "asc",
        },
      },
      parent: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return categories
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.isAdmin) {
    redirect("/auth/signin")
  }

  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your post categories and subcategories
          </p>
        </div>

        <CategoryManager initialCategories={categories} />
      </div>
    </main>
  )
}
