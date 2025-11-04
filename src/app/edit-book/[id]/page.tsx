import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditBookClient from './EditBookClient'

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch the book
  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!book) {
    redirect('/dashboard')
  }

  return <EditBookClient book={book} />
}
