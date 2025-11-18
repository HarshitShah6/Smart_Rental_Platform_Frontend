"use client"
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useAuth } from '@/lib/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import Link from 'next/link'
import { propertyAPI } from '@/lib/api'
import { formatPrice } from '@/utils/helpers'

type PropertyAny = any

export default function TenantDashboardPage() {
  const { user, loading } = useAuth()
  const [saved, setSaved] = useState<PropertyAny[] | null>(null)
  const [rented, setRented] = useState<PropertyAny[] | null>(null)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (!loading && !user) return
    const fetchLists = async () => {
      setLoadingData(true)
      try {
        // Load saved property ids from localStorage (frontend feature)
        let savedIds: string[] = []
        try {
          const raw = typeof window !== 'undefined' ? localStorage.getItem('savedProperties') : null
          if (raw) savedIds = JSON.parse(raw)
        } catch (e) {
          savedIds = []
        }

        const savedProps: PropertyAny[] = []
        for (const id of savedIds.slice(0, 50)) {
          try {
            const res = await propertyAPI.getById(id)
            const p = res.data?.property || res.data
            if (p) savedProps.push(p)
          } catch (e) {
            // ignore missing
          }
        }

        // For rented properties: fallback to scanning recent properties and filter isRented or feature flag
        const resAll = await propertyAPI.search({ limit: 200 })
        const all = resAll.data || resAll.data?.data || []
        const rentedProps = (all || []).filter((p: any) => {
          const f = p.features || {}
          if (typeof f === 'object') {
            if (f.status && String(f.status).toUpperCase() === 'RENTED') return true
            if (f.isRented === true) return true
          }
          if (p.isRented || p.rented === true) return true
          return false
        })

        setSaved(savedProps)
        setRented(rentedProps)
      } catch (e) {
        console.warn('Failed to load tenant dashboard lists', e)
        setSaved([])
        setRented([])
      } finally {
        setLoadingData(false)
      }
    }
    fetchLists()
  }, [user, loading])

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Tenant Dashboard</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-lg font-semibold">{user.name || user.email}</div>
            <div className="text-sm text-gray-600">Role: {user.role}</div>
            <div className="text-sm text-gray-600">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
            {user.mobile && <div className="text-sm text-gray-600">Mobile: {user.mobile}</div>}
            <Link href="/profile/edit" className="inline-block mt-4 px-3 py-2 border rounded">Edit Profile</Link>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Saved Properties</h3>
              {loadingData ? (
                <LoadingSpinner size="md" />
              ) : (saved && saved.length > 0) ? (
                <div className="grid grid-cols-1 gap-4">
                  {saved.map((p) => (
                    <div key={p.id} className="border rounded p-3">
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-600">{p.city || p.address}</div>
                      <div className="text-sm text-gray-700">Price: {formatPrice(Math.round(Number(p.price || 0)))}</div>
                      {p.predictedIsFallback !== true && p.predictedRent !== undefined && p.predictedRent !== null && (
                        <div className="text-sm text-green-600">AI Predicted: {formatPrice(Math.round(Number(p.predictedRent)))}</div>
                      )}
                      <div className="mt-2"><Link href={`/properties/${p.id}`} className="text-primary-600">View</Link></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">No saved properties found.</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-3">Rented Properties</h3>
              {loadingData ? (
                <LoadingSpinner size="md" />
              ) : (rented && rented.length > 0) ? (
                <div className="grid grid-cols-1 gap-4">
                  {rented.map((p) => (
                    <div key={p.id} className="border rounded p-3">
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-600">{p.city || p.address}</div>
                      <div className="text-sm text-gray-700">Price: {formatPrice(Math.round(Number(p.price || 0)))}</div>
                      {p.predictedIsFallback !== true && p.predictedRent !== undefined && p.predictedRent !== null && (
                        <div className="text-sm text-green-600">AI Predicted: {formatPrice(Math.round(Number(p.predictedRent)))}</div>
                      )}
                      <div className="mt-2"><Link href={`/properties/${p.id}`} className="text-primary-600">View</Link></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">No rented properties found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
