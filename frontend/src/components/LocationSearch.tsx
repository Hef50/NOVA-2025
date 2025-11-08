import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
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

export default function LocationSearch({ onSelectLocation }: { onSelectLocation: (location: Location) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [recommendations, setRecommendations] = useState<Location[]>([])
  const [allDestinations, setAllDestinations] = useState<Location[]>([])

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
    
    // Simulate API call - Filter destinations based on search
    setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const filtered = allDestinations.filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query)
      )
      
      // Take top 4 results
      const results = filtered.slice(0, 4).map((dest, idx) => ({
        ...dest,
        bestDeal: idx === 0 // Mark first result as best deal
      }))
      
      setRecommendations(results.length > 0 ? results : allDestinations.slice(0, 4))
      setSearching(false)
    }, 1000)
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Where would you like to go? (e.g., Tokyo, Paris, Bali)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-32 py-6 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-6"
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
      </motion.div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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

