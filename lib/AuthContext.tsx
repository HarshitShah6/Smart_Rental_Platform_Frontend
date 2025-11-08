// Authentication context and provider
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Exchange Firebase token for backend JWT and user data
  const exchangeToken = async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken()
      const response = await apiClient.post('/auth/session', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      
      const { token: backendToken, user: userData } = response.data
      setToken(backendToken)
      setUser(userData)
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', backendToken)
      }
    } catch (error: any) {
      console.error('Error exchanging token:', error)
      toast.error('Authentication failed')
      throw error
    }
  }

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      
      if (fbUser) {
        try {
          await exchangeToken(fbUser)
        } catch (error) {
          // Handle error silently, already shown toast
        }
      } else {
        setUser(null)
        setToken(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await exchangeToken(userCredential.user)
      toast.success('Signed in successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await exchangeToken(userCredential.user)
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      await exchangeToken(userCredential.user)
      toast.success('Signed in with Google!')
    } catch (error: any) {
      toast.error(error.message || 'Google sign in failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setToken(null)
      setFirebaseUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
      }
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error('Sign out failed')
      throw error
    }
  }

  const value = {
    user,
    firebaseUser,
    token,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
