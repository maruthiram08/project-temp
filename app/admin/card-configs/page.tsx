import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CardConfigManager from "@/components/admin/CardConfigManager"

async function getCardConfigs() {
  const cardConfigs = await prisma.cardConfig.findMany({
    orderBy: {
      sortOrder: "asc",
    },
  })

  return cardConfigs
}

export default async function CardConfigsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.isAdmin) {
    redirect("/auth/signin")
  }

  const cardConfigs = await getCardConfigs()

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Card Type Management</h1>
          <p className="mt-2 text-gray-600">
            Manage card types and their configurations
          </p>
        </div>

        <CardConfigManager initialCardConfigs={cardConfigs} />
      </div>
    </main>
  )
}
