'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Home, ShoppingBag, MessageCircle, Heart, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Feedback', href: '/feedback', icon: Heart },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-2xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pastel-mint-dark to-pastel-blue-dark bg-clip-text text-transparent">
                BookLoop
              </span>
            </motion.div>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-2xl flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : 'text-neutral-600 hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-pastel-mint to-pastel-blue rounded-2xl shadow-md"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : ''}`} />
                    <span className={`relative z-10 font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 rounded-2xl bg-pastel-pink hover:bg-pastel-pink-dark text-white font-medium flex items-center gap-2 shadow-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-200">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl ${
                    isActive ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue' : ''
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-600'}`} />
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
