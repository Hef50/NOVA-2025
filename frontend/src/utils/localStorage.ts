import type { Trip } from '../types/trip'

const TRIPS_KEY = 'vacai_trips'

export const localStorageUtils = {
  // Get all trips
  getTrips: (): Trip[] => {
    try {
      const trips = localStorage.getItem(TRIPS_KEY)
      return trips ? JSON.parse(trips) : []
    } catch (error) {
      console.error('Error reading trips from localStorage:', error)
      return []
    }
  },

  // Get a single trip by ID
  getTrip: (id: string): Trip | null => {
    const trips = localStorageUtils.getTrips()
    return trips.find(trip => trip.id === id) || null
  },

  // Save a new trip
  saveTrip: (trip: Trip): void => {
    try {
      const trips = localStorageUtils.getTrips()
      trips.push(trip)
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips))
    } catch (error) {
      console.error('Error saving trip to localStorage:', error)
    }
  },

  // Update an existing trip
  updateTrip: (id: string, updates: Partial<Trip>): void => {
    try {
      const trips = localStorageUtils.getTrips()
      const index = trips.findIndex(trip => trip.id === id)
      if (index !== -1) {
        trips[index] = { ...trips[index], ...updates }
        localStorage.setItem(TRIPS_KEY, JSON.stringify(trips))
      }
    } catch (error) {
      console.error('Error updating trip in localStorage:', error)
    }
  },

  // Delete a trip
  deleteTrip: (id: string): void => {
    try {
      const trips = localStorageUtils.getTrips()
      const filtered = trips.filter(trip => trip.id !== id)
      localStorage.setItem(TRIPS_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting trip from localStorage:', error)
    }
  },

  // Clear all trips
  clearTrips: (): void => {
    try {
      localStorage.removeItem(TRIPS_KEY)
    } catch (error) {
      console.error('Error clearing trips from localStorage:', error)
    }
  }
}

