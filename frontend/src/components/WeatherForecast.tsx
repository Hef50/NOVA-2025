import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react'
import { Card } from './ui/card'

interface WeatherDay {
  date: string
  temp: number
  condition: string
  humidity: number
  windSpeed: number
}

interface WeatherForecastProps {
  destination: string
  startDate: string
  endDate: string
}

export default function WeatherForecast({ destination, startDate, endDate }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate mock weather data based on destination and dates
    // In a real app, this would call a weather API like OpenWeatherMap
    const generateMockWeather = () => {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      
      const mockData: WeatherDay[] = []
      for (let i = 0; i < Math.min(days, 7); i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        
        mockData.push({
          date: date.toISOString(),
          temp: Math.floor(Math.random() * 20) + 15, // 15-35°C
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
        })
      }
      
      setForecast(mockData)
      setLoading(false)
    }

    setTimeout(generateMockWeather, 500)
  }, [destination, startDate, endDate])

  const getWeatherIcon = (condition: string) => {
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

  const getPackingSuggestions = () => {
    const conditions = forecast.map(day => day.condition)
    const avgTemp = forecast.reduce((sum, day) => sum + day.temp, 0) / forecast.length
    
    const suggestions: string[] = []
    
    if (avgTemp > 25) {
      suggestions.push('Light, breathable clothing')
      suggestions.push('Sunscreen and sunglasses')
    } else if (avgTemp < 15) {
      suggestions.push('Warm jacket or coat')
      suggestions.push('Long pants and sweaters')
    }
    
    if (conditions.includes('Rainy')) {
      suggestions.push('Umbrella or rain jacket')
      suggestions.push('Waterproof shoes')
    }
    
    if (forecast.some(day => day.windSpeed > 15)) {
      suggestions.push('Windbreaker')
    }
    
    return suggestions
  }

  if (loading) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </Card>
    )
  }

  const suggestions = getPackingSuggestions()

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <Cloud className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Weather Forecast
        </h2>
      </div>

      {/* 7-Day Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <div className="flex justify-center mb-2">
              {getWeatherIcon(day.condition)}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {day.temp}°C
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {day.condition}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Avg Temp</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(forecast.reduce((sum, day) => sum + day.temp, 0) / forecast.length)}°C
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Droplets className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length)}%
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wind className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Wind</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length)} km/h
          </p>
        </div>
      </div>

      {/* Packing Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-3">
            Weather-Based Packing Suggestions
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

