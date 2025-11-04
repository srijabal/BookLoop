// Database types for BookLoop

export type Profile = {
  id: string
  email: string
  full_name: string
  branch: string | null
  year: number | null
  institute_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Book = {
  id: string
  user_id: string
  title: string
  author: string
  genre: string
  description: string | null
  image_url: string | null
  available_for_rent: boolean
  available_for_exchange: boolean
  available_for_sale: boolean
  price: number | null
  status: 'available' | 'requested' | 'rented' | 'exchanged' | 'sold'
  created_at: string
  updated_at: string
}

export type BookRequest = {
  id: string
  book_id: string
  requester_id: string
  owner_id: string
  request_type: 'rent' | 'exchange' | 'buy'
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  message: string | null
  created_at: string
  updated_at: string
}

export type ChatMessage = {
  id: string
  request_id: string
  sender_id: string
  receiver_id: string
  message: string
  is_read: boolean
  created_at: string
}

export type Review = {
  id: string
  book_id: string
  user_id: string
  rating: number | null
  comment: string | null
  likes_count: number
  created_at: string
  updated_at: string
}

export type ReviewLike = {
  id: string
  review_id: string
  user_id: string
  created_at: string
}

export type ReviewReply = {
  id: string
  review_id: string
  user_id: string
  reply: string
  created_at: string
}
