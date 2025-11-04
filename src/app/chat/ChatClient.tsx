'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Check, X, BookOpen, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Request = {
  id: string
  book_id: string
  requester_id: string
  owner_id: string
  request_type: string
  status: string
  book: {
    id: string
    title: string
    image_url: string | null
  }
  requester: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  owner?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

type Message = {
  id: string
  message: string
  sender_id: string
  created_at: string
}

type ChatClientProps = {
  userId: string
  acceptedRequests: Request[]
  pendingRequests: Request[]
}

export default function ChatClient({
  userId,
  acceptedRequests,
  pendingRequests,
}: ChatClientProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (selectedRequest) {
      loadMessages()

  
      const channel = supabase
        .channel(`chat-${selectedRequest.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `request_id=eq.${selectedRequest.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedRequest])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!selectedRequest) return

    setLoading(true)
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('request_id', selectedRequest.id)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRequest) return

    setSendingMessage(true)
    const otherUserId =
      selectedRequest.requester_id === userId
        ? selectedRequest.owner_id
        : selectedRequest.requester_id

    try {
      const { error } = await supabase.from('chat_messages').insert({
        request_id: selectedRequest.id,
        sender_id: userId,
        receiver_id: otherUserId,
        message: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage('')
    } catch (err: any) {
      alert(err.message || 'Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('book_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to accept request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('book_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to reject request')
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
       
        <div className="md:col-span-1 bg-white rounded-3xl shadow-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Chats & Requests
          </h2>

        
          {pendingRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-500 mb-3 uppercase">
                Pending Requests
              </h3>
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-pastel-yellow/20 rounded-2xl p-4 border-2 border-pastel-yellow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white font-bold">
                        {request.requester.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {request.requester.full_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          wants to {request.request_type}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 mb-3 font-medium">
                      Book: {request.book.title}
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 px-3 py-2 rounded-xl bg-pastel-mint text-white font-medium text-sm flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </motion.button>
                      <motion.button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 px-3 py-2 rounded-xl bg-red-100 text-red-600 font-medium text-sm flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          
          {acceptedRequests.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 mb-3 uppercase">
                Active Chats
              </h3>
              <div className="space-y-2">
                {acceptedRequests.map((request) => {
                  const otherUser =
                    request.requester_id === userId ? request.owner : request.requester
                  const isSelected = selectedRequest?.id === request.id

                  return (
                    <motion.div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 rounded-2xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white'
                          : 'bg-neutral-50 hover:bg-neutral-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-white text-pastel-blue'
                              : 'bg-gradient-to-br from-pastel-mint to-pastel-blue text-white'
                          }`}
                        >
                          {otherUser?.full_name.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-foreground'}`}>
                            {otherUser?.full_name}
                          </p>
                          <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                            {request.book.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No chats yet</p>
              <p className="text-neutral-400 text-sm mt-1">
                Send a request from the marketplace to start chatting
              </p>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden">
          {selectedRequest ? (
            <>
          
              <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-pastel-mint/10 to-pastel-blue/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pastel-yellow to-pastel-peach rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {selectedRequest.book.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Chatting about {selectedRequest.request_type}
                    </p>
                  </div>
                </div>
              </div>

         
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-pastel-blue animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-neutral-400">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isMine = message.sender_id === userId
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                              isMine
                                ? 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-white rounded-br-sm'
                                : 'bg-neutral-100 text-foreground rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMine ? 'text-white/70' : 'text-neutral-500'
                              }`}
                            >
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

          
              <form
                onSubmit={handleSendMessage}
                className="p-6 border-t border-neutral-200 bg-neutral-50"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-neutral-200 focus:border-pastel-blue focus:outline-none transition-colors"
                    disabled={sendingMessage}
                  />
                  <motion.button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pastel-mint to-pastel-blue text-white font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: sendingMessage ? 1 : 1.05 }}
                    whileTap={{ scale: sendingMessage ? 1 : 0.95 }}
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
