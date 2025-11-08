import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Dashboard from './components/Dashboard'
import ChatPage from './components/ChatPage'
import ThingsToDoPage from './components/ThingsToDoPage'
import PackingPage from './components/PackingPage'
import TopNav from './components/TopNav'
import { Toaster } from './components/ui/toaster'

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
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <TopNav />
        <AnimatedRoutes />
        <Toaster />
      </div>
    </Router>
  )
}

export default App

