'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, User, GraduationCap, Calendar, Hash, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    branch: '',
    year: '',
    instituteId: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)


    if (!formData.email.endsWith('@iitr.ac.in') && !formData.email.endsWith('.iitr.ac.in')) {
      setError('Please use your IIT email address')
      setLoading(false)
      return
    }


    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

 
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            branch: formData.branch,
            year: parseInt(formData.year),
            institute_id: formData.instituteId,
          },
        },
      })

      if (signUpError) throw signUpError

 
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            branch: formData.branch,
            year: parseInt(formData.year),
            institute_id: formData.instituteId,
          })
          .eq('id', data.user.id)

        if (profileError) console.error('Profile update error:', profileError)
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const floatingBooks = [
    { delay: 0, x: 20, y: 30, rotation: 15 },
    { delay: 0.2, x: -30, y: 50, rotation: -10 },
    { delay: 0.4, x: 40, y: 70, rotation: 20 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink/30 via-pastel-lavender/20 to-pastel-yellow/30 flex items-center justify-center p-4 relative overflow-hidden">
 
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
          <BookOpen className="w-16 h-16 text-pastel-lavender" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10 my-8"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
      
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-pink to-pastel-lavender rounded-3xl flex items-center justify-center shadow-lg mb-4">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pastel-pink-dark to-pastel-lavender-dark bg-clip-text text-transparent">
              Join BookLoop
            </h1>
            <p className="text-neutral-500 mt-2 text-center">
              Start sharing books with your campus
            </p>
          </motion.div>

      
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
         
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

            
              <div className="space-y-2">
                <label htmlFor="instituteId" className="text-sm font-medium text-neutral-700">
                  Institute ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="instituteId"
                    name="instituteId"
                    type="text"
                    value={formData.instituteId}
                    onChange={handleChange}
                    placeholder="21115001"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
             
              <div className="space-y-2">
                <label htmlFor="branch" className="text-sm font-medium text-neutral-700">
                  Branch
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="branch"
                    name="branch"
                    type="text"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

          
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium text-neutral-700">
                  Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                IIT Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@iitr.ac.in"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

   
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-pastel-lavender-dark font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
