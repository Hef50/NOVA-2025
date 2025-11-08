import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import type { Activity } from '../types/trip'
import AttractionCard from './AttractionCard'
import FilterBar from './FilterBar'
import { Button } from './ui/button'

const mockAttractions: Activity[] = [
  {
    id: '1',
    name: 'Fushimi Inari Shrine',
    description: 'Famous shrine with thousands of vermillion torii gates winding up the mountain',
    category: 'attraction',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80',
    selected: false
  },
  {
    id: '2',
    name: 'Kinkaku-ji Temple',
    description: 'Stunning golden pavilion surrounded by beautiful gardens and reflecting pond',
    category: 'attraction',
    price: 5,
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    selected: false
  },
  {
    id: '3',
    name: 'Nishiki Market',
    description: 'Traditional food market with over 100 shops and stalls selling local delicacies',
    category: 'food',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    selected: false
  },
  {
    id: '4',
    name: 'Arashiyama Bamboo Grove',
    description: 'Enchanting bamboo forest path creating a serene natural atmosphere',
    category: 'attraction',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
    selected: false
  },
  {
    id: '5',
    name: 'Traditional Tea Ceremony',
    description: 'Experience authentic Japanese tea ceremony in a traditional setting',
    category: 'entertainment',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80',
    selected: false
  },
  {
    id: '6',
    name: 'Gion District Walking Tour',
    description: 'Explore the historic geisha district with traditional wooden machiya houses',
    category: 'attraction',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80',
    selected: false
  },
  {
    id: '7',
    name: 'Kaiseki Dinner',
    description: 'Multi-course traditional Japanese haute cuisine experience',
    category: 'food',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    selected: false
  },
  {
    id: '8',
    name: 'Sake Tasting Tour',
    description: 'Visit local breweries and taste premium sake varieties',
    category: 'entertainment',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
    selected: false
  }
]

export default function ThingsToDoPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { trips, updateTrip } = useTrips()
  const [loading, setLoading] = useState(true)
  const [attractions, setAttractions] = useState<Activity[]>([])
  const [filteredAttractions, setFilteredAttractions] = useState<Activity[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])

  const trip = trips.find(t => t.id === tripId)

  useEffect(() => {
    // Load attractions from destinations.json based on trip destination
    if (!trip) return

    setLoading(true)
    fetch('/destinations.json')
      .then(res => res.json())
      .then(data => {
        // Find matching destination
        const destination = data.destinations.find((dest: any) => 
          trip.destination.includes(dest.name) || trip.destination.includes(dest.country)
        )
        
        if (destination && destination.attractions) {
          setAttractions(destination.attractions)
          setFilteredAttractions(destination.attractions)
        } else {
          // Fallback to mock data if no match found
          setAttractions(mockAttractions)
          setFilteredAttractions(mockAttractions)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load attractions:', err)
        // Fallback to mock data
        setAttractions(mockAttractions)
        setFilteredAttractions(mockAttractions)
        setLoading(false)
      })
  }, [trip])

  useEffect(() => {
    // Apply filters
    let filtered = attractions

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(a => selectedCategories.includes(a.category))
    }

    filtered = filtered.filter(a => {
      const price = a.price || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    setFilteredAttractions(filtered)
  }, [selectedCategories, priceRange, attractions])

  const handleToggleAttraction = (attractionId: string) => {
    setAttractions(prev =>
      prev.map(a => (a.id === attractionId ? { ...a, selected: !a.selected } : a))
    )
  }

  const handleNext = () => {
    if (!trip) return

    const selectedAttractions = attractions.filter(a => a.selected)
    updateTrip(trip.id, { activities: selectedAttractions })
    navigate(`/trips/${trip.id}/schedule`)
  }

  const selectedCount = attractions.filter(a => a.selected).length

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Trip not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16">
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Things to Do
              </span>
            </h1>
            <p className="text-2xl text-gray-700 mb-2">{trip.destination}</p>
            <p className="text-gray-600">
              Select activities and attractions for your trip
            </p>
          </motion.div>

          {/* Filter Bar */}
          <FilterBar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
          )}

          {/* Attractions Grid */}
          {!loading && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {filteredAttractions.map((attraction, index) => (
                  <motion.div
                    key={attraction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AttractionCard
                      attraction={attraction}
                      onToggle={() => handleToggleAttraction(attraction.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {filteredAttractions.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">
                    No attractions match your filters. Try adjusting them!
                  </p>
                </div>
              )}

              {/* Next Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-2xl"
                >
                  {selectedCount > 0 ? `Continue with ${selectedCount} selected` : 'Skip to Schedule'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

