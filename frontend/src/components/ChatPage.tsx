import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import LocationSearch from './LocationSearch'
import DateRangePicker from './DateRangePicker'
import { useTrips } from '../hooks/useTrips'
import { useTypewriter } from '../hooks/useTypewriter'
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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [destinationNames, setDestinationNames] = useState<string[]>([])

  // Load destination names for typewriter effect
  useEffect(() => {
    fetch('/destinations.json')
      .then(res => res.json())
      .then(data => {
        const names = data.destinations.map((dest: any) => dest.name)
        setDestinationNames(names)
      })
      .catch(err => console.error('Failed to load destinations:', err))
  }, [])

  const typewriterText = useTypewriter(destinationNames, 100, 50, 2000)

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location)
    
    // Set default dates if not already set
    if (!startDate) {
      const defaultStart = new Date()
      defaultStart.setDate(defaultStart.getDate() + 30)
      setStartDate(defaultStart.toISOString().split('T')[0])
    }
    if (!endDate) {
      const defaultEnd = new Date()
      defaultEnd.setDate(defaultEnd.getDate() + 37)
      setEndDate(defaultEnd.toISOString().split('T')[0])
    }
  }

  const handleCreateTrip = () => {
    if (!selectedLocation || !startDate || !endDate) return

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      destination: `${selectedLocation.name}, ${selectedLocation.country}`,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      imageUrl: selectedLocation.imageUrl,
      description: selectedLocation.description,
      createdAt: new Date().toISOString(),
      activities: [],
      packingList: [],
      schedule: []
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Plan Your Dream Trip to{' '}
              </span>
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent inline-block min-w-[200px] text-left">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              Discover amazing destinations with AI-powered recommendations
            </p>
          </motion.div>

          {/* Location Search Component */}
          <LocationSearch onSelectLocation={handleSelectLocation} />

          {/* Date Range Picker - Show after location is selected */}
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleCreateTrip}
                  disabled={!startDate || !endDate}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-12 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Activities
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage

