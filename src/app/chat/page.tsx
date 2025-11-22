import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ChatClient from './ChatClient'

export default async function ChatPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch accepted requests where user is involved
  const { data: acceptedRequests } = await supabase
    .from('book_requests')
    .select(`
      *,
      book:book_id (
        id,
        title,
        image_url
      ),
      requester:requester_id (
        id,
        full_name,
        avatar_url
      ),
      owner:owner_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  // Fetch pending requests where user is the owner
  const { data: pendingRequests } = await supabase
    .from('book_requests')
    .select(`
      *,
      book:book_id (
        id,
        title,
        image_url
      ),
      requester:requester_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('owner_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Fetch completed requests where user is involved
  const { data: completedRequests } = await supabase
    .from('book_requests')
    .select(`
      *,
      book:book_id (
        id,
        title,
        image_url
      ),
      requester:requester_id (
        id,
        full_name,
        avatar_url
      ),
      owner:owner_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'completed')
    .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/10 via-pastel-mint/10 to-pastel-lavender/10">
      <Navbar />
      <ChatClient
        userId={user.id}
        acceptedRequests={acceptedRequests || []}
        pendingRequests={pendingRequests || []}
        completedRequests={completedRequests || []}
      />
    </div>
  )
}
