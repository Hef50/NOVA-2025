import { motion } from 'framer-motion'
import { Plus, Sparkles, Wand2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useTrips } from '../hooks/useTrips'
import TripCard from './TripCard'
import CountdownTimer from './CountdownTimer'
import { createDemoTrips } from '../utils/demoData'

export default function Dashboard() {
  const { trips, loading, deleteTrip, upcomingTrips, getPackingProgress, addTrip } = useTrips()

  const loadDemoData = () => {
    const demoTrips = createDemoTrips()
    demoTrips.forEach(trip => addTrip(trip))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl sm:text-6xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Your Travel
              </span>
              <br />
              <span className="text-gray-900">Dashboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Plan, pack, and explore with AI-powered travel assistance
            </motion.p>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Trips</p>
                  <p className="text-3xl font-bold text-gray-900">{trips.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingTrips.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Packing</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {trips.length > 0
                      ? Math.round(
                          trips.reduce((sum, trip) => sum + getPackingProgress(trip.id), 0) /
                            trips.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Empty State */}
          {trips.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center py-20"
            >
              <Card className="max-w-2xl mx-auto p-12 bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Plus className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready for your next adventure?
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start planning your dream trip with AI-powered recommendations and smart packing assistance
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/plan">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Plan Your First Trip
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={loadDemoData}
                    className="border-2 border-purple-300 hover:bg-purple-50 font-semibold px-8 py-6 text-lg"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Load Demo Trips
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Countdown Timer for Next Trip */}
          {upcomingTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <CountdownTimer
                targetDate={upcomingTrips[0].startDate}
                label={`Countdown to ${upcomingTrips[0].destination}`}
              />
            </motion.div>
          )}

          {/* Trip Cards Grid */}
          {trips.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <TripCard
                    trip={trip}
                    packingProgress={getPackingProgress(trip.id)}
                    onDelete={deleteTrip}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

