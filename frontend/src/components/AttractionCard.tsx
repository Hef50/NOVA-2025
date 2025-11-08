import { motion } from 'framer-motion'
import { DollarSign, Check } from 'lucide-react'
import type { Activity } from '../types/trip'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface AttractionCardProps {
  attraction: Activity
  onToggle: () => void
}

const categoryColors = {
  food: 'bg-orange-100 text-orange-700 border-orange-200',
  attraction: 'bg-purple-100 text-purple-700 border-purple-200',
  entertainment: 'bg-pink-100 text-pink-700 border-pink-200',
  shopping: 'bg-blue-100 text-blue-700 border-blue-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
}

const categoryLabels = {
  food: 'Food',
  attraction: 'Attraction',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  other: 'Other'
}

export default function AttractionCard({ attraction, onToggle }: AttractionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden hover:shadow-xl transition-all ${
        attraction.selected ? 'ring-4 ring-purple-500' : ''
      }`}>
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={attraction.imageUrl}
            alt={attraction.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Selected Overlay */}
          {attraction.selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-purple-600/40 backdrop-blur-[2px] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-10 h-10 text-purple-600" />
              </motion.div>
            </motion.div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={categoryColors[attraction.category]}>
              {categoryLabels[attraction.category]}
            </Badge>
          </div>

          {/* Price Badge */}
          {attraction.price !== undefined && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold">
                {attraction.price === 0 ? 'FREE' : `$${attraction.price}`}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {attraction.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {attraction.description}
          </p>

          {/* Price Info */}
          {attraction.price !== undefined && attraction.price > 0 && (
            <div className="flex items-center text-green-600 mt-3 text-sm font-semibold">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Estimated: ${attraction.price} per person</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

