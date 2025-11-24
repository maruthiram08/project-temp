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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 flex items-center gap-2 w-fit">
                  <span className="text-red-500">🔔</span>
                  New deals added daily
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Never Miss a Deal
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Stay alert with best credit cards & discover a universe of choices for optimizing your benefits on everyday spending
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                  100+
                </div>
                <div className="text-sm text-gray-600 mt-1">Credit Cards</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                  50k+
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Users</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                  98%
                </div>
                <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[500px] h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl opacity-50"></div>
            <div className="relative h-full flex items-center justify-center">
              {/* Hero Image */}
              <div className="w-full h-full rounded-3xl overflow-hidden">
                <Image
                  src="/assets/hero-image.jpg"
                  alt="Happy person using credit card for online shopping"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
