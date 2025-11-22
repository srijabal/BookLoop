'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Filter, Send, RefreshCw, ShoppingCart, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  user_id: string
  profiles: {
    full_name: string
    branch: string | null
    year: number | null
  }
}

type MarketplaceClientProps = {
  books: Book[]
  userId: string
}

export default function MarketplaceClient({ books, userId }: MarketplaceClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedType, setSelectedType] = useState<'all' | 'rent' | 'exchange' | 'sale'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [requestingBook, setRequestingBook] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Get unique genres
  const genres = ['all', ...Array.from(new Set(books.map((book) => book.genre)))]

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre

    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'rent' && book.available_for_rent) ||
      (selectedType === 'exchange' && book.available_for_exchange) ||
      (selectedType === 'sale' && book.available_for_sale)

    return matchesSearch && matchesGenre && matchesType
  })

  const handleRequest = async (book: Book, requestType: 'rent' | 'exchange' | 'buy') => {
    setRequestingBook(book.id)

    try {
      const { error } = await supabase.from('book_requests').insert({
        book_id: book.id,
        requester_id: userId,
        owner_id: book.user_id,
        request_type: requestType,
        status: 'pending',
      })

      if (error) throw error

      alert('Request sent successfully! You can chat with the owner once they accept.')
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to send request')
    } finally {
      setRequestingBook(null)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
        <p className="text-neutral-600">Discover books from your campus community</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-lg p-6 mb-8"
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-neutral-600 hover:text-foreground mb-4"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">{showFilters ? 'Hide' : 'Show'} Filters</span>
        </button>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Availability Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'rent', 'exchange', 'sale'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-2xl font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white shadow-md'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-lavender focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mt-4 text-sm text-neutral-600">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </motion.div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">No books found</p>
          <p className="text-neutral-400 text-sm mt-2">Try adjusting your filters or search query</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
            >
              {/* Book Image */}
              <div className="w-full h-56 bg-gradient-to-br from-pastel-lavender/20 to-pastel-pink/20 flex items-center justify-center">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-20 h-20 text-neutral-300" />
                )}
              </div>

              <div className="p-6">
                {/* Book Info */}
                <h4 className="font-bold text-lg text-foreground mb-1 truncate">{book.title}</h4>
                <p className="text-neutral-600 text-sm mb-2">by {book.author}</p>
                <p className="text-neutral-500 text-xs bg-neutral-100 rounded-full px-3 py-1 inline-block mb-3">
                  {book.genre}
                </p>

                {/* Description */}
                {book.description && (
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{book.description}</p>
                )}

                {/* Owner Info */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-neutral-50 rounded-2xl">
                  <User className="w-4 h-4 text-neutral-400" />
                  <div className="text-sm">
                    <p className="font-medium text-neutral-700">{book.profiles.full_name}</p>
                    {book.profiles.branch && book.profiles.year && (
                      <p className="text-xs text-neutral-500">
                        {book.profiles.branch}, Year {book.profiles.year}
                      </p>
                    )}
                  </div>
                </div>

                {/* Request Buttons */}
                <div className="space-y-2">
                  {book.available_for_rent && (
                    <motion.button
                      onClick={() => handleRequest(book, 'rent')}
                      disabled={requestingBook === book.id}
                      className="w-full px-4 py-2 rounded-2xl bg-pastel-mint hover:bg-pastel-mint-dark text-white font-medium shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Request to Rent
                    </motion.button>
                  )}
                  {book.available_for_exchange && (
                    <motion.button
                      onClick={() => handleRequest(book, 'exchange')}
                      disabled={requestingBook === book.id}
                      className="w-full px-4 py-2 rounded-2xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-white font-medium shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Request to Exchange
                    </motion.button>
                  )}
                  {book.available_for_sale && (
                    <motion.button
                      onClick={() => handleRequest(book, 'buy')}
                      disabled={requestingBook === book.id}
                      className="w-full px-4 py-2 rounded-2xl bg-pastel-pink hover:bg-pastel-pink-dark text-white font-medium shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy for ₹{book.price}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
