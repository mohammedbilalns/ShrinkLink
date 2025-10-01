import { Link } from "@tanstack/react-router";
import UrlForm from "../components/UrlForm";
import { useState } from "react";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Lightning Fast",
      description: "Create short URLs in seconds with our optimized service",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Custom Slugs",
      description: "Personalize your links with custom aliases",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "Analytics",
      description: "Track clicks and monitor your link performance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  const stats = [
    { value: "1M+", label: "Links Created" },
    { value: "50M+", label: "Clicks Tracked" },
    { value: "100K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] flex flex-col bg-gradient-to-br from-[#f3f4ff] to-[#e0f7fa] text-gray-800">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            LinkShrink
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Transform your long URLs into short, shareable links in seconds
          </p>
          
          {/* URL Form */}
          <div className="mb-16">
            <UrlForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg transform -translate-y-2"
                    : "bg-white shadow-md hover:shadow-lg"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of users who trust LinkShrink for their URL shortening needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition text-center"
            >
							
              Sign Up Now
            </Link>
            <Link
              href="/auth"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-gray-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>
                © 2024 LinkShrink. Made with <span className="text-red-500">♥</span>{" "}
                for the web.
              </p>
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition">API</a>
              <a href="#" className="hover:text-gray-600 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
