import { motion } from 'framer-motion'
import { Clock, CheckCircle, Circle } from 'lucide-react'
import { Card } from './ui/card'

interface TimelineStep {
  id: string
  label: string
  completed: boolean
  order: number
}

interface TripTimelineProps {
  tripId: string
  steps?: TimelineStep[]
}

const defaultSteps: TimelineStep[] = [
  { id: 'location', label: 'Pick Location', completed: true, order: 1 },
  { id: 'activities', label: 'Select Activities', completed: false, order: 2 },
  { id: 'schedule', label: 'Create Schedule', completed: false, order: 3 },
  { id: 'booking', label: 'Book Travel', completed: false, order: 4 },
  { id: 'budget', label: 'Set Budget', completed: false, order: 5 },
  { id: 'packing', label: 'Pack Items', completed: false, order: 6 },
  { id: 'documents', label: 'Prepare Documents', completed: false, order: 7 },
]

export default function TripTimeline({ tripId, steps = defaultSteps }: TripTimelineProps) {
  const completedCount = steps.filter(step => step.completed).length
  const progress = (completedCount / steps.length) * 100

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <Clock className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Trip Planning Progress
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount} of {steps.length} steps completed
          </span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-600 to-orange-500"
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="flex-shrink-0 mr-4">
              {step.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
              ) : (
                <Circle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  step.completed 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </span>
                {step.completed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-green-600 dark:text-green-400 font-medium"
                  >
                    Completed
                  </motion.span>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="mt-2 ml-4 h-8 border-l-2 border-gray-200 dark:border-gray-700"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-200 dark:border-green-700"
        >
          <p className="text-center text-green-800 dark:text-green-200 font-semibold">
            🎉 All set! You're ready for your trip!
          </p>
        </motion.div>
      )}
    </Card>
  )
}

