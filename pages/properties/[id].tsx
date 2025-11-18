import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import LoadingSpinner from '@/components/LoadingSpinner'
import { propertyAPI } from '@/lib/api'
import Image from 'next/image'
import { formatPrice } from '@/utils/helpers'
import { useAuth } from '@/lib/AuthContext'
import toast from 'react-hot-toast'
import { chatAPI } from '@/lib/api'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [property, setProperty] = React.useState<any>(null)
  const [saved, setSaved] = React.useState(false)
  const [inquiryOpen, setInquiryOpen] = React.useState(false)
  const [inquiryMessage, setInquiryMessage] = React.useState('')
  const [sending, setSending] = React.useState(false)

  React.useEffect(() => {
    if (!id) return
    let cancelled = false
    setIsLoading(true)
    propertyAPI.getById(String(id))
      .then(res => {
        if (cancelled) return
        setProperty(res.data?.property ?? res.data)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load property', err)
        setError(err?.response?.data?.error || 'Failed to load property')
      })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [id])

  // initialize saved state
  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('savedProperties') : null
      const arr = raw ? JSON.parse(raw) : []
      setSaved(Array.isArray(arr) && id ? arr.includes(String(id)) : false)
    } catch (e) { setSaved(false) }
  }, [id])

  const toggleSave = () => {
    if (!id) return
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('savedProperties') : null
      let arr: string[] = raw ? JSON.parse(raw) : []
      arr = Array.isArray(arr) ? arr : []
      const sid = String(id)
      if (arr.includes(sid)) {
        arr = arr.filter(x => x !== sid)
        setSaved(false)
        toast('Removed from saved')
      } else {
        arr.push(sid)
        setSaved(true)
        toast.success('Saved property')
      }
      localStorage.setItem('savedProperties', JSON.stringify(arr))
    } catch (e) {
      console.warn('Failed to toggle save', e)
    }
  }

  const openInquiry = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    setInquiryOpen(true)
  }

  const sendInquiry = async () => {
    if (!user || !property) return
    if (!inquiryMessage || inquiryMessage.trim().length < 3) {
      toast.error('Please enter a short message')
      return
    }
    try {
      setSending(true)
      await chatAPI.sendMessage({ senderId: user.id, receiverId: property.ownerId || property.owner?.id, content: inquiryMessage })
      toast.success('Inquiry sent to owner')
      setInquiryOpen(false)
      setInquiryMessage('')
    } catch (e) {
      console.error('Failed to send inquiry', e)
      toast.error('Failed to send inquiry')
    } finally {
      setSending(false)
    }
  }

  if (isLoading) return <LoadingSpinner size="lg" className="min-h-screen" />
  if (error) return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Property not found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
      {inquiryOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Send Inquiry to Owner</h3>
            <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} className="w-full h-32 border rounded p-2" />
            <div className="mt-4 flex items-center justify-end space-x-2">
              <button onClick={() => setInquiryOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={sendInquiry} disabled={sending} className="px-3 py-2 bg-primary-600 text-white rounded">{sending ? 'Sending...' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  if (!property) return null

  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg'

  return (
    <>
      <Head>
        <title>{property.title || 'Property'}</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
          <div className="relative h-72 mb-6 bg-gray-100">
            <Image src={mainImage} alt={property.title} fill className="object-cover rounded" sizes="100vw" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
          <div className="text-gray-600 mb-4">{property.address}{property.city ? `, ${property.city}` : ''}</div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-bold">{formatPrice(Number(property.price || 0))}</div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
            <div className="flex items-center space-x-4">
              {property.predictedIsFallback !== true && property.predictedRent !== undefined && property.predictedRent !== null && (
              <div className="text-right">
                <div className="text-sm text-gray-600">AI Predicted</div>
                <div className="text-lg font-semibold text-green-600">{formatPrice(Math.round(Number(property.predictedRent)))}</div>
              </div>
              )}

              {/* Tenant actions */}
              {(!authLoading && user && user.role === 'TENANT') && (
                <div className="flex items-center space-x-2">
                  <button onClick={openInquiry} className="px-3 py-2 bg-primary-600 text-white rounded">Rent Inquiry</button>
                  <button onClick={toggleSave} className={`px-3 py-2 rounded ${saved ? 'bg-yellow-300' : 'border'}`}>{saved ? 'Saved' : 'Save'}</button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><strong>BHK:</strong> {property.bhk ?? property.BHK ?? '-'}</div>
            <div><strong>Bathrooms:</strong> {property.bathrooms ?? property.Bathrooms ?? '-'}</div>
            <div><strong>Area (sq ft):</strong> {property.superBuiltUpAreaSqft ?? property.SuperBuiltUpArea_sqft ?? '-'}</div>
            <div><strong>Parking:</strong> {property.parking ?? property.Parking ?? '-'}</div>
          </div>
        </div>
      </div>
    </>
  )
}
