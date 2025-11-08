// Property Card Component
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { FiMapPin, FiDollarSign, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg'
  const fraudLevel = property.fraudScore || 0

  const getFraudBadge = () => {
    if (fraudLevel < 0.3) {
      return (
        <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
          <FiCheckCircle className="w-3 h-3" />
          <span>Verified</span>
        </span>
      )
    } else if (fraudLevel < 0.6) {
      return (
        <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
          <FiAlertTriangle className="w-3 h-3" />
          <span>Caution</span>
        </span>
      )
    } else {
      return (
        <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
          <FiAlertTriangle className="w-3 h-3" />
          <span>High Risk</span>
        </span>
      )
    }
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            {getFraudBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FiMapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.city}, {property.country}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {property.description}
          </p>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline justify-between border-t pt-3">
              <div>
                <div className="flex items-center text-primary-600 font-bold text-xl">
                  <FiDollarSign className="w-5 h-5" />
                  <span>{property.price.toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-500">per month</span>
              </div>

              {property.predictedRent && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    AI Predicted:
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    ${property.predictedRent.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
