import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Compass, Calendar, Plane, DollarSign, Package, FileText, Check, PartyPopper } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  order: number
}

export default function TripSubNav() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      id: 'location',
      label: 'Location',
      path: `/plan`,
      icon: <MapPin className="w-4 h-4" />,
      order: 1
    },
    {
      id: 'activities',
      label: 'Activities',
      path: `/trips/${tripId}/things-to-do`,
      icon: <Compass className="w-4 h-4" />,
      order: 2
    },
    {
      id: 'schedule',
      label: 'Schedule',
      path: `/trips/${tripId}/schedule`,
      icon: <Calendar className="w-4 h-4" />,
      order: 3
    },
    {
      id: 'booking',
      label: 'Booking',
      path: `/trips/${tripId}/booking`,
      icon: <Plane className="w-4 h-4" />,
      order: 4
    },
    {
      id: 'budget',
      label: 'Budget',
      path: `/trips/${tripId}/budget`,
      icon: <DollarSign className="w-4 h-4" />,
      order: 5
    },
    {
      id: 'packing',
      label: 'Packing',
      path: `/trips/${tripId}/packing`,
      icon: <Package className="w-4 h-4" />,
      order: 6
    },
    {
      id: 'documents',
      label: 'Documents',
      path: `/trips/${tripId}/documents`,
      icon: <FileText className="w-4 h-4" />,
      order: 7
    },
    {
      id: 'done',
      label: 'Done',
      path: `/trips/${tripId}/done`,
      icon: <PartyPopper className="w-4 h-4" />,
      order: 8
    }
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const isCompleted = (itemId: string) => {
    // Logic to determine if a step is completed
    // For now, just return false - can be enhanced with actual completion tracking
    return false
  }

  return (
    <div className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start gap-2 py-3 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => {
            const active = isActive(item.path)
            const completed = isCompleted(item.id)
            
            return (
              <div key={item.id} className="flex items-center">
                <motion.button
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${active 
                      ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-md' 
                      : completed
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {completed && !active && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
                
                {index < navItems.length - 1 && (
                  <div className="mx-2 text-gray-400 dark:text-gray-600">→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

