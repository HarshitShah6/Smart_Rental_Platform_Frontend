
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { propertyAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { FiUpload, FiX, FiMapPin } from 'react-icons/fi'
import { useDropzone } from 'react-dropzone'

type FormState = {
  // basic
  title: string
  description: string
  priceINR: string
  address: string
  city: string
  bedrooms: string
  bathrooms: string
  area: string

  // advanced ML fields (optional)
  PropertyType?: string
  Balconies?: string
  Furnishing?: string
  Floor?: string
  TotalFloors?: string
  Parking?: string
  BuildingType?: string
  YearBuilt?: string
  Facing?: string
  AmenitiesCount?: string
  IsRERARegistered?: boolean
  RERAID?: string

  // geo (auto-fill) saved as strings so they can be appended to FormData
  latitude?: string
  longitude?: string
}

export default function CreatePropertyPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    priceINR: '',
    address: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    
    PropertyType: '',
    Balconies: '',
    Furnishing: '',
    Floor: '',
    TotalFloors: '',
    Parking: '',
    BuildingType: '',
    YearBuilt: '',
    Facing: '',
    AmenitiesCount: '',
    IsRERARegistered: false,
    RERAID: '',
    latitude: '',
    longitude: ''
  })

  // redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [user, authLoading, router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 6,
    onDrop: (acceptedFiles) => setImages((p) => [...p, ...acceptedFiles].slice(0, 6))
  })

  const removeImage = (idx: number) => setImages((p) => p.filter((_, i) => i !== idx))

  const toNumberOrNull = (v?: string) => {
    if (!v) return null
    const n = Number(String(v).replace(/[^\d.-]/g, ''))
    return Number.isFinite(n) ? n : null
  }

  // heuristics for areas: if user provides only area, derive built/carpet
  const deriveAreas = (areaInput?: string) => {
    const area = toNumberOrNull(areaInput) ?? null
    if (!area) return { superBuiltUp: null, builtUp: null, carpet: null }
    const builtUp = Math.round(area * 0.95)
    const carpet = Math.round(builtUp * 0.85)
    return { superBuiltUp: area, builtUp, carpet }
  }

  const computeAgeYears = (yearBuilt?: string) => {
    const y = toNumberOrNull(yearBuilt)
    if (!y) return null
    const now = new Date().getFullYear()
    const age = now - Math.floor(y)
    return age >= 0 ? age : null
  }

  const autofillGeolocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({ ...prev, latitude: String(pos.coords.latitude), longitude: String(pos.coords.longitude) }))
      toast.success('Location autofilled')
    }, (err) => {
      toast.error('Unable to get location')
      console.warn(err)
    }, { timeout: 8000 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fd = new FormData()

      // basic fields
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('priceINR', formData.priceINR)
      fd.append('address', formData.address)
      fd.append('city', formData.city)

      // user-provided features
      if (formData.bedrooms) fd.append('BHK', formData.bedrooms)
      if (formData.bathrooms) fd.append('Bathrooms', formData.bathrooms)

      // areas (derived if necessary)
      const { superBuiltUp, builtUp, carpet } = deriveAreas(formData.area)
      if (superBuiltUp !== null) fd.append('SuperBuiltUpArea_sqft', String(superBuiltUp))
      if (builtUp !== null) fd.append('BuiltUpArea_sqft', String(builtUp))
      if (carpet !== null) fd.append('CarpetArea_sqft', String(carpet))

      // advanced fields
      // Include ML-related fields (ListingID/Locality/geo are excluded from ML payload)
      fd.append('PropertyType', formData.PropertyType || '')
      fd.append('Balconies', formData.Balconies || '')
      fd.append('Furnishing', formData.Furnishing || '')
      // Areas may be provided above via deriveAreas
      // areas are derived from the main `area` field earlier and appended when present
      fd.append('Floor', formData.Floor || '')
      fd.append('TotalFloors', formData.TotalFloors || '')
      fd.append('Parking', formData.Parking || '')
      fd.append('BuildingType', formData.BuildingType || '')
      fd.append('YearBuilt', formData.YearBuilt || '')
      fd.append('Facing', formData.Facing || '')
      fd.append('AmenitiesCount', formData.AmenitiesCount || '')
      fd.append('IsRERARegistered', String(!!formData.IsRERARegistered))
      fd.append('RERAID', formData.RERAID || '')

      // Note: locality and geo fields are saved to DB but excluded from ML prediction payloads.

      const age = computeAgeYears(formData.YearBuilt)
      if (age !== null) fd.append('AgeYears', String(age))

      // images
      images.forEach((img) => fd.append('images', img))

      // Acquire Firebase ID token if available (so backend can create/find owner)
            // Acquire Firebase ID token if available (so backend can create/find owner)
      let token: string | null = null
      try {
        if ((user as any)?.getIdToken) token = await (user as any).getIdToken()
        else if ((window as any).firebase?.auth) {
          const u = (window as any).firebase.auth().currentUser
          if (u) token = await u.getIdToken()
        }
      } catch (e) { /* ignore */ }

      // Attach owner-identifiers for backend to resolve user
      // prefer AuthContext user.email, fallback to firebase.currentUser
      let ownerEmail: string | null = null
      let ownerName: string | null = null
      try {
        if ((user as any)?.email) ownerEmail = (user as any).email
        if ((user as any)?.name) ownerName = (user as any).name
        // fallback if AuthContext doesn't expose email
        else if (typeof window !== 'undefined' && (window as any).firebase?.auth) {
          const u = (window as any).firebase.auth().currentUser
          if (u && u.email) ownerEmail = u.email
          if (u && u.displayName) ownerName = u.displayName
        }
      } catch (e) {
        // ignore
      }

      if (ownerEmail) {
        fd.append('ownerEmail', ownerEmail)
      }
      if (ownerName) {
        fd.append('ownerName', ownerName)
      }

      // Send FormData and include ownerEmail as a header (API helper will add it)
      const resp = await propertyAPI.create(fd, token, ownerEmail ?? null)

      toast.success('Property listed — ML analysis scheduled')
      const propertyId = resp.data?.property?.id ?? resp.data?.propertyId
      if (propertyId) router.push(`/properties/${propertyId}`)
      else router.push('/')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <LoadingSpinner size="lg" className="min-h-screen" />
  if (!user) return null

  return (
    <>
      <Head><title>List Your Property</title></Head>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold mb-2">List Your Property</h1>
              <p className="text-gray-600 mb-6">Fill basic details; we derive the rest for ML prediction.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                  <input required value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg" placeholder="2BR Apartment in Downtown" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea required value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})}
                    rows={4} className="w-full px-4 py-3 border rounded-lg" />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (INR) *</label>
                  <input required type="number" value={formData.priceINR} onChange={(e)=>setFormData({...formData, priceINR:e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg" placeholder="200000" />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div><label className="text-sm">City *</label><input required value={formData.city} onChange={(e)=>setFormData({...formData, city:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/></div>
                </div>

                <div>
                  <label className="text-sm">Full Address *</label>
                  <input required value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                </div>

                {/* Basic features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-sm">Bedrooms *</label><input required type="number" min={0} value={formData.bedrooms} onChange={(e)=>setFormData({...formData, bedrooms:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/></div>
                  <div><label className="text-sm">Bathrooms *</label><input required step="0.5" type="number" min={0} value={formData.bathrooms} onChange={(e)=>setFormData({...formData, bathrooms:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/></div>
                  <div><label className="text-sm">Area (sq ft) *</label><input required type="number" min={0} value={formData.area} onChange={(e)=>setFormData({...formData, area:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/></div>
                </div>

                <div className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                      <input required placeholder="Apartment / Villa" value={formData.PropertyType} onChange={(e)=>setFormData({...formData, PropertyType:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Balconies *</label>
                      <input required type="number" placeholder="Number of balconies" value={formData.Balconies} onChange={(e)=>setFormData({...formData, Balconies:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing *</label>
                      <input required placeholder="Furnished / Semi / Unfurnished" value={formData.Furnishing} onChange={(e)=>setFormData({...formData, Furnishing:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
                      <input required type="number" placeholder="Floor number" value={formData.Floor} onChange={(e)=>setFormData({...formData, Floor:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors *</label>
                      <input required type="number" placeholder="Total floors in building" value={formData.TotalFloors} onChange={(e)=>setFormData({...formData, TotalFloors:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parking *</label>
                      <input required placeholder="Parking available" value={formData.Parking} onChange={(e)=>setFormData({...formData, Parking:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Building Type *</label>
                      <input required placeholder="e.g., Multistorey / Gated" value={formData.BuildingType} onChange={(e)=>setFormData({...formData, BuildingType:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year Built *</label>
                      <input required type="number" placeholder="Year built" value={formData.YearBuilt} onChange={(e)=>setFormData({...formData, YearBuilt:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facing *</label>
                      <input required placeholder="North / South / East / West" value={formData.Facing} onChange={(e)=>setFormData({...formData, Facing:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities Count *</label>
                      <input required type="number" placeholder="Number of amenities" value={formData.AmenitiesCount} onChange={(e)=>setFormData({...formData, AmenitiesCount:e.target.value})} className="w-full px-4 py-3 border rounded-lg"/>
                    </div>

                    {/* Listing ID input removed: ListingID is no longer sent to ML */}
                    

                    <div className="md:col-span-2 flex flex-col md:flex-row md:items-end md:space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">RERA ID {formData.IsRERARegistered ? '*' : ''}</label>
                        <input placeholder="Enter RERA ID" value={formData.RERAID} onChange={(e)=>setFormData({...formData, RERAID:e.target.value})} className="w-full px-4 py-3 border rounded-lg" disabled={!formData.IsRERARegistered} required={!!formData.IsRERARegistered} />
                      </div>

                      <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Is RERA Registered *</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="isRera" checked={formData.IsRERARegistered === true} onChange={()=>setFormData({...formData, IsRERARegistered: true})} />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="isRera" checked={formData.IsRERARegistered === false} onChange={()=>setFormData({...formData, IsRERARegistered: false, RERAID: ''})} />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                      <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={autofillGeolocation} className="px-3 py-2 bg-primary-600 text-white rounded">Auto-fill location</button>
                        <span className="text-sm text-gray-500"><FiMapPin/> location</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="text-sm">Property Images (max 6)</label>
                  <div {...getRootProps()} className={`border-2 border-dashed p-6 rounded ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    <p className="text-gray-600">Drag & drop or click to select (PNG/JPG)</p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {images.map((f, i) => (
                        <div key={i} className="relative group">
                          <img src={URL.createObjectURL(f)} className="w-full h-32 object-cover rounded" />
                          <button type="button" onClick={()=>removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><FiX/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={()=>router.back()} className="px-4 py-2">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-3 bg-primary-600 text-white rounded">
                    {loading ? <LoadingSpinner size="sm"/> : 'List Property'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}