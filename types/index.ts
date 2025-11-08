// Type definitions for Smart Rental Platform

export type UserRole = 'TENANT' | 'OWNER' | 'ADMIN'

export interface User {
  id: string
  firebaseId: string
  email: string
  name?: string
  role: UserRole
  createdAt: string
}

export interface Property {
  id: string
  ownerId: string
  title: string
  description: string
  price: number
  predictedRent?: number
  fraudScore?: number
  address: string
  city: string
  country: string
  images: PropertyImage[]
  features: Record<string, any>
  createdAt: string
  owner?: User
}

export interface PropertyImage {
  id: string
  propertyId: string
  url: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  sender?: User
  receiver?: User
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  setAuth: (user: User | null, token: string | null) => void
  clearAuth: () => void
}

export interface SearchFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  q?: string
}

export interface CreatePropertyPayload {
  title: string
  description: string
  price: number
  address: string
  city: string
  country: string
  features: Record<string, any>
  images: File[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
