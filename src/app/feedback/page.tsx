import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FeedbackClient from './FeedbackClient'

export default async function FeedbackPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all reviews with book and user info
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      book:book_id (
        id,
        title,
        author,
        image_url
      ),
      profile:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch user stats for leaderboard
  const { data: userStats } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      branch,
      year
    `)
    .limit(10)

  // Get book counts for each user
  const { data: bookCounts } = await supabase
    .from('books')
    .select('user_id')

  // Calculate stats
  const stats = userStats?.map((user) => {
    const userBookCount = bookCounts?.filter((book) => book.user_id === user.id).length || 0
    return {
      ...user,
      bookCount: userBookCount,
    }
  }).sort((a, b) => b.bookCount - a.bookCount) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-peach/10 via-pastel-pink/10 to-pastel-lavender/10">
      <Navbar />
      <FeedbackClient userId={user.id} reviews={reviews || []} leaderboard={stats} />
    </div>
  )
}
