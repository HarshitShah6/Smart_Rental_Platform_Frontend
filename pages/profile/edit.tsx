"use client"
import React from 'react'
import Head from 'next/head'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const { user, loading, updateProfile } = useAuth() as any
  const router = useRouter()

  const [name, setName] = React.useState('')
  const [gender, setGender] = React.useState('')
  const [mobile, setMobile] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!loading && user) {
      setName(user.name || '')
      setGender(user.gender || '')
      setMobile(user.mobile || user.phone || user.phoneNumber || '')
    }
  }, [user, loading])

  const save = async () => {
    setSaving(true)
    try {
      await updateProfile({ name: String(name || '').trim(), gender: gender || null, mobile: mobile || null })
      toast.success('Profile updated')
      router.back()
    } catch (err) {
      console.error('Failed to save profile', err)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>
  if (!user) return <div className="min-h-[60vh] flex items-center justify-center">Please sign in</div>

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded shadow p-6">
          <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full border rounded p-2">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
