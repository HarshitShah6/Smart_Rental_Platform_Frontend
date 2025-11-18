// types/index.ts
// Central TypeScript definitions for Smart Rental Platform

export type UserRole = 'TENANT' | 'OWNER' | 'ADMIN'

export interface User {
  id: string
  firebaseId?: string
  email?: string
  name?: string
  role?: UserRole
  createdAt?: string
  // Optional profile fields used in UI
  listingCount?: number
  gender?: string
  mobile?: string
  phone?: string
  phoneNumber?: string
}

export interface PropertyImage {
  id?: string
  propertyId?: string
  url: string
}

export interface Property {
  id: string
  ownerId: string
  title: string
  description: string
  price: number                // stored price (INR or app canonical currency)
  predictedRent?: number
  predictedIsFallback?: boolean
  fraudScore?: number
  address: string
  city?: string
  locality?: string
  country?: string
  images: PropertyImage[]
  features?: Record<string, any>
  createdAt?: string
  owner?: User

  // ML / detailed fields (optional)
  PropertyType?: string
  BHK?: number
  Bathrooms?: number
  Balconies?: number
  Furnishing?: string
  SuperBuiltUpArea_sqft?: number
  BuiltUpArea_sqft?: number
  CarpetArea_sqft?: number
  Floor?: number
  TotalFloors?: number
  Parking?: string
  BuildingType?: string
  YearBuilt?: number
  AgeYears?: number
  Facing?: string
  AmenitiesCount?: number
  IsRERARegistered?: boolean
  RERAID?: string

  // Frontend-friendly / camelCase synonyms (optional)
  bhk?: number
  bathrooms?: number
  balconies?: number
  superBuiltUpAreaSqft?: number
  builtUpAreaSqft?: number
  carpetAreaSqft?: number
  floor?: number
  totalFloors?: number
  propertyType?: string
  furnishing?: string
  buildingType?: string
  yearBuilt?: number
  ageYears?: number
  facing?: string
  amenitiesCount?: number
  isReraRegistered?: boolean
  reraId?: string
  latitude?: number
  longitude?: number
  isRented?: boolean
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
  // optional helper provided by AuthContext
  getIdTokenForce?: () => Promise<string | null>
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
  priceINR?: number
  price?: number
  address: string
  city: string
  country: string
  features?: Record<string, any>
  images?: File[]
  // optional advanced fields to mirror ML features
  PropertyType?: string
  Balconies?: number
  Furnishing?: string
  Floor?: number
  TotalFloors?: number
  Parking?: string
  BuildingType?: string
  YearBuilt?: number
  Facing?: string
  AmenitiesCount?: number
  IsRERARegistered?: boolean
  RERAID?: string
  // Note: ListingID, Locality, area/geo fields are stored in DB but are excluded from ML payloads
  SuperBuiltUpArea_sqft?: number
  BuiltUpArea_sqft?: number
  CarpetArea_sqft?: number
  BHK?: number
  Bathrooms?: number
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}
