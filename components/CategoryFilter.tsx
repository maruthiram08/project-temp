"use client"

import { useRouter, useSearchParams } from "next/navigation"

type PostCategory = "SPEND_OFFERS" | "LIFETIME_FREE" | "FEATURED_CAMPAIGNS" | "STACKING_HACKS" | "REWARD_TRANSFER" | "LOYALTY_STATUS"

const categories = [
  { value: "ALL", label: "All Posts", color: "bg-gray-200 text-gray-800 hover:bg-gray-300" },
  { value: "SPEND_OFFERS", label: "Spend Offers", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { value: "LIFETIME_FREE", label: "Lifetime Free", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { value: "FEATURED_CAMPAIGNS", label: "Featured Campaigns", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { value: "STACKING_HACKS", label: "Stacking Hacks", color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { value: "REWARD_TRANSFER", label: "Reward Transfer", color: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
  { value: "LOYALTY_STATUS", label: "Loyalty Status", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "ALL"

  const handleCategoryChange = (category: string) => {
    if (category === "ALL") {
      router.push("/")
    } else {
      router.push(`/?category=${category}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            currentCategory === cat.value
              ? cat.color + " ring-2 ring-offset-2 ring-blue-500"
              : cat.color + " opacity-70"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
