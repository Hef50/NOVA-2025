import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Trash2, LogOut, Users } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { authStorage } from '../utils/authStorage'

export default function AccountPage() {
  const { currentUser, isLoggedIn, logout, deleteAccount } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [viewMode, setViewMode] = useState<'login' | 'signup'>('login')

  const allUsers = authStorage.getUsers()

  const handleDeleteAccount = () => {
    if (currentUser) {
      deleteAccount(currentUser)
      setShowDeleteConfirm(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
        <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Account
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xl">
                {viewMode === 'login' ? 'Login to your account' : 'Create a new account'}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {viewMode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <LoginForm onSwitchToSignup={() => setViewMode('signup')} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SignupForm onSwitchToLogin={() => setViewMode('login')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Manage your Vacai account
            </p>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentUser}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Member since {new Date(allUsers.find(u => u.username === currentUser)?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* All Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Users className="w-6 h-6 mr-3 text-purple-500" />
                All Accounts
              </h2>
              <div className="space-y-3">
                {allUsers.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.username}
                        {user.username === currentUser && (
                          <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </p>
                      {user.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        if (user.username === currentUser) {
                          setShowDeleteConfirm(true)
                        } else {
                          deleteAccount(user.username)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Delete Account Confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800">
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-3">
                    Delete Account?
                  </h3>
                  <p className="text-red-700 dark:text-red-400 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone.
                    All your trips and data will be lost.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, Delete Account
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

