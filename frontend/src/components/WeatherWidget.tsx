import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react'
import { Card } from './ui/card'

interface WeatherWidgetProps {
  destination: string
  startDate: string
  endDate: string
}

// Mock weather data generator
function generateMockWeather(destination: string, date: string) {
  // Simple hash function to generate consistent weather for same destination+date
  const hash = (destination + date).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy']
  const condition = conditions[hash % conditions.length]
  
  const baseTemp = 15 + (hash % 20)
  const highTemp = baseTemp + 5 + (hash % 10)
  const lowTemp = baseTemp - 5
  
  const humidity = 40 + (hash % 40)
  const windSpeed = 5 + (hash % 20)
  
  return {
    condition,
    highTemp,
    lowTemp,
    humidity,
    windSpeed
  }
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'Sunny':
      return <Sun className="w-8 h-8 text-yellow-500" />
    case 'Partly Cloudy':
      return <Cloud className="w-8 h-8 text-gray-400" />
    case 'Cloudy':
      return <Cloud className="w-8 h-8 text-gray-500" />
    case 'Rainy':
      return <CloudRain className="w-8 h-8 text-blue-500" />
    default:
      return <Sun className="w-8 h-8 text-yellow-500" />
  }
}

export default function WeatherWidget({ destination, startDate, endDate }: WeatherWidgetProps) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.min(Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1, 7)
  
  const forecast = []
  for (let i = 0; i < days; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const weather = generateMockWeather(destination, date.toISOString())
    forecast.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      ...weather
    })
  }

  const avgHighTemp = Math.round(forecast.reduce((sum, day) => sum + day.highTemp, 0) / forecast.length)
  const avgLowTemp = Math.round(forecast.reduce((sum, day) => sum + day.lowTemp, 0) / forecast.length)

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <Cloud className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Weather Forecast
        </h2>
      </div>

      {/* Average Temperature */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Temperature</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {avgHighTemp}°C / {avgLowTemp}°C
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          High / Low during your trip
        </p>
      </div>

      {/* Daily Forecast */}
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              {getWeatherIcon(day.condition)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{day.date}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{day.condition}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-1">Temp</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {day.highTemp}° / {day.lowTemp}°
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Droplets className="w-4 h-4" />
                <span>{day.humidity}%</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Wind className="w-4 h-4" />
                <span>{day.windSpeed} km/h</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        * Mock weather data for demonstration purposes
      </p>
    </Card>
  )
}

