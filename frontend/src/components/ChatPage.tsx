import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import LocationSearch from './LocationSearch'
import { useTrips } from '../hooks/useTrips'
import type { Trip } from '../types/trip'

interface Location {
  id: string
  name: string
  country: string
  description: string
  imageUrl: string
  bestDeal?: boolean
  price: string
  highlights: string[]
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const { addTrip } = useTrips()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location)
    
    // Create a new trip
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 30) // 30 days from now
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7) // 7 day trip

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      destination: `${location.name}, ${location.country}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      imageUrl: location.imageUrl,
      description: location.description,
      createdAt: new Date().toISOString(),
      activities: [],
      packingList: []
    }

    addTrip(newTrip)
    
    // Navigate to things to do page
    navigate(`/trips/${newTrip.id}/things-to-do`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Plan Your Dream Trip
            </h1>
            <p className="text-gray-600 text-xl">
              Discover amazing destinations with AI-powered recommendations
            </p>
          </motion.div>

          {/* Location Search Component */}
          <LocationSearch onSelectLocation={handleSelectLocation} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage

