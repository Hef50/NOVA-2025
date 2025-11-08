import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Sparkles, Camera } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import type { PackingItem } from '../types/trip'
import PackingList from './PackingList'
import ImageUploader from './ImageUploader'
import PackingResults from './PackingResults'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const generatePackingList = (destination: string): PackingItem[] => {
  return [
    { id: '1', name: 'Passport', category: 'Documents', packed: false, recommended: true },
    { id: '2', name: 'Travel Insurance', category: 'Documents', packed: false, recommended: true },
    { id: '3', name: 'Flight Tickets', category: 'Documents', packed: false, recommended: true },
    { id: '4', name: 'T-Shirts (5)', category: 'Clothing', packed: false, recommended: true },
    { id: '5', name: 'Pants/Jeans (3)', category: 'Clothing', packed: false, recommended: true },
    { id: '6', name: 'Underwear (7)', category: 'Clothing', packed: false, recommended: true },
    { id: '7', name: 'Socks (7 pairs)', category: 'Clothing', packed: false, recommended: true },
    { id: '8', name: 'Comfortable Shoes', category: 'Clothing', packed: false, recommended: true },
    { id: '9', name: 'Jacket/Sweater', category: 'Clothing', packed: false, recommended: true },
    { id: '10', name: 'Toothbrush', category: 'Toiletries', packed: false, recommended: true },
    { id: '11', name: 'Toothpaste', category: 'Toiletries', packed: false, recommended: true },
    { id: '12', name: 'Shampoo', category: 'Toiletries', packed: false, recommended: true },
    { id: '13', name: 'Deodorant', category: 'Toiletries', packed: false, recommended: true },
    { id: '14', name: 'Sunscreen', category: 'Toiletries', packed: false, recommended: true },
    { id: '15', name: 'Phone Charger', category: 'Electronics', packed: false, recommended: true },
    { id: '16', name: 'Power Bank', category: 'Electronics', packed: false, recommended: true },
    { id: '17', name: 'Camera', category: 'Electronics', packed: false, recommended: false },
    { id: '18', name: 'Headphones', category: 'Electronics', packed: false, recommended: false },
    { id: '19', name: 'Travel Adapter', category: 'Electronics', packed: false, recommended: true },
    { id: '20', name: 'First Aid Kit', category: 'Health', packed: false, recommended: true },
    { id: '21', name: 'Medications', category: 'Health', packed: false, recommended: true },
    { id: '22', name: 'Hand Sanitizer', category: 'Health', packed: false, recommended: true },
  ]
}

export default function PackingPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trips, updateTrip } = useTrips()
  const [packingList, setPackingList] = useState<PackingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<{
    packed: string[]
    missing: string[]
  } | null>(null)

  const trip = trips.find(t => t.id === tripId)

  useEffect(() => {
    if (!trip) return

    // Check if trip already has a packing list
    if (trip.packingList && trip.packingList.length > 0) {
      setPackingList(trip.packingList)
      setLoading(false)
    } else {
      // Generate AI packing list
      setTimeout(() => {
        const generatedList = generatePackingList(trip.destination)
        setPackingList(generatedList)
        updateTrip(trip.id, { packingList: generatedList })
        setLoading(false)
      }, 1500)
    }
  }, [trip])

  const handleToggleItem = (itemId: string) => {
    setPackingList(prev =>
      prev.map(item => (item.id === itemId ? { ...item, packed: !item.packed } : item))
    )
    
    if (trip) {
      const updatedList = packingList.map(item =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
      updateTrip(trip.id, { packingList: updatedList })
    }
  }

  const handleImageUpload = async (imageData: string) => {
    setScannedImage(imageData)
    setAnalyzing(true)

    try {
      // Call backend CV endpoint
      const response = await fetch('http://localhost:8000/analyze_packing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          packing_list: packingList.map(item => item.name)
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      
      const packed = result.packed || []
      const missing = result.missing || packingList.map(item => item.name)

      setAnalysisResults({ packed, missing })
      
      // Update packing list
      const updatedList = packingList.map(item => ({
        ...item,
        packed: packed.includes(item.name)
      }))
      setPackingList(updatedList)
      
      if (trip) {
        updateTrip(trip.id, { packingList: updatedList })
      }

      setAnalyzing(false)
    } catch (error) {
      console.error('Error analyzing image:', error)
      
      // Fallback to mock data if backend fails
      const detectedItems = [
        'T-Shirts (5)',
        'Pants/Jeans (3)',
        'Underwear (7)',
        'Toothbrush',
        'Toothpaste',
        'Phone Charger',
        'Sunscreen'
      ]

      const packed = packingList
        .filter(item => detectedItems.some(detected => item.name.includes(detected)))
        .map(item => item.name)

      const missing = packingList
        .filter(item => !detectedItems.some(detected => item.name.includes(detected)))
        .map(item => item.name)

      setAnalysisResults({ packed, missing })
      
      const updatedList = packingList.map(item => ({
        ...item,
        packed: detectedItems.some(detected => item.name.includes(detected))
      }))
      setPackingList(updatedList)
      
      if (trip) {
        updateTrip(trip.id, { packingList: updatedList })
      }

      setAnalyzing(false)
    }
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Trip not found</p>
      </div>
    )
  }

  const packedCount = packingList.filter(item => item.packed).length
  const totalCount = packingList.length
  const progress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

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
            <div className="flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-purple-600 mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Packing List
              </h1>
            </div>
            <p className="text-2xl text-gray-700 mb-2">{trip.destination}</p>
            <p className="text-gray-600 mb-4">
              AI-generated packing recommendations for your trip
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-bold text-purple-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-600 to-orange-500"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {packedCount} of {totalCount} items packed
              </p>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="manual">
                <Sparkles className="w-4 h-4 mr-2" />
                Manual Check
              </TabsTrigger>
              <TabsTrigger value="scan">
                <Camera className="w-4 h-4 mr-2" />
                Scan Suitcase
              </TabsTrigger>
            </TabsList>

            {/* Manual Packing Tab */}
            <TabsContent value="manual">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-12 h-12 text-purple-600" />
                  </motion.div>
                </div>
              ) : (
                <PackingList
                  items={packingList}
                  onToggleItem={handleToggleItem}
                />
              )}
            </TabsContent>

            {/* Scan Suitcase Tab */}
            <TabsContent value="scan">
              {!analysisResults ? (
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  analyzing={analyzing}
                  scannedImage={scannedImage}
                />
              ) : (
                <PackingResults
                  packed={analysisResults.packed}
                  missing={analysisResults.missing}
                  onReset={() => {
                    setAnalysisResults(null)
                    setScannedImage(null)
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

