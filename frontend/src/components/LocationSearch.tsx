import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, SlidersHorizontal, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import RecommendationCard from './RecommendationCard'

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

interface LocationSearchProps {
  onSelectLocation: (location: Location) => void
  startDate?: string
  endDate?: string
}

export default function LocationSearch({ onSelectLocation, startDate: propStartDate, endDate: propEndDate }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [recommendations, setRecommendations] = useState<Location[]>([])
  const [allDestinations, setAllDestinations] = useState<Location[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [currentLocation, setCurrentLocation] = useState('')

  useEffect(() => {
    // Load destinations from JSON file
    fetch('/destinations.json')
      .then(res => res.json())
      .then(data => {
        const locations: Location[] = data.destinations.map((dest: any) => ({
          id: dest.id,
          name: dest.name,
          country: dest.country,
          description: dest.description,
          imageUrl: dest.imageUrl,
          price: dest.price,
          highlights: dest.highlights,
          bestDeal: false
        }))
        setAllDestinations(locations)
      })
      .catch(err => console.error('Failed to load destinations:', err))
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    
    try {
      // Check if filters are active
      const hasActiveFilters = 
        currentLocation || 
        (priceRange[0] !== 0 || priceRange[1] !== 5000) ||
        (propStartDate && propEndDate)
      
      // First, try to find matches in existing destinations
      const query = searchQuery.toLowerCase()
      let filtered = allDestinations.filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query)
      )
      
      // Apply price filter if active
      if (priceRange[0] !== 0 || priceRange[1] !== 5000) {
        filtered = filtered.filter(dest => {
          // Extract price from string like "$1,200 - $2,000"
          const priceMatch = dest.price.match(/\$?([\d,]+)/g)
          if (priceMatch && priceMatch.length > 0) {
            const minPrice = parseInt(priceMatch[0].replace(/[$,]/g, ''))
            return minPrice >= priceRange[0] && minPrice <= priceRange[1]
          }
          return true
        })
      }
      
      // If we have exact matches and no filters, use them (threshold lowered to 1)
      if (filtered.length >= 1 && !hasActiveFilters) {
        const results = filtered.slice(0, 10).map((dest, idx) => ({
          ...dest,
          bestDeal: idx === 0
        }))
        setRecommendations(results)
        setSearching(false)
        return
      }
      
      // Otherwise, generate AI recommendations (for unique locations or when filters active)
      const requestBody: any = {
        prompt: searchQuery
      }
      
      if (currentLocation) requestBody.current_location = currentLocation
      if (priceRange[0] !== 0 || priceRange[1] !== 5000) {
        requestBody.price_range = { min: priceRange[0], max: priceRange[1] }
      }
      if (propStartDate && propEndDate) {
        requestBody.date_range = { start: propStartDate, end: propEndDate }
      }
      
      const response = await fetch('http://localhost:8000/generate_destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate destinations')
      }
      
      const data = await response.json()
      const aiDestinations = data.destinations.map((dest: any, idx: number) => ({
        ...dest,
        bestDeal: idx === 0
      }))
      
      setRecommendations(aiDestinations)
    } catch (error) {
      console.error('Error searching destinations:', error)
      // Fallback to filtered results
      const results = allDestinations.slice(0, 10).map((dest, idx) => ({
        ...dest,
        bestDeal: idx === 0
      }))
      setRecommendations(results)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Where would you like to go? (e.g., I want to go surfing somewhere)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-44 py-6 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="border-purple-300 hover:bg-purple-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-6"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-purple-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Current Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Starting From (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., New York, USA"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Apply Filters Button */}
                <Button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
                >
                  Apply Filters & Search
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations Grid */}
      <AnimatePresence mode="wait">
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Perfect Destinations for You
              </h2>
              <p className="text-gray-600">
                AI-curated recommendations based on your search
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RecommendationCard
                    location={location}
                    onSelect={() => onSelectLocation(location)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!searching && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Search for Your Dream Destination
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a city or country name to get AI-powered travel recommendations
          </p>
        </motion.div>
      )}
    </div>
  )
}

