import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Save } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import { Button } from './ui/button'
import DaySchedule from './DaySchedule'
import TripSubNav from './TripSubNav'
import WeatherForecast from './WeatherForecast'
import type { Activity, DaySchedule as DayScheduleType } from '../types/trip'

export default function SchedulePage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { trips, updateTrip } = useTrips()
  const [schedule, setSchedule] = useState<DayScheduleType[]>([])
  const [draggedActivity, setDraggedActivity] = useState<{ id: string; fromDay: number } | null>(null)

  const trip = trips.find(t => t.id === tripId)

  useEffect(() => {
    if (!trip) return

    // Check if schedule already exists
    if (trip.schedule && trip.schedule.length > 0) {
      setSchedule(trip.schedule)
      return
    }

    // Generate schedule from trip dates
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Auto-distribute selected activities across days
    const selectedActivities = trip.activities?.filter(a => a.selected) || []
    const activitiesPerDay = Math.ceil(selectedActivities.length / days)

    const newSchedule: DayScheduleType[] = []
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(start)
      dayDate.setDate(start.getDate() + i)
      
      const dayActivities = selectedActivities.slice(
        i * activitiesPerDay,
        (i + 1) * activitiesPerDay
      )

      newSchedule.push({
        day: i + 1,
        date: dayDate.toISOString(),
        activities: dayActivities
      })
    }

    setSchedule(newSchedule)
  }, [trip])

  const handleDragStart = (e: React.DragEvent, activityId: string, fromDay: number) => {
    setDraggedActivity({ id: activityId, fromDay })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toDay: number) => {
    e.preventDefault()
    
    if (!draggedActivity) return

    const { id, fromDay } = draggedActivity

    if (fromDay === toDay) {
      setDraggedActivity(null)
      return
    }

    // Find the activity
    const fromDaySchedule = schedule.find(d => d.day === fromDay)
    const activity = fromDaySchedule?.activities.find(a => a.id === id)

    if (!activity) return

    // Remove from old day and add to new day
    const newSchedule = schedule.map(daySchedule => {
      if (daySchedule.day === fromDay) {
        return {
          ...daySchedule,
          activities: daySchedule.activities.filter(a => a.id !== id)
        }
      }
      if (daySchedule.day === toDay) {
        return {
          ...daySchedule,
          activities: [...daySchedule.activities, activity]
        }
      }
      return daySchedule
    })

    setSchedule(newSchedule)
    setDraggedActivity(null)
  }

  const handleRemoveActivity = (dayNumber: number, activityId: string) => {
    const newSchedule = schedule.map(daySchedule => {
      if (daySchedule.day === dayNumber) {
        return {
          ...daySchedule,
          activities: daySchedule.activities.filter(a => a.id !== activityId)
        }
      }
      return daySchedule
    })
    setSchedule(newSchedule)
  }

  const handleSaveSchedule = () => {
    if (!trip) return
    updateTrip(trip.id, { schedule })
    navigate(`/trips/${trip.id}/packing`)
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Trip not found</p>
      </div>
    )
  }

  const totalCost = schedule.reduce((sum, day) => 
    sum + day.activities.reduce((daySum, activity) => daySum + (activity.price || 0), 0), 0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
      <TripSubNav />
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Trip Schedule
              </span>
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">{trip.destination}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop activities to organize your perfect itinerary
            </p>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Days</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{schedule.length}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {schedule.reduce((sum, day) => sum + day.activities.length, 0)}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Cost</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${totalCost}</p>
            </div>
          </motion.div>

          {/* Weather Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <WeatherForecast
              destination={trip.destination}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />
          </motion.div>

          {/* Schedule Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {schedule.map((daySchedule, index) => (
              <motion.div
                key={daySchedule.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <DaySchedule
                  day={daySchedule.day}
                  date={daySchedule.date}
                  activities={daySchedule.activities}
                  onRemoveActivity={(activityId) => handleRemoveActivity(daySchedule.day, activityId)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <Button
              onClick={handleSaveSchedule}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Schedule
            </Button>
            <Button
              onClick={handleSaveSchedule}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg"
            >
              Continue to Packing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

