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
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>
  signInWithGoogle: (role?: string) => Promise<void>
  // optional role override stored locally until backend confirms
  setLocalRole: (role: string | null) => void
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<User | null>
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
        try {
          // Persist user's role as the preferred role so UI keeps showing it
          if (userData && userData.role) localStorage.setItem('preferredRole', userData.role)
        } catch (e) {
          // ignore
        }
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

  const signIn = async (email: string, password: string, role?: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await exchangeToken(userCredential.user)
      // Apply a local role override for immediate UX if provided
      if (role) {
        setUser((u) => (u ? { ...u, role } : u))
      }
      toast.success('Signed in successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, role?: string) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await exchangeToken(userCredential.user)
      // Best-effort: persist selected role to backend if available
      try {
        const backendToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        if (backendToken && role) {
          await apiClient.post('/auth/set-role', { role }, { headers: { Authorization: `Bearer ${backendToken}` } })
        }
      } catch (err) {
        // ignore errors setting role on backend
        console.warn('Failed to persist role to backend (optional):', err)
      }
      // Apply local role immediately so UI reflects choice (until backend confirms)
      if (role) {
        setUser((u) => (u ? { ...u, role } : u))
      }
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (role?: string) => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      await exchangeToken(userCredential.user)
      if (role) {
        setUser((u) => (u ? { ...u, role } : u))
      }
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

  const updateProfile = async (data: Partial<User>) => {
    // Best-effort: persist to backend if endpoint exists and update local state
    try {
      // try common endpoints - backend may expose either /users/me or /users/:id
      let res = null
      try {
        res = await apiClient.put('/users/me', data)
      } catch (e) {
        // try fallback
        if (user?.id) {
          try {
            res = await apiClient.put(`/users/${user.id}`, data)
          } catch (e2) {
            // ignore
          }
        }
      }

      // If backend returned updated user, use it; otherwise merge locally
      if (res && res.data && (res.data.user || res.data)) {
        const updatedUser = res.data.user || res.data
        setUser(updatedUser)
        return updatedUser
      }

      // Fallback: merge into local user state
      setUser((u) => (u ? { ...u, ...data } as User : u))
      return null
    } catch (err) {
      console.warn('Failed to update profile (best-effort):', err)
      throw err
    }
  }

  const setLocalRole = (role: string | null) => {
    setUser((u) => {
      if (!u) return u
      try {
        if (typeof window !== 'undefined') {
          if (role === 'OWNER' || role === 'TENANT') localStorage.setItem('preferredRole', role)
        }
      } catch (e) {}
      return { ...u, role: role ?? u.role }
    })
  }

  const value = {
    user,
    firebaseUser,
    token,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    setLocalRole,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
