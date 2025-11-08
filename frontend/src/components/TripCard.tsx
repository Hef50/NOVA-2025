import { motion } from 'framer-motion'
import { Calendar, MapPin, Package, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Trip } from '../types/trip'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface TripCardProps {
  trip: Trip
  packingProgress: number
  onDelete: (id: string) => void
}

export default function TripCard({ trip, packingProgress, onDelete }: TripCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntil = () => {
    const start = new Date(trip.startDate)
    const today = new Date()
    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntil = getDaysUntil()
  const isUpcoming = daysUntil > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-[2px] shadow-lg hover:shadow-2xl transition-shadow">
        <div className="bg-white rounded-lg h-full">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-orange-100">
            {trip.imageUrl ? (
              <img
                src={trip.imageUrl}
                alt={trip.destination}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-16 h-16 text-purple-300" />
              </div>
            )}
            
            {/* Days Until Badge */}
            {isUpcoming && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-3 right-3"
              >
                <Badge className="bg-white/90 backdrop-blur-sm text-purple-700 font-semibold px-3 py-1">
                  {daysUntil} days
                </Badge>
              </motion.div>
            )}

            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault()
                onDelete(trip.id)
              }}
              className="absolute top-3 left-3 p-2 bg-red-500/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {trip.destination}
            </h3>
            
            {trip.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {trip.description}
              </p>
            )}

            {/* Date Range */}
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>

            {/* Packing Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-1" />
                  <span>Packing Progress</span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  {packingProgress}%
                </span>
              </div>
              <Progress value={packingProgress} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link to={`/trips/${trip.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                >
                  View Details
                </Button>
              </Link>
              <Link to={`/trips/${trip.id}/packing`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white">
                  Start Packing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

