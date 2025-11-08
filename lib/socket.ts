// Socket.io client setup for real-time chat
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000'

let socket: Socket | null = null

export const useSocket = (userId?: string) => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    // Initialize socket connection
    if (!socket) {
      socket = io(WS_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })

      socket.on('connect', () => {
        console.log('Socket connected')
        setConnected(true)
        socket?.emit('join', { userId })
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        setConnected(false)
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        setConnected(false)
      })
    }

    return () => {
      // Don't disconnect immediately, just clean up listeners
      socket?.off('connect')
      socket?.off('disconnect')
      socket?.off('connect_error')
    }
  }, [userId])

  const sendMessage = (message: { senderId: string; receiverId: string; content: string }) => {
    if (socket && connected) {
      socket.emit('message', message)
    }
  }

  const onMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('message', callback)
      return () => socket?.off('message', callback)
    }
  }

  return {
    socket,
    connected,
    sendMessage,
    onMessage,
  }
}

export default socket
