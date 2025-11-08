import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Hotel, Loader2, ExternalLink, DollarSign, ArrowRight } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import TripSubNav from './TripSubNav'
import { useToast } from '../hooks/use-toast'

interface Deal {
  name: string
  url: string
  description: string
  estimated_price: string
}

export default function BookingPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { trips } = useTrips()
  const { toast } = useToast()
  const [flightDeals, setFlightDeals] = useState<Deal[]>([])
  const [hotelDeals, setHotelDeals] = useState<Deal[]>([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [loadingHotels, setLoadingHotels] = useState(false)

  const trip = trips.find(t => t.id === tripId)

  useEffect(() => {
    if (!trip) return

    // Fetch flight deals
    const fetchFlightDeals = async () => {
      setLoadingFlights(true)
      try {
        const response = await fetch('http://localhost:8000/search_travel_deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: trip.destination,
            start_date: new Date(trip.startDate).toISOString().split('T')[0],
            end_date: new Date(trip.endDate).toISOString().split('T')[0],
            deal_type: 'flight'
          })
        })

        if (response.ok) {
          const data = await response.json()
          setFlightDeals(data.deals || [])
        }
      } catch (error) {
        console.error('Error fetching flight deals:', error)
      } finally {
        setLoadingFlights(false)
      }
    }

    // Fetch hotel deals
    const fetchHotelDeals = async () => {
      setLoadingHotels(true)
      try {
        const response = await fetch('http://localhost:8000/search_travel_deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: trip.destination,
            start_date: new Date(trip.startDate).toISOString().split('T')[0],
            end_date: new Date(trip.endDate).toISOString().split('T')[0],
            deal_type: 'hotel'
          })
        })

        if (response.ok) {
          const data = await response.json()
          setHotelDeals(data.deals || [])
        }
      } catch (error) {
        console.error('Error fetching hotel deals:', error)
      } finally {
        setLoadingHotels(false)
      }
    }

    fetchFlightDeals()
    fetchHotelDeals()
  }, [trip])

  const handleAddToBudget = (dealName: string, category: 'flight' | 'hotel') => {
    // Navigate to budget page with a query parameter
    toast({
      title: 'Added to Budget',
      description: `${dealName} has been added to your budget tracker.`,
    })
    
    // Store in localStorage for budget page to pick up
    const budgetItem = {
      tripId: tripId,
      category: category === 'flight' ? 'Transport' : 'Accommodation',
      name: dealName,
      timestamp: Date.now()
    }
    localStorage.setItem('pendingBudgetItem', JSON.stringify(budgetItem))
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Trip not found</p>
      </div>
    )
  }

  const renderDeals = (deals: Deal[], loading: boolean, type: 'flight' | 'hotel') => {
    const fallbackSites = type === 'flight' ? [
      { name: 'Expedia', url: `https://www.expedia.com/Flights`, icon: '✈️' },
      { name: 'Kayak', url: `https://www.kayak.com/flights`, icon: '🔍' },
      { name: 'Skyscanner', url: `https://www.skyscanner.com/`, icon: '🌍' },
      { name: 'Google Flights', url: `https://www.google.com/travel/flights`, icon: '🔎' },
      { name: 'Momondo', url: `https://www.momondo.com/`, icon: '🎯' }
    ] : [
      { name: 'Booking.com', url: `https://www.booking.com/`, icon: '🏨' },
      { name: 'Hotels.com', url: `https://www.hotels.com/`, icon: '🛏️' },
      { name: 'Expedia Hotels', url: `https://www.expedia.com/Hotels`, icon: '🏢' },
      { name: 'Airbnb', url: `https://www.airbnb.com/`, icon: '🏡' },
      { name: 'Trivago', url: `https://www.trivago.com/`, icon: '🔍' }
    ]
    
    if (loading) {
      return (
        <div className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Searching for the best {type} deals...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Consulting multiple travel websites
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {fallbackSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border-2 border-purple-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-2">{site.icon}</div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{site.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    if (deals.length === 0) {
      return (
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              We couldn't find specific deals, but here are the best sites to search:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fallbackSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{site.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {site.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Search {type}s to {trip.destination}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(site.url, '_blank')}
                      className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {deals.map((deal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {deal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {deal.description}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {deal.estimated_price}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => window.open(deal.url, '_blank')}
                    size="sm"
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Deal
                  </Button>
                  <Button
                    onClick={() => handleAddToBudget(deal.name, type)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white whitespace-nowrap"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add to Budget
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
      <TripSubNav />
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Book Your Travel
              </span>
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">{trip.destination}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </motion.div>

          {/* Tabs for Flights and Hotels */}
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="flights">
                <Plane className="w-4 h-4 mr-2" />
                Flights
              </TabsTrigger>
              <TabsTrigger value="hotels">
                <Hotel className="w-4 h-4 mr-2" />
                Hotels
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Best Flight Deals
                </h2>
                {renderDeals(flightDeals, loadingFlights, 'flight')}
              </motion.div>
            </TabsContent>

            <TabsContent value="hotels">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Best Hotel Deals
                </h2>
                {renderDeals(hotelDeals, loadingHotels, 'hotel')}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Button
              onClick={() => navigate(`/trips/${tripId}/budget`)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Budget
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

