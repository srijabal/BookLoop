import Link from 'next/link'
import { BookOpen, Users, MessageCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/10 via-pastel-mint/10 to-pastel-lavender/10">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pastel-pink to-pastel-lavender rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">BookLoop</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <button className="px-6 py-2 rounded-2xl text-neutral-600 hover:bg-white/50 transition-colors font-medium">
              Login
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-6 py-2 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-medium shadow-md hover:shadow-lg transition-all">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-pastel-pink/30 rounded-full text-sm font-bold text-pastel-pink-dark mb-6 border-2 border-pastel-pink shadow-sm">
              For IITR Students, By IITR Students
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Stop buying books you'll use once
            </h1>

            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Rent, exchange, or buy second-hand books from your batchmates.
              Save money, help the environment, and build connections across campus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/auth/signup">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-4 rounded-2xl bg-white text-neutral-700 font-semibold shadow-md hover:shadow-lg transition-all">
                  Browse Books
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-pastel-pink">10+</div>
                <div className="text-sm text-neutral-500">Books Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pastel-lavender">5+</div>
                <div className="text-sm text-neutral-500">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pastel-mint">₹1K+</div>
                <div className="text-sm text-neutral-500">Saved</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Campus-Only Marketplace
              </h3>
              <p className="text-neutral-600">
                Find textbooks, novels, and study materials from students in your hostels.
                Meet at the library, SAC, or anywhere on campus.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pastel-lavender to-pastel-pink rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Chat & Coordinate
              </h3>
              <p className="text-neutral-600">
                No more DMs getting lost in group chats. Direct messaging makes it easy
                to finalize deals and arrange pickups.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pastel-yellow to-pastel-peach rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Community Reviews
              </h3>
              <p className="text-neutral-600">
                See what your seniors thought about that data structures book before buying.
                Real reviews from real IITRians.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 bg-gradient-to-r from-pastel-pink/20 via-pastel-lavender/20 to-pastel-blue/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            That ₹2000 engineering textbook sitting on your shelf?
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Someone in Rajendra or Kasturba probably needs it right now.
          </p>
          <Link href="/auth/signup">
            <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-semibold shadow-lg hover:shadow-xl transition-all text-lg">
              List Your First Book
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pastel-pink to-pastel-lavender rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-neutral-700">BookLoop</span>
            </div>
            <p className="text-sm text-neutral-500">
              Made with ❤️ for the IITR community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
