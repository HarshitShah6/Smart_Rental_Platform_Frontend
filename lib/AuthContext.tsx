'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from './firebase'
import { toast } from 'react-hot-toast'

// Types
export type UserRole = 'TENANT' | 'OWNER' | 'ADMIN'

export interface User {
  id: string
  firebaseId?: string
  email?: string
  name?: string
  role?: UserRole
  createdAt?: string
  listingCount?: number
  gender?: string
  mobile?: string
  phone?: string
  phoneNumber?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, role: UserRole) => Promise<void>
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  signOutUser: () => Promise<void>
  signInWithGoogle: (role: UserRole) => Promise<void>
  setLocalRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ---- Set local role (UI-only helper, no backend involvement) ----
  const setLocalRole = (role: UserRole) => {
    setUser(prev =>
      prev
        ? { ...prev, role } // safe overwrite
        : prev
    )
  }

  // ---- Firebase auth listener ----
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const token = await firebaseUser.getIdToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        // Backend returns the correct role → strictly typed
        setUser({
          id: data.id,
          firebaseId: firebaseUser.uid,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          createdAt: data.createdAt,
          listingCount: data.listingCount,
          gender: data.gender,
          mobile: data.mobile,
          phone: data.phone,
          phoneNumber: data.phoneNumber,
        })
      } catch (err) {
        console.error('Auth fetch failed:', err)
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ---- SIGN IN ----
  const signIn = async (email: string, password: string, role: UserRole) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Signed in successfully!')
    } finally {
      setLoading(false)
    }
  }

  // ---- SIGN UP ----
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Account created!')
    } finally {
      setLoading(false)
    }
  }

  // ---- GOOGLE SIGN-IN ----
  const signInWithGoogle = async (role: UserRole) => {
    setLoading(true)
    try {
      toast.success('Signed in with Google!')
      // You can add your own logic here
    } finally {
      setLoading(false)
    }
  }

  // ---- SIGN OUT ----
  const signOutUser = async () => {
    await auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOutUser, signInWithGoogle, setLocalRole }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}









// // Authentication context and provider
// 'use client'

// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// import { auth } from '@/lib/firebase'
// import { User, UserRole } from '@/types'
// import { apiClient } from '@/lib/api'
// import { useRouter } from 'next/router'
// import toast from 'react-hot-toast'

// interface AuthContextType {
//   user: User | null
//   firebaseUser: FirebaseUser | null
//   token: string | null
//   loading: boolean
//   signIn: (email: string, password: string, role?: UserRole) => Promise<void>
//   signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>
//   signInWithGoogle: (role?: UserRole) => Promise<void>
//   // optional role override stored locally until backend confirms
//   setLocalRole: (role: UserRole | null) => void
//   signOut: () => Promise<void>
//   updateProfile: (data: Partial<User>) => Promise<User | null>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider')
//   }
//   return context
// }

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)

//   const isUserRole = (value: any): value is UserRole => value === 'TENANT' || value === 'OWNER' || value === 'ADMIN'

//   // Exchange Firebase token for backend JWT and user data
//   const exchangeToken = async (fbUser: FirebaseUser) => {
//     try {
//       const idToken = await fbUser.getIdToken()
//       const response = await apiClient.post('/auth/session', {}, {
//         headers: { Authorization: `Bearer ${idToken}` }
//       })
      
//       const { token: backendToken, user: userData } = response.data
//       setToken(backendToken)
//       setUser(userData)
      
//       // Store token in localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('authToken', backendToken)
//         try {
//           // Persist user's role as the preferred role so UI keeps showing it
//           if (userData && userData.role) localStorage.setItem('preferredRole', userData.role)
//         } catch (e) {
//           // ignore
//         }
//       }
//     } catch (error: any) {
//       console.error('Error exchanging token:', error)
//       toast.error('Authentication failed')
//       throw error
//     }
//   }

//   // Listen to Firebase auth state changes
//   useEffect(() => {
//     if (!auth) {
//       setLoading(false)
//       return
//     }

//     const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
//       setFirebaseUser(fbUser)
      
