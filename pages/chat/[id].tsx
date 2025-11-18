"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { chatAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'
import { useRef } from 'react'

export default function ConversationPage() {
  const router = useRouter()
  const { id } = router.query // other participant id
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<any[] | null>(null)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [text, setText] = useState('')
  const socketRef = useRef<Socket | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!loading && !user) return
    if (!id) return
    const fetch = async () => {
      setLoadingMsgs(true)
      try {
        const res = await chatAPI.getConversations(user!.id)
        const all = res.data || res.data?.data || []
        const conv = all.filter((m: any) => m.senderId === String(id) || m.receiverId === String(id))
        setMessages(conv.sort((a: any,b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
      } catch (err) {
        console.error('Failed to load messages', err)
        toast.error('Failed to load messages')
        setMessages([])
      } finally {
        setLoadingMsgs(false)
      }
    }
    if (user) fetch()
  }, [user, loading, id])

  // socket.io: connect and join user room, listen for incoming messages
  useEffect(() => {
    if (!user) return
    // create socket
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:4000')
    socketRef.current = socket
    socket.on('connect', () => {
      socket.emit('join', { userId: user.id })
    })
    socket.on('message', (m: any) => {
      // only handle messages for this conversation partner
      if (!id) return
      const otherId = String(id)
      if (m.senderId === otherId || m.receiverId === otherId) {
        setMessages((prev) => prev ? [...prev, m] : [m])
      }
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user, id])

  if (loading || !user) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>

  const sendMessage = async () => {
    if (!text || text.trim().length === 0) return
    try {
      const payload = { senderId: user!.id, receiverId: String(id), content: text }
      // Try POSTing to server which will persist and emit over socket
      const res = await chatAPI.sendMessage(payload)
      const msg = res.data?.message || res.data
      // If server returned the saved message (with relations), use that; otherwise append payload
      setMessages((prev) => prev ? [...prev, (msg || { ...payload, createdAt: new Date().toISOString() })] : [(msg || { ...payload, createdAt: new Date().toISOString() })])
      // also emit locally via socket for immediate delivery to other connected clients
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('message', { senderId: user!.id, receiverId: String(id), content: text })
      }
      setText('')
    } catch (err) {
      console.error('Failed to send message', err)
      toast.error('Failed to send message (server may not have endpoint)')
    }
  }

  // scroll to bottom when messages change
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Chat with {id}</h2>
          {loadingMsgs ? (
            <div className="py-8"><LoadingSpinner size="lg" /></div>
          ) : (
            <div ref={scrollRef} className="space-y-3 max-h-[60vh] overflow-y-auto mb-4 flex flex-col">
              {messages && messages.length > 0 ? messages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded max-w-xl ${m.senderId === user!.id ? 'bg-primary-50 self-end ml-auto text-right' : 'bg-gray-100 self-start'} flex items-start space-x-3` }>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">{(m.sender?.name || m.sender?.email || m.senderId || '').charAt(0).toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-800">{m.content}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-600">No messages in this conversation.</div>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Write a message..." />
            <button onClick={sendMessage} className="px-4 py-2 bg-primary-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </>
  )
}
