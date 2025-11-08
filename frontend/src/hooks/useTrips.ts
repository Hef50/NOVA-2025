import { useState, useEffect } from 'react'
import type { Trip } from '../types/trip'
import { localStorageUtils } from '../utils/localStorage'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  // Load trips on mount
  useEffect(() => {
    const loadedTrips = localStorageUtils.getTrips()
    setTrips(loadedTrips)
    setLoading(false)
  }, [])

  // Add a new trip
  const addTrip = (trip: Trip) => {
    localStorageUtils.saveTrip(trip)
    setTrips(prev => [...prev, trip])
  }

  // Update a trip
  const updateTrip = (id: string, updates: Partial<Trip>) => {
    localStorageUtils.updateTrip(id, updates)
    setTrips(prev =>
      prev.map(trip => (trip.id === id ? { ...trip, ...updates } : trip))
    )
  }

  // Delete a trip
  const deleteTrip = (id: string) => {
    localStorageUtils.deleteTrip(id)
    setTrips(prev => prev.filter(trip => trip.id !== id))
  }

  // Get upcoming trips (trips with start date in the future)
  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate)
    return startDate > new Date()
  })

  // Calculate packing progress
  const getPackingProgress = (tripId: string): number => {
    const trip = trips.find(t => t.id === tripId)
    if (!trip || !trip.packingList || trip.packingList.length === 0) return 0
    
    const packedItems = trip.packingList.filter(item => item.packed).length
    return Math.round((packedItems / trip.packingList.length) * 100)
  }

  return {
    trips,
    loading,
    addTrip,
    updateTrip,
    deleteTrip,
    upcomingTrips,
    getPackingProgress
  }
}

