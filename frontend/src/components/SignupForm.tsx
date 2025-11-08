import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { useAuth } from '../contexts/AuthContext'
import { authStorage } from '../utils/authStorage'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordValidation = authStorage.validatePassword(password)
  const passwordsMatch = password === passwordConfirm && password.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = register(username, password, passwordConfirm, email)
    
    if (!result.success) {
      setError(result.error || 'Registration failed')
      setLoading(false)
    } else {
      setLoading(false)
      // Success - the AuthContext will handle the state update
    }
  }

  return (
    <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (optional)
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 space-y-1"
              >
                <div className={`flex items-center text-xs ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {password.length >= 8 ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  At least 8 characters
                </div>
                <div className={`flex items-center text-xs ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {/[A-Z]/.test(password) ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  One uppercase letter
                </div>
                <div className={`flex items-center text-xs ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {/[0-9]/.test(password) ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  One number
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Input
                type={showPasswordConfirm ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {passwordConfirm.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-2 flex items-center text-xs ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {passwordsMatch ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </motion.div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={loading || !passwordValidation.valid || !passwordsMatch}
            className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </Card>
  )
}

