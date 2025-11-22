'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, GraduationCap, Calendar, Hash, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  email: string
  full_name: string
  branch: string | null
  year: number | null
  institute_id: string | null
  avatar_url: string | null
}

export default function ProfileClient({ profile }: { profile: Profile | null }) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    branch: profile?.branch || '',
    year: profile?.year?.toString() || '',
    instituteId: profile?.institute_id || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          branch: formData.branch || null,
          year: formData.year ? parseInt(formData.year) : null,
          institute_id: formData.instituteId || null,
        })
        .eq('id', profile!.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-neutral-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/dashboard">
          <motion.button
            className="flex items-center gap-2 text-neutral-600 hover:text-foreground mb-4"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pastel-lavender to-pastel-mint rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          Edit Profile
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-pastel-lavender to-pastel-mint rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {profile.full_name.charAt(0).toUpperCase()}
          </motion.div>
          <p className="text-neutral-500 text-sm">Profile Picture</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 mb-6 text-center"
          >
            Profile updated successfully! Redirecting...
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-lavender focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Branch and Year */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-neutral-700 mb-2">
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
                  placeholder="e.g., Computer Science"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-lavender focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-neutral-700 mb-2">
                Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-lavender focus:outline-none transition-colors appearance-none cursor-pointer"
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

          {/* Institute ID */}
          <div>
            <label
              htmlFor="instituteId"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
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
                placeholder="e.g., 21115001"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-lavender focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-pastel-lavender to-pastel-mint text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: loading || success ? 1 : 1.02 }}
            whileTap={{ scale: loading || success ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Profile...
              </>
            ) : success ? (
              'Updated Successfully!'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 mb-3 uppercase">
            Account Information
          </h3>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>
              <span className="font-medium">Account ID:</span> {profile.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
