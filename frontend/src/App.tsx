import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Dashboard from './components/Dashboard'
import ChatPage from './components/ChatPage'
import ThingsToDoPage from './components/ThingsToDoPage'
import SchedulePage from './components/SchedulePage'
import BookingPage from './components/BookingPage'
import DonePage from './components/DonePage'
import BudgetPage from './components/BudgetPage'
import DocumentsPage from './components/DocumentsPage'
import PackingPage from './components/PackingPage'
import SettingsPage from './components/SettingsPage'
import AccountPage from './components/AccountPage'
import TopNav from './components/TopNav'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AuthProvider } from './contexts/AuthContext'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/plan"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatPage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/things-to-do"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ThingsToDoPage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/schedule"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SchedulePage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/booking"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingPage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/budget"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <BudgetPage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/documents"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentsPage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/done"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DonePage />
            </motion.div>
          }
        />
        <Route
          path="/trips/:tripId/packing"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PackingPage />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPage />
            </motion.div>
          }
        />
        <Route
          path="/account"
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AccountPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900">
              <TopNav />
              <AnimatedRoutes />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
