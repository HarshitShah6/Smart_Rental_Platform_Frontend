// Home page with property search and listing
import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import PropertyCard from '@/components/PropertyCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Property, SearchFilters } from '@/types'
import { propertyAPI } from '@/lib/api'
import { FiSearch, FiFilter } from 'react-icons/fi'
import useSWR from 'swr'

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    minPrice: undefined,
    maxPrice: undefined,
    q: '',
  })
  const [searchQuery, setSearchQuery] = useState('')

  const fetcher = (url: string) => propertyAPI.search(filters).then((res: any) => res.data)
  const { data: properties, error, isLoading } = useSWR<Property[]>(
    `/properties/search?${new URLSearchParams(filters as any).toString()}`,
    fetcher
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, q: searchQuery })
  }

  return (
    <>
      <Head>
        <title>SmartRental - Find Your Perfect Home</title>
        <meta name="description" content="AI-powered rental platform with fraud detection and rent prediction" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Find Your Perfect Rental Home
            </h1>
            <p className="text-xl mb-8 text-primary-100 animate-fade-in">
              AI-powered platform with fraud detection and intelligent rent prediction
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="animate-slide-up">
              <div className="flex flex-col md:flex-row gap-3 bg-white rounded-lg p-3 shadow-lg">
                <input
                  type="text"
                  placeholder="Search by city, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 font-semibold"
                >
                  <FiSearch className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>

            <input
              type="text"
              placeholder="City"
              value={filters.city || ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-32"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-32"
            />

            <button
              onClick={() => setFilters({ city: '', minPrice: undefined, maxPrice: undefined, q: '' })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">Failed to load properties. Please try again.</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Available Properties ({properties.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No properties found matching your criteria.</p>
            <button
              onClick={() => setFilters({ city: '', minPrice: undefined, maxPrice: undefined, q: '' })}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SmartRental?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Predictions</h3>
              <p className="text-gray-600">
                Get accurate rent predictions based on market data and property features using machine learning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fraud Detection</h3>
              <p className="text-gray-600">
                Advanced fraud detection algorithms analyze listings to protect you from scams and suspicious properties.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
              <p className="text-gray-600">
                Connect instantly with property owners through our built-in real-time messaging system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
