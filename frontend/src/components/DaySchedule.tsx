import { motion } from 'framer-motion'
import { GripVertical, Trash2, Clock } from 'lucide-react'
import { Card } from './ui/card'
import type { Activity } from '../types/trip'

interface DayScheduleProps {
  day: number
  date: string
  activities: Activity[]
  onRemoveActivity: (activityId: string) => void
  onDragStart: (e: React.DragEvent, activityId: string, fromDay: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, toDay: number) => void
}

export default function DaySchedule({
  day,
  date,
  activities,
  onRemoveActivity,
  onDragStart,
  onDragOver,
  onDrop
}: DayScheduleProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  const totalCost = activities.reduce((sum, activity) => sum + (activity.price || 0), 0)

  return (
    <Card 
      className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Day {day}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
          <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            ${totalCost}
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Drop activities here or add from the list
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              draggable
              onDragStart={(e) => onDragStart(e, activity.id, day)}
              className="group relative flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all cursor-move"
            >
              <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {index === 0 ? 'Morning' : index === 1 ? 'Afternoon' : 'Evening'}
                  </p>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {activity.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {activity.description}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  ${activity.price || 0}
                </span>
                <button
                  onClick={() => onRemoveActivity(activity.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  )
}

