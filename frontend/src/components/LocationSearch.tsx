import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import RecommendationCard from './RecommendationCard'
import { Loader2 } from 'lucide-react'

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
  const [priceRange] = useState<[number, number]>([0, 5000]) // Assuming a fixed range for now

  const toPriceString = (range: [number, number]) => {
    const [min, max] = range
    if (max >= 5000) return `$${min}+`
    return `$${min}-${max}`
  }

  // This function converts the AI's response into a format our cards can use.
  const normalizeAIResponse = (recs: any[]): Location[] => {
    if (!Array.isArray(recs)) return []
    
    return recs.map((r, idx) => {
      const destRaw: string = r.destination || r.title || 'Unknown Destination'
      const [name, ...countryParts] = destRaw.split(',').map((s: string) => s.trim())
      const country = countryParts.join(', ') || 'Explore'
      const description = r.summary || 'A wonderful place to visit.'
      const imgQuery = encodeURIComponent(`${name} ${country} travel`)
      const imageUrl = `https://source.unsplash.com/featured/800x600/?${imgQuery}&sig=${idx}`
      
      return {
        id: `ai-${Date.now()}-${idx}`,
        name: name || destRaw,
        country,
        description,
        imageUrl,
        bestDeal: idx === 0, // Highlight the first result
        price: r.price_estimate || 'Varies',
        highlights: description.split(/[.,;]/).slice(0, 3).map((s: string) => s.trim()).filter(Boolean),
      }
    })
  }

  const handleSearch = async () => {
    if (!propStartDate || !propEndDate) {
      alert('Please select trip dates first.')
      return
    }
    setSearching(true)
    setRecommendations([])

    const preferences = {
      location: searchQuery || 'Anywhere with good vibes',
      dates: `${propStartDate} to ${propEndDate}`,
      price: toPriceString(priceRange),
    }

    try {
      const response = await fetch('http://localhost:8000/vacation_recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const normalizedRecs = normalizeAIResponse(data.recommendations)
      setRecommendations(normalizedRecs)

    } catch (error) {
      console.error('Failed to get AI recommendations:', error)
      // Optionally, set an error state to show in the UI
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row gap-3"
      >
        <Input
          placeholder="e.g., 'a relaxing beach vacation' or 'Tokyo'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={searching || !propStartDate || !propEndDate} className="min-w-[200px]">
          {searching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Get AI Recommendations'}
        </Button>
      </motion.div>

      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations.map((loc) => (
              <RecommendationCard
                key={loc.id}
                location={loc}
                onSelect={() => onSelectLocation(loc)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!searching && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-600 dark:text-gray-400"
        >
          Enter your travel ideas and let AI find the perfect spot for you.
        </motion.div>
      )}
    </div>
  )
}