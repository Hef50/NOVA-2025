import { motion } from 'framer-motion'
import { MapPin, DollarSign, Star, Sparkles } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

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

interface RecommendationCardProps {
  location: Location
  onSelect: () => void
}

export default function RecommendationCard({ location, onSelect }: RecommendationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-shadow bg-white">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={location.imageUrl}
            alt={location.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Best Deal Badge */}
          {location.bestDeal && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute top-4 right-4"
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-3 py-1.5 shadow-lg">
                <Star className="w-3 h-3 mr-1 inline" />
                BEST DEAL
              </Badge>
            </motion.div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Location Name */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold mb-1">{location.name}</h3>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{location.country}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {location.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {location.highlights.map((highlight, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-purple-200 text-purple-700 bg-purple-50"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {highlight}
              </Badge>
            ))}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-700">
              <DollarSign className="w-5 h-5 text-green-600 mr-1" />
              <span className="font-semibold">{location.price}</span>
            </div>
            <Button
              onClick={onSelect}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
            >
              Select Destination
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

