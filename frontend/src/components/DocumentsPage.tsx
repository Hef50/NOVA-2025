import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Calendar, AlertCircle, Globe, ExternalLink, Loader2, CheckCircle } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ChecklistWidget from './ChecklistWidget'
import TripSubNav from './TripSubNav'

interface VisaInfo {
  required: boolean
  type: string
  processingTime: string
  cost: string
  requirements: string[]
  embassyLink: string
  notes: string
}

interface Document {
  id: string
  type: string
  name: string
  number: string
  expiryDate: string
  notes: string
}

const DOCUMENT_TYPES = [
  'Passport',
  'Visa',
  'Travel Insurance',
  'Flight Ticket',
  'Hotel Booking',
  'Vaccination Certificate',
  'Driver\'s License',
  'Other'
]

export default function DocumentsPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trips } = useTrips()
  const [documents, setDocuments] = useState<Document[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [visaInfo, setVisaInfo] = useState<VisaInfo | null>(null)
  const [loadingVisa, setLoadingVisa] = useState(false)
  const [newDoc, setNewDoc] = useState({
    type: 'Passport',
    name: '',
    number: '',
    expiryDate: '',
    notes: ''
  })

  const trip = trips.find(t => t.id === tripId)

  // Fetch visa requirements when component mounts
  useEffect(() => {
    if (!trip) return
    
    const fetchVisaInfo = async () => {
      setLoadingVisa(true)
      try {
        // Extract country from destination (e.g., "Paris, France" -> "France")
        const country = trip.destination.split(',').pop()?.trim() || trip.destination
        
        const response = await fetch('http://localhost:8000/get_visa_requirements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ destination: country })
        })

        if (response.ok) {
          const data = await response.json()
          setVisaInfo(data.visa_info)
        }
      } catch (error) {
        console.error('Error fetching visa info:', error)
        // Set default info if API fails
        setVisaInfo({
          required: true,
          type: 'Tourist Visa',
          processingTime: '2-4 weeks',
          cost: 'Varies by nationality',
          requirements: [
            'Valid passport (6 months validity)',
            'Completed visa application form',
            'Recent passport-sized photographs',
            'Proof of accommodation',
            'Proof of sufficient funds',
            'Return flight tickets'
          ],
          embassyLink: `https://www.google.com/search?q=${encodeURIComponent(trip.destination + ' embassy visa requirements')}`,
          notes: 'Please verify requirements with your local embassy as they may vary by nationality.'
        })
      } finally {
        setLoadingVisa(false)
      }
    }

    fetchVisaInfo()
  }, [trip])

  const handleAddDocument = () => {
    if (!newDoc.name) return

    const document: Document = {
      id: `doc-${Date.now()}`,
      ...newDoc
    }

    setDocuments([...documents, document])
    setNewDoc({ type: 'Passport', name: '', number: '', expiryDate: '', notes: '' })
    setShowAddForm(false)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90 // Expiring within 90 days
  }

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Trip not found</p>
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
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Travel Documents
              </span>
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">{trip.destination}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Keep track of all your important travel documents
            </p>
          </motion.div>

          {/* Visa Requirements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Visa Requirements for {trip.destination.split(',').pop()?.trim()}
                </h2>
              </div>

              {loadingVisa ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading visa information...</span>
                </div>
              ) : visaInfo ? (
                <div className="space-y-6">
                  {/* Visa Status */}
                  <div className={`p-4 rounded-lg ${visaInfo.required ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-800'}`}>
                    <div className="flex items-center gap-2">
                      {visaInfo.required ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      <span className={`font-semibold ${visaInfo.required ? 'text-yellow-800 dark:text-yellow-300' : 'text-green-800 dark:text-green-300'}`}>
                        {visaInfo.required ? 'Visa Required' : 'No Visa Required'}
                      </span>
                    </div>
                  </div>

                  {visaInfo.required && (
                    <>
                      {/* Visa Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Visa Type</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{visaInfo.type}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Processing Time</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{visaInfo.processingTime}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Cost</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{visaInfo.cost}</p>
                        </div>
                      </div>

                      {/* Requirements List */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Required Documents:</h3>
                        <ul className="space-y-2">
                          {visaInfo.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Notes */}
                      {visaInfo.notes && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{visaInfo.notes}</p>
                        </div>
                      )}

                      {/* Embassy Link */}
                      <Button
                        onClick={() => window.open(visaInfo.embassyLink, '_blank')}
                        className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Embassy Website for More Information
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Unable to load visa information. Please check with your local embassy.
                </p>
              )}
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Documents List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Documents
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-orange-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </div>

                {/* Add Document Form */}
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="space-y-3">
                      <select
                        value={newDoc.type}
                        onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {DOCUMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <Input
                        type="text"
                        placeholder="Document name"
                        value={newDoc.name}
                        onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                      />
                      <Input
                        type="text"
                        placeholder="Document number"
                        value={newDoc.number}
                        onChange={(e) => setNewDoc({ ...newDoc, number: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Expiry Date
                        </label>
                        <Input
                          type="date"
                          value={newDoc.expiryDate}
                          onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                        />
                      </div>
                      <Input
                        type="text"
                        placeholder="Notes (optional)"
                        value={newDoc.notes}
                        onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAddDocument} className="flex-1">Add</Button>
                        <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Documents List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {documents.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                      No documents added yet
                    </p>
                  ) : (
                    documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg group ${
                          isExpired(doc.expiryDate)
                            ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800'
                            : isExpiringSoon(doc.expiryDate)
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800'
                            : 'bg-gray-50 dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {doc.type}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {doc.name}
                            </h3>
                            {doc.number && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                #{doc.number}
                              </p>
                            )}
                            {doc.expiryDate && (
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className={
                                  isExpired(doc.expiryDate)
                                    ? 'text-red-600 dark:text-red-400 font-semibold'
                                    : isExpiringSoon(doc.expiryDate)
                                    ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                                    : 'text-gray-600 dark:text-gray-400'
                                }>
                                  Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                </span>
                                {(isExpired(doc.expiryDate) || isExpiringSoon(doc.expiryDate)) && (
                                  <AlertCircle className="w-4 h-4 ml-1" />
                                )}
                              </div>
                            )}
                            {doc.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {doc.notes}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Pre-Trip Checklist */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Pre-Trip Checklist
                </h2>
                <ChecklistWidget />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

