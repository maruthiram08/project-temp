import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/categories - Get all categories with children
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, slug, label, description, color, parentId } = await req.json()

    if (!name?.trim() || !slug?.trim() || !label?.trim()) {
      return NextResponse.json(
        { error: "Name, slug, and label are required" },
        { status: 400 }
      )
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug: slug.trim() },
        ],
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim().toUpperCase().replace(/\s+/g, "_"),
        slug: slug.trim().toLowerCase(),
        label: label.trim(),
        description: description?.trim() || null,
        color: color || "bg-gray-100 text-gray-800",
        parentId: parentId || null,
      },
      include: {
        children: true,
        parent: true,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
