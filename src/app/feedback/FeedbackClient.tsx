'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Star, Trophy, Medal, Award, BookOpen, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Review = {
  id: string
  rating: number | null
  comment: string | null
  likes_count: number
  created_at: string
  user_id: string
  book: {
    id: string
    title: string
    author: string
    image_url: string | null
  }
  profile: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

type LeaderboardUser = {
  id: string
  full_name: string
  branch: string | null
  year: number | null
  bookCount: number
}

type BookOption = {
  id: string
  title: string
  author: string
  image_url: string | null
}

type FeedbackClientProps = {
  userId: string
  reviews: Review[]
  leaderboard: LeaderboardUser[]
  allBooks: BookOption[]
}

export default function FeedbackClient({ userId, reviews, leaderboard, allBooks }: FeedbackClientProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'leaderboard'>('reviews')
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set())
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLike = async (reviewId: string) => {
    if (likedReviews.has(reviewId)) return

    try {
      const { error } = await supabase.from('review_likes').insert({
        review_id: reviewId,
        user_id: userId,
      })

      if (error) throw error

      setLikedReviews((prev) => new Set(prev).add(reviewId))
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to like review')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBookId || rating === 0) {
      alert('Please select a book and rating')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        book_id: selectedBookId,
        user_id: userId,
        rating,
        comment: comment.trim() || null,
        likes_count: 0,
      })

      if (error) throw error

      alert('Review submitted successfully!')
      setShowReviewModal(false)
      setSelectedBookId('')
      setRating(0)
      setComment('')
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />
    if (index === 2) return <Award className="w-6 h-6 text-orange-600" />
    return null
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Hub</h1>
          <p className="text-neutral-600">Explore reviews and top contributors</p>
        </div>
        <motion.button
          onClick={() => setShowReviewModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-semibold shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Write Review
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <motion.button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white shadow-lg'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-md'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reviews & Feedback
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 rounded-2xl font-semibold transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-pastel-yellow to-pastel-peach text-white shadow-lg'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-md'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Leaderboard
        </motion.button>
      </div>

      {/* Content */}
      {activeTab === 'reviews' ? (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">No reviews yet</p>
              <p className="text-neutral-400 text-sm mt-2">
                Be the first to share your thoughts about a book
              </p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 rounded-2xl flex items-center justify-center overflow-hidden">
                      {review.book.image_url ? (
                        <img
                          src={review.book.image_url}
                          alt={review.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-neutral-300" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white font-bold">
                        {review.profile.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.profile.full_name}
                        </p>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-foreground">{review.book.title}</h3>
                      <p className="text-sm text-neutral-600">by {review.book.author}</p>
                    </div>

                    {/* Rating */}
                    {review.rating && (
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating!
                                ? 'fill-pastel-yellow text-pastel-yellow'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-neutral-700 mb-4 leading-relaxed">{review.comment}</p>
                    )}

                    {/* Like Button */}
                    <motion.button
                      onClick={() => handleLike(review.id)}
                      disabled={likedReviews.has(review.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-colors ${
                        likedReviews.has(review.id)
                          ? 'bg-pastel-pink text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-pastel-pink/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedReviews.has(review.id) ? 'fill-current' : ''
                        }`}
                      />
                      <span>{review.likes_count || 0}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pastel-yellow to-pastel-peach rounded-2xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Top Contributors</h2>
              <p className="text-neutral-600">Most active book sharers</p>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">No data available yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl flex items-center gap-4 ${
                    index < 3
                      ? 'bg-gradient-to-r from-pastel-yellow/20 to-pastel-peach/20 border-2 border-pastel-yellow'
                      : 'bg-neutral-50'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    {index < 3 ? (
                      getMedalIcon(index)
                    ) : (
                      <span className="text-2xl font-bold text-neutral-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{user.full_name}</p>
                    {user.branch && user.year && (
                      <p className="text-sm text-neutral-600">
                        {user.branch}, Year {user.year}
                      </p>
                    )}
                  </div>

                  {/* Book Count */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pastel-peach-dark">
                      {user.bookCount}
                    </p>
                    <p className="text-xs text-neutral-500">books shared</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Write a Review</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Book *
                  </label>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors"
                  >
                    <option value="">Choose a book...</option>
                    {allBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating
                              ? 'fill-pastel-yellow text-pastel-yellow'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-pink focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-6 py-3 rounded-2xl border-2 border-neutral-200 text-neutral-600 font-semibold hover:bg-neutral-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={submitting || !selectedBookId || rating === 0}
                    className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
