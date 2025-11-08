import { useState } from 'react'
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    
    // Simulate API call - Replace with actual AI/API call later
    setTimeout(() => {
      const mockRecommendations: Location[] = [
        {
          id: '1',
          name: 'Kyoto',
          country: 'Japan',
          description: 'Ancient temples, traditional gardens, and stunning cherry blossoms await in this cultural heart of Japan.',
          imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
          bestDeal: true,
          price: '$1,200 - $1,800',
          highlights: ['Historic Temples', 'Cherry Blossoms', 'Traditional Cuisine']
        },
        {
          id: '2',
          name: 'Barcelona',
          country: 'Spain',
          description: 'Vibrant architecture, beautiful beaches, and world-class cuisine in the heart of Catalonia.',
          imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
          price: '$1,000 - $1,500',
          highlights: ['Gaudí Architecture', 'Mediterranean Beaches', 'Tapas Culture']
        },
        {
          id: '3',
          name: 'Santorini',
          country: 'Greece',
          description: 'Iconic white-washed buildings, stunning sunsets, and crystal-clear Aegean waters.',
          imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
          price: '$1,500 - $2,200',
          highlights: ['Sunset Views', 'White Architecture', 'Wine Tasting']
        },
        {
          id: '4',
          name: 'Dubai',
          country: 'UAE',
          description: 'Futuristic skyline, luxury shopping, and desert adventures in this modern metropolis.',
          imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
          price: '$1,800 - $2,500',
          highlights: ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping']
        }
      ]
      
      setRecommendations(mockRecommendations)
      setSearching(false)
    }, 1500)
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

