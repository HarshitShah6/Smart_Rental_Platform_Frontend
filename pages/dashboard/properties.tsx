"use client"
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { propertyAPI } from '@/lib/api'
import toast from 'react-hot-toast'
 

type OwnerProperty = any

export default function OwnerPropertiesPage() {
  const { user, loading, updateProfile } = useAuth()
  const router = useRouter()
  // Local state hooks (declare unconditionally to keep hook order stable)
  const [properties, setProperties] = useState<OwnerProperty[] | null>(null)
  const [loadingProps, setLoadingProps] = useState(false)
  const [activeTab, setActiveTab] = useState<'properties' | 'rented'>('properties')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editProperty, setEditProperty] = useState<OwnerProperty | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login')
      } else if (user.role !== 'OWNER') {
        // Not an owner — redirect to home
        router.replace('/')
      }
    }
  }, [user, loading, router])
  // Load owner properties (declare hook unconditionally)
  useEffect(() => {
    const fetch = async () => {
      setLoadingProps(true)
      try {
        // backend supports ownerId filter now
        const res = await propertyAPI.my(user!.id, { limit: 100 })
        setProperties(res.data || res.data?.data || [])
      } catch (err) {
        console.warn('Failed to load owner properties', err)
        setProperties([])
      } finally {
        setLoadingProps(false)
      }
    }
    fetch()
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleDelete = (id: string) => {
    // open confirmation modal
    setDeleteCandidate(id)
  }

  const confirmDelete = async () => {
    const id = deleteCandidate
    if (!id) return
    try {
      setDeleting(id)
      await propertyAPI.delete(id)
      setProperties((prev) => prev ? prev.filter((p) => p.id !== id) : prev)
      // Decrement listingCount optimistically on the user profile
      try {
        if (user) {
          const current = Number(user.listingCount ?? 0)
          const next = Math.max(0, current - 1)
          // Use updateProfile so backend is updated if endpoint exists and local state refreshed
          await updateProfile({ listingCount: next } as any)
        }
      } catch (e) {
        // ignore profile update failures — listingCount will refresh on next session
        console.warn('Failed to update user listingCount locally', e)
      }
      toast.success('Property deleted')
    } catch (err) {
      console.error('Failed to delete property', err)
      toast.error('Failed to delete property')
    } finally {
      setDeleting(null)
      setDeleteCandidate(null)
    }
  }

  const cancelDelete = () => setDeleteCandidate(null)

  const rentedProperties = (properties || []).filter((p) => {
    // best-effort checks for rented flag in features or explicit keys
    const features = p.features || {}
    if (typeof features === 'object') {
      if (features.status && String(features.status).toUpperCase() === 'RENTED') return true
      if (features.isRented === true) return true
    }
    // fallback: check for explicit flag
    if (p.isRented || p.rented === true) return true
    return false
  })

  const handleEditChange = (field: string, value: any) => {
    setEditProperty((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const saveEdit = async () => {
    if (!editProperty) return
    const { id, title, price, isRented } = editProperty
    if (!title || String(title).trim().length === 0) {
      toast.error('Title cannot be empty')
      return
    }
    if (price !== undefined && Number.isNaN(Number(price))) {
      toast.error('Price must be a number')
      return
    }
    try {
      const payload: any = { title: String(title) }
      if (price !== undefined) payload.price = Number(price)
      if (isRented !== undefined) payload.isRented = !!isRented
      const res = await propertyAPI.update(id, payload)
      const updated = res.data?.property || res.data
      setProperties((prev) => prev ? prev.map((p) => p.id === id ? { ...p, ...updated } : p) : prev)
      toast.success('Property updated')
      setEditProperty(null)
    } catch (err) {
      console.error('Failed to update property', err)
      toast.error('Failed to update property')
    }
  }

  return (
    <>
      <Head>
        <title>Owner Dashboard — Properties</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Owner profile panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
              <div>
                <div className="text-lg font-semibold">{user.name || 'Owner'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                {user.gender && <div className="text-sm text-gray-600">Gender: {String(user.gender)}</div>}
                {(user.mobile || user.phone || user.phoneNumber) && (
                  <div className="text-sm text-gray-600">Mobile: {user.mobile || user.phone || user.phoneNumber}</div>
                )}
                <div className="text-sm text-gray-500 mt-2">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
                <div className="text-sm text-gray-500">Listings: {user.listingCount ?? 0}</div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button onClick={() => setActiveTab('properties')} className={`w-full text-left px-3 py-2 rounded ${activeTab === 'properties' ? 'bg-primary-600 text-white' : 'bg-gray-50'}`}>
                Your Properties
              </button>
              <button onClick={() => setActiveTab('rented')} className={`w-full text-left px-3 py-2 rounded ${activeTab === 'rented' ? 'bg-primary-600 text-white' : 'bg-gray-50'}`}>
                Currently Rented
              </button>
              <Link href="/profile/edit" className="block text-center px-3 py-2 mt-2 border rounded text-sm text-gray-700">Edit Profile</Link>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{activeTab === 'properties' ? 'Your Properties' : 'Currently Rented'}</h2>
              <Link href="/properties/create" className="px-4 py-2 bg-primary-600 text-white rounded-lg">List New Property</Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              {loadingProps ? (
                <div className="py-12"><LoadingSpinner size="lg" /></div>
              ) : (activeTab === 'properties' ? (
                (properties && properties.length > 0) ? (
                  <div className="grid grid-cols-1 gap-4">
                    {properties.map((p: OwnerProperty) => (
                      <div key={p.id} className="border rounded p-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{p.title}</div>
                          <div className="text-sm text-gray-600">{p.city || p.address}</div>
                          <div className="text-xs text-gray-500">Posted: {new Date(p.createdAt).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-700 mt-1">Price: ₹{Math.round((p.price || 0) / 100) * 100}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link href={`/properties/${p.id}`} className="text-primary-600">View</Link>
                          <button onClick={() => setEditProperty(p)} className="text-gray-600">Quick Edit</button>
                          <Link href={`/properties/${p.id}/edit`} className="text-gray-600">Full Edit</Link>
                          <button disabled={deleting === p.id} onClick={() => handleDelete(p.id)} className="text-red-600">{deleting === p.id ? 'Deleting...' : 'Delete'}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 mb-4">You have not listed any properties yet.</p>
                    <Link href="/properties/create" className="px-4 py-2 bg-primary-600 text-white rounded">List your first property</Link>
                  </div>
                )
              ) : (
                // Rented tab
                (rentedProperties && rentedProperties.length > 0) ? (
                  <div className="grid grid-cols-1 gap-4">
                    {rentedProperties.map((p: OwnerProperty) => (
                      <div key={p.id} className="border rounded p-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{p.title}</div>
                          <div className="text-sm text-gray-600">{p.city || p.address}</div>
                          <div className="text-xs text-gray-500">Rented: details available in features</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link href={`/properties/${p.id}`} className="text-primary-600">View</Link>
                          <Link href={`/properties/${p.id}/edit`} className="text-gray-600">Edit</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-600 mb-4">No rented properties found.</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      {editProperty && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Edit</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input value={editProperty.title || ''} onChange={(e) => handleEditChange('title', e.target.value)} className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                <input value={editProperty.price ?? ''} onChange={(e) => handleEditChange('price', e.target.value)} className="mt-1 block w-full border rounded p-2" />
              </div>
              <div className="flex items-center space-x-2">
                <input id="isRented" type="checkbox" checked={!!editProperty.isRented} onChange={(e) => handleEditChange('isRented', e.target.checked)} />
                <label htmlFor="isRented" className="text-sm text-gray-700">Is Rented</label>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-3">
              <button onClick={() => setEditProperty(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm delete</h3>
            <p className="text-sm text-gray-700">Are you sure you want to permanently delete this property? This action cannot be undone.</p>
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button onClick={cancelDelete} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting === deleteCandidate} className="px-4 py-2 bg-red-600 text-white rounded">{deleting === deleteCandidate ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
