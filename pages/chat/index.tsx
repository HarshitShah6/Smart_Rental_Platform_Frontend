"use client"
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { chatAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ConversationsPage() {
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<any[] | null>(null)
  const [loadingMsgs, setLoadingMsgs] = useState(false)

  useEffect(() => {
    if (!loading && !user) return
    const fetch = async () => {
      setLoadingMsgs(true)
      try {
        const res = await chatAPI.getConversations(user!.id)
        // backend returns flat list of messages; group by other participant
        setMessages(res.data || res.data?.data || [])
      } catch (err) {
        console.error('Failed to load messages', err)
        toast.error('Failed to load messages')
        setMessages([])
      } finally {
        setLoadingMsgs(false)
      }
    }
    if (user) fetch()
  }, [user, loading])

  if (loading || !user) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>

  // group messages by conversation partner id
  const convMap: Record<string, any[]> = {}
  ;(messages || []).forEach((m: any) => {
    const other = (m.senderId === user!.id) ? m.receiverId : m.senderId
    if (!convMap[other]) convMap[other] = []
    convMap[other].push(m)
  })

  const conversations = Object.keys(convMap).map((otherId) => {
    const msgs = convMap[otherId]
    const last = msgs.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    // determine display name from relations if available
    const sample = last
    let displayName = otherId
    if (sample.sender && sample.receiver) {
      const otherObj = sample.senderId === user!.id ? sample.receiver : sample.sender
      displayName = otherObj?.name || otherObj?.email || otherId
    }
    return { otherId, last, count: msgs.length, displayName }
  }).sort((a,b) => new Date(b.last.createdAt).getTime() - new Date(a.last.createdAt).getTime())

  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {loadingMsgs ? (
            <div className="py-8"><LoadingSpinner size="lg" /></div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center text-gray-600">No conversations yet.</div>
          ) : (
            <div className="divide-y">
              {conversations.map((c: any) => (
                <Link key={c.otherId} href={`/chat/${c.otherId}`} className="block py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{(c.displayName || c.otherId || '').charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-semibold">{c.displayName}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xl">{c.last.content}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{new Date(c.last.createdAt).toLocaleString()}</div>
                      <div className="text-xs">{c.count} messages</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
