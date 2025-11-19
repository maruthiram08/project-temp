export default function Features() {
  const features = [
    {
      icon: "📧",
      title: "Deal Feed",
      description: "Stay ahead with our comprehensive feed that aggregates the best credit card offers and deals in one place.",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: "✓",
      title: "Verified Deals",
      description: "All deals and offers are manually verified by our team to ensure accuracy and value for your financial decisions.",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: "👥",
      title: "Community Insights",
      description: "Learn from real experiences shared by thousands of credit card users and make informed choices.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: "📊",
      title: "Devaluation Tracker",
      description: "Get notified about reward program changes and devaluations before they impact your points.",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      badge: "Coming Soon"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to help you maximize every credit card benefit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {feature.badge}
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <span className={`text-2xl ${feature.iconColor}`}>{feature.icon}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
