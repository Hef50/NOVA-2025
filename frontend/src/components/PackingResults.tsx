import { motion } from 'framer-motion'
import { Check, X, ShoppingBag, RotateCcw, PartyPopper } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface PackingResultsProps {
  packed: string[]
  missing: string[]
  confidence?: Record<string, number>
  onReset: () => void
}

const getBuyLink = (itemName: string): string => {
  const searchQuery = encodeURIComponent(itemName + ' travel')
  return `https://www.amazon.com/s?k=${searchQuery}`
}

export default function PackingResults({ packed, missing, confidence = {}, onReset }: PackingResultsProps) {
  const allPacked = missing.length === 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Message */}
      {allPacked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <PartyPopper className="w-20 h-20 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            Perfect! You're All Set! 🎉
          </h2>
          <p className="text-gray-600">
            You've packed everything on your list. Have an amazing trip!
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Packed Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-green-50/80 backdrop-blur-sm border-2 border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900">You Packed</h3>
                <p className="text-sm text-green-700">{packed.length} items detected</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {packed.map((item, index) => {
                const itemConfidence = confidence[item] || 0.8
                const confidencePercent = Math.round(itemConfidence * 100)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center flex-1">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{item}</span>
                      </div>
                      <Badge 
                        variant={confidencePercent >= 80 ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {confidencePercent}% confident
                      </Badge>
                    </div>
                    <div className="ml-8">
                      <Progress value={confidencePercent} className="h-1" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Missing Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-red-50/80 backdrop-blur-sm border-2 border-red-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <X className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">You Forgot</h3>
                <p className="text-sm text-red-700">{missing.length} items missing</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {missing.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Nothing missing! You're all set! 🎉
                </p>
              ) : (
                missing.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center flex-1">
                      <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{item}</span>
                    </div>
                    <a
                      href={getBuyLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 ml-2"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Buy
                      </Button>
                    </a>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4"
      >
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="border-2 border-purple-300 hover:bg-purple-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Scan Again
        </Button>
        {missing.length > 0 && (
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            onClick={() => {
              const allLinks = missing.map(item => getBuyLink(item))
              allLinks.forEach(link => window.open(link, '_blank'))
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop All Missing Items
          </Button>
        )}
      </motion.div>
    </div>
  )
}

