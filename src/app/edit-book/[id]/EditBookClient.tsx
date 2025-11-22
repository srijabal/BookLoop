'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Upload, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

type Book = {
  id: string
  title: string
  author: string
  genre: string
  description: string | null
  image_url: string | null
  available_for_rent: boolean
  available_for_exchange: boolean
  available_for_sale: boolean
  price: number | null
  status: string
}

export default function EditBookClient({ book }: { book: Book }) {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    description: book.description || '',
    availableForRent: book.available_for_rent,
    availableForExchange: book.available_for_exchange,
    availableForSale: book.available_for_sale,
    price: book.price?.toString() || '',
    imageUrl: book.image_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.availableForRent && !formData.availableForExchange && !formData.availableForSale) {
      setError('Please select at least one availability option')
      setLoading(false)
      return
    }

    if (formData.availableForSale && (!formData.price || parseFloat(formData.price) <= 0)) {
      setError('Please enter a valid price for sale')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('books')
        .update({
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          description: formData.description || null,
          image_url: formData.imageUrl || null,
          available_for_rent: formData.availableForRent,
          available_for_exchange: formData.availableForExchange,
          available_for_sale: formData.availableForSale,
          price: formData.availableForSale ? parseFloat(formData.price) : null,
        })
        .eq('id', book.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update book')
    } finally {
      setLoading(false)
    }
  }

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Engineering',
    'Mathematics',
    'Computer Science',
    'History',
    'Biography',
    'Self-Help',
    'Business',
    'Other',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 via-pastel-lavender/20 to-pastel-mint/20">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="w-12 h-12 bg-gradient-to-br from-pastel-blue to-pastel-lavender rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            Edit Book
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 mb-6 text-center"
            >
              Book updated successfully! Redirecting...
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Book Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-neutral-700 mb-2">
                  Author *
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-neutral-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors appearance-none cursor-pointer"
                  required
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                Image URL (Optional)
              </label>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Availability Options *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-neutral-200 hover:border-pastel-mint cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="availableForRent"
                    checked={formData.availableForRent}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg accent-pastel-mint cursor-pointer"
                  />
                  <span className="font-medium text-neutral-700">Available for Rent</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-neutral-200 hover:border-pastel-lavender cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="availableForExchange"
                    checked={formData.availableForExchange}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg accent-pastel-lavender cursor-pointer"
                  />
                  <span className="font-medium text-neutral-700">Available for Exchange</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-neutral-200 hover:border-pastel-pink cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="availableForSale"
                    checked={formData.availableForSale}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg accent-pastel-pink cursor-pointer"
                  />
                  <span className="font-medium text-neutral-700">Available for Sale</span>
                </label>
              </div>
            </div>

            {formData.availableForSale && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-2">
                  Sale Price (₹) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                  required
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-pastel-blue to-pastel-lavender text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading || success ? 1 : 1.02 }}
              whileTap={{ scale: loading || success ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Book...
                </>
              ) : success ? (
                'Updated Successfully!'
              ) : (
                'Update Book'
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
