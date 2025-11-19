import Link from "next/link"
import Image from "next/image"

interface HeroProps {
  stats: {
    totalPosts: number
    totalCategories: number
    activeOffers: number
  }
}

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-pink-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  All-In-One Platform
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Never Miss a Deal
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Track spends and offers. Value rewards, and discover your complete credit card game to make every swipe count.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </Link>
              <Link
                href="/#deals"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all border border-gray-300"
              >
                Get Live in Feeds
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.totalPosts}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Cards</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.totalCategories}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Card Providers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.activeOffers}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Fresh Deals</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[600px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl opacity-50"></div>
            <div className="relative h-full flex items-center justify-center">
              {/* Placeholder for hero image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💳</div>
                  <p className="text-gray-500 text-sm">Hero Image Placeholder</p>
                  <p className="text-gray-400 text-xs mt-2">Add your lifestyle photo here</p>
                </div>
              </div>

              {/* Floating Card Preview */}
              <div className="absolute bottom-8 right-8 bg-white rounded-xl shadow-2xl p-4 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src="/assets/Cards/ICICI-Amazon-Pay-Credit-Card.png"
                    alt="Credit Card"
                    width={60}
                    height={38}
                    className="rounded"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Featured Deal</div>
                    <div className="text-xs text-gray-500">ICICI Amazon Pay</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">₹6,228</div>
                <div className="text-xs text-gray-500">Cashback this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
