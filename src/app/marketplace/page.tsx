import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MarketplaceClient from './MarketplaceClient'

export default async function MarketplacePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all books except user's own books
  const { data: books } = await supabase
    .from('books')
    .select(`
      *,
      profiles:user_id (
        full_name,
        branch,
        year
      )
    `)
    .neq('user_id', user.id)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-blue/10">
      <Navbar />
      <MarketplaceClient books={books || []} userId={user.id} />
    </div>
  )
}
