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
          <div className="space-y-6">
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
