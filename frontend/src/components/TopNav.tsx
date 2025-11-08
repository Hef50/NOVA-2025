import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, User, Settings } from 'lucide-react'
import { Button } from './ui/button'

export default function TopNav() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Plane className="w-6 h-6 text-purple-600" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              NovaNomad
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`relative ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Dashboard
                {isActive('/') && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                  />
                )}
              </Button>
            </Link>
            <Link to="/plan">
              <Button
                variant={isActive('/plan') ? 'default' : 'ghost'}
                className={`relative ${
                  isActive('/plan')
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Plan New Trip
                {isActive('/plan') && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                  />
                )}
              </Button>
            </Link>
          </div>

          {/* Account & Settings */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

