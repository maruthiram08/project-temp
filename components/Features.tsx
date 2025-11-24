export default function Features() {
  const mainFeatures = [
    {
      icon: "🎯",
      title: "All Deals, One Platform",
      description: "Track spend offers, joining bonuses, transfer deals, hotel/airline promotions, and stacking hacks - all verified and organized in one place.",
      iconBg: "bg-gradient-to-br from-pink-100 to-red-100",
    },
    {
      icon: "✓",
      title: "Every Deal Verified",
      description: "Our team manually verifies each offer for accuracy and value, ensuring you get reliable information for your financial decisions.",
      iconBg: "bg-gradient-to-br from-orange-100 to-yellow-100",
    },
    {
      icon: "⚡",
      title: "Never Miss Limited Offers",
      description: "Get notified about time-limited campaign deals and expiring promotions before they disappear.",
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    }
  ]

  const comingSoonFeatures = [
    {
      icon: "🤖",
      title: "AI Card Advisor",
      description: "Smart recommendations for the best card based on your spending",
      iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    },
    {
      icon: "💬",
      title: "Community Insights",
      description: "Real experiences and reviews from thousands of users",
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
    }
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete credit card optimization platform - tracking deals, offers, and opportunities so you never miss out
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">Exciting features we're working on for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {comingSoonFeatures.map((feature, index) => (
              <div
                key={index}
                className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 opacity-75"
              >
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Coming Soon
                  </span>
                </div>

                <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
