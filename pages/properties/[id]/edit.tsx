"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/lib/AuthContext'
import { propertyAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, loading } = useAuth()

  const [loadingProp, setLoadingProp] = useState(false)
  const [prop, setProp] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[] | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      setLoadingProp(true)
      try {
        const res = await propertyAPI.getById(String(id))
        const data = res.data?.property || res.data
        setProp(data)
      } catch (err) {
        console.error('Failed to load property', err)
        toast.error('Failed to load property')
      } finally {
        setLoadingProp(false)
      }
    }
    fetch()
  }, [id])

  if (loading || !user) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>

  if (loadingProp || !prop) return (
    <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>
  )

  const handleChange = (field: string, value: any) => {
    setProp((p: any) => ({ ...p, [field]: value }))
  }

  const save = async () => {
    try {
      setSaving(true)
      const payload: any = {
        title: String(prop.title || ''),
        price: Number(prop.price || 0),
        address: prop.address || null,
        isRented: !!prop.isRented,
      }
      const res = await propertyAPI.update(prop.id, payload)
      const updated = res.data?.property || res.data
      setProp(updated)
      // If photos selected, upload them to the property
      if (photoFiles && photoFiles.length > 0) {
        try {
          const up = await propertyAPI.uploadPhotos(prop.id, photoFiles)
          const uploaded = up.data?.uploaded || up.data
          if (uploaded && Array.isArray(uploaded)) {
            // append new images to property images
            setProp((p: any) => ({ ...p, images: [...(p.images || []), ...uploaded.map((u: any) => ({ url: u.url }))] }))
          }
        } catch (e) {
          console.warn('Failed to upload photos', e)
          toast.error('Failed to upload photos')
        }
      }
      toast.success('Property updated')
      router.push('/dashboard/properties')
    } catch (err) {
      console.error('Failed to save property', err)
      toast.error('Failed to save property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Head>
        <title>Edit Property</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold mb-4">Edit Property</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input value={prop.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
              <input type="number" value={prop.price ?? 0} onChange={(e) => handleChange('price', Number(e.target.value))} className="mt-1 block w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <input type="file" multiple accept="image/*" onChange={(e) => setPhotoFiles(e.target.files ? Array.from(e.target.files) : null)} className="mt-1 block w-full" />
              <div className="text-xs text-gray-500 mt-2">You can upload multiple images. Max 6 recommended.</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea value={prop.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </div>

            <div className="flex items-center space-x-2">
              <input id="isRented" type="checkbox" checked={!!prop.isRented} onChange={(e) => handleChange('isRented', e.target.checked)} />
              <label htmlFor="isRented" className="text-sm text-gray-700">Is Rented</label>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-4">
              <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
