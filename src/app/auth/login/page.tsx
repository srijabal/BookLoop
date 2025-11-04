'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate IIT email
    if (!email.endsWith('@iitr.ac.in') && !email.endsWith('.iitr.ac.in')) {
      setError('Please use your IIT email address')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  
  const floatingBooks = [
    { delay: 0, x: 20, y: 30, rotation: 15 },
    { delay: 0.2, x: -30, y: 50, rotation: -10 },
    { delay: 0.4, x: 40, y: 70, rotation: 20 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-mint/30 via-pastel-blue/20 to-pastel-pink/30 flex items-center justify-center p-4 relative overflow-hidden">
   
      {floatingBooks.map((book, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
            x: [book.x, book.x + 10, book.x],
            y: [book.y, book.y + 20, book.y],
            rotate: [book.rotation, book.rotation + 5, book.rotation],
          }}
          transition={{
            duration: 4,
            delay: book.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
        >
          <BookOpen className="w-16 h-16 text-pastel-blue" />
        </motion.div>
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
       
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-3xl flex items-center justify-center shadow-lg mb-4">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pastel-mint-dark to-pastel-blue-dark bg-clip-text text-transparent">
              Welcome to BookLoop
            </h1>
            <p className="text-neutral-500 mt-2 text-center">
              Share books with your campus community
            </p>
          </motion.div>


          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                IIT Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@iitr.ac.in"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pastel-mint to-pastel-blue text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-pastel-blue-dark font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
