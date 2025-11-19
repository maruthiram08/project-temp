import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, slug, excerpt, content, categories, published } = await req.json()

    if (!title?.trim() || !slug?.trim()) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      )
    }

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id, authorId: session.user.id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if slug is taken by another post
    if (slug !== existingPost.slug) {
      const slugTaken = await prisma.post.findUnique({
        where: { slug },
      })

      if (slugTaken) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || null,
        content,
        categories: categories || "SPEND_OFFERS",
        published: published || false,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id, authorId: session.user.id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
