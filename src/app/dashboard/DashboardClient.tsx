'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Edit, Trash2, DollarSign, RefreshCw, ShoppingCart } from 'lucide-react'
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
  created_at: string
}

type DashboardClientProps = {
  profile: Profile | null
  books: Book[]
}

export default function DashboardClient({ profile, books }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'exchange' | 'sale'>('all')
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)

    if (!error) {
      router.refresh()
    }
  }

  const filteredBooks = books.filter((book) => {
    if (activeTab === 'all') return true
    if (activeTab === 'rent') return book.available_for_rent
    if (activeTab === 'exchange') return book.available_for_exchange
    if (activeTab === 'sale') return book.available_for_sale
    return false
  })

  const tabs = [
    { id: 'all' as const, label: 'All Books', color: 'pastel-blue' },
    { id: 'rent' as const, label: 'For Rent', color: 'pastel-mint' },
    { id: 'exchange' as const, label: 'For Exchange', color: 'pastel-lavender' },
    { id: 'sale' as const, label: 'For Sale', color: 'pastel-pink' },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{profile?.full_name}</h2>
              <p className="text-neutral-500">{profile?.email}</p>
              <div className="flex gap-4 mt-2 text-sm text-neutral-600">
                {profile?.branch && <span className="flex items-center gap-1">Branch: {profile.branch}</span>}
                {profile?.year && <span>Year: {profile.year}</span>}
                {profile?.institute_id && <span>ID: {profile.institute_id}</span>}
              </div>
            </div>
          </div>
          <Link href="/profile">
            <motion.button
              className="px-4 py-2 rounded-2xl bg-pastel-blue hover:bg-pastel-blue-dark text-white font-medium shadow-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Books Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">My Books</h3>
          <Link href="/add-book">
            <motion.button
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pastel-mint to-pastel-blue text-white font-semibold shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Book
            </motion.button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-2xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No books found</p>
            <p className="text-neutral-400 text-sm mt-2">
              {activeTab === 'all' ? 'Start by adding your first book!' : `No books available for ${activeTab}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-shadow border border-neutral-200"
              >
                {/* Book Image */}
                <div className="w-full h-48 bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-neutral-300" />
                  )}
                </div>

                {/* Book Info */}
                <h4 className="font-bold text-lg text-foreground mb-1 truncate">{book.title}</h4>
                <p className="text-neutral-600 text-sm mb-2">by {book.author}</p>
                <p className="text-neutral-500 text-xs bg-neutral-100 rounded-full px-3 py-1 inline-block mb-3">
                  {book.genre}
                </p>

                {/* Availability Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.available_for_rent && (
                    <span className="text-xs bg-pastel-mint text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Rent
                    </span>
                  )}
                  {book.available_for_exchange && (
                    <span className="text-xs bg-pastel-lavender text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Exchange
                    </span>
                  )}
                  {book.available_for_sale && (
                    <span className="text-xs bg-pastel-pink text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      ₹{book.price}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      book.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/edit-book/${book.id}`} className="flex-1">
                    <motion.button
                      className="w-full px-4 py-2 rounded-2xl bg-pastel-blue hover:bg-pastel-blue-dark text-white font-medium shadow-md transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => handleDeleteBook(book.id)}
                    className="px-4 py-2 rounded-2xl bg-red-100 hover:bg-red-200 text-red-600 font-medium shadow-md transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