//       if (fbUser) {
//         try {
//           await exchangeToken(fbUser)
//         } catch (error) {
//           // Handle error silently, already shown toast
//         }
//       } else {
//         setUser(null)
//         setToken(null)
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('authToken')
//         }
//       }
      
//       setLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   const signIn = async (email: string, password: string, role?: UserRole) => {
//     try {
//       setLoading(true)
//       const userCredential = await signInWithEmailAndPassword(auth, email, password)
//       await exchangeToken(userCredential.user)
//       // Apply a local role override for immediate UX if provided
//       if (role && isUserRole(role)) {
//         setUser((u) => (u ? { ...u, role } : u))
//       }
//       toast.success('Signed in successfully!')
//     } catch (error: any) {
//       toast.error(error.message || 'Sign in failed')
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const signUp = async (email: string, password: string, name: string, role?: UserRole) => {
//     try {
//       setLoading(true)
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//       await exchangeToken(userCredential.user)
//       // Best-effort: persist selected role to backend if available
//       try {
//         const backendToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
//         if (backendToken && role && isUserRole(role)) {
//           await apiClient.post('/auth/set-role', { role }, { headers: { Authorization: `Bearer ${backendToken}` } })
//         }
//       } catch (err) {
//         // ignore errors setting role on backend
//         console.warn('Failed to persist role to backend (optional):', err)
//       }
//       // Apply local role immediately so UI reflects choice (until backend confirms)
//       if (role && isUserRole(role)) {
//         setUser((u) => (u ? { ...u, role } : u))
//       }
//       toast.success('Account created successfully!')
//     } catch (error: any) {
//       toast.error(error.message || 'Sign up failed')
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const signInWithGoogle = async (role?: UserRole) => {
//     try {
//       setLoading(true)
//       const provider = new GoogleAuthProvider()
//       const userCredential = await signInWithPopup(auth, provider)
//       await exchangeToken(userCredential.user)
//       if (role && isUserRole(role)) {
//         setUser((u) => (u ? { ...u, role } : u))
//       }
//       toast.success('Signed in with Google!')
//     } catch (error: any) {
//       toast.error(error.message || 'Google sign in failed')
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const signOut = async () => {
//     try {
//       await firebaseSignOut(auth)
//       setUser(null)
//       setToken(null)
//       setFirebaseUser(null)
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('authToken')
//       }
//       toast.success('Signed out successfully')
//     } catch (error: any) {
//       toast.error('Sign out failed')
//       throw error
//     }
//   }

//   const updateProfile = async (data: Partial<User>) => {
//     // Best-effort: persist to backend if endpoint exists and update local state
//     try {
//       // try common endpoints - backend may expose either /users/me or /users/:id
//       let res = null
//       try {
//         res = await apiClient.put('/users/me', data)
//       } catch (e) {
//         // try fallback
//         if (user?.id) {
//           try {
//             res = await apiClient.put(`/users/${user.id}`, data)
//           } catch (e2) {
//             // ignore
//           }
//         }
//       }

//       // If backend returned updated user, use it; otherwise merge locally
//       if (res && res.data && (res.data.user || res.data)) {
//         const updatedUser = res.data.user || res.data
//         setUser(updatedUser)
//         return updatedUser
//       }

//       // Fallback: merge into local user state
//       setUser((u) => (u ? { ...u, ...data } as User : u))
//       return null
//     } catch (err) {
//       console.warn('Failed to update profile (best-effort):', err)
//       throw err
//     }
//   }

//   const setLocalRole = (role: UserRole | null) => {
//     setUser((u) => {
//       if (!u) return u
//       try {
//         if (typeof window !== 'undefined') {
//           if (role && isUserRole(role)) localStorage.setItem('preferredRole', role)
//         }
//       } catch (e) {}
//       return { ...u, role: role ?? u.role }
//     })
//   }

//   const value = {
//     user,
//     firebaseUser,
//     token,
//     loading,
//     signIn,
//     signUp,
//     signInWithGoogle,
//     setLocalRole,
//     signOut,
//     updateProfile,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }
