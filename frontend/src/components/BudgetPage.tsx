import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, Plus, Trash2, PieChart } from 'lucide-react'
import { useTrips } from '../hooks/useTrips'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import BudgetChart from './BudgetChart'
import TripSubNav from './TripSubNav'

interface BudgetItem {
  id: string
  category: string
  name: string
  amount: number
}

const CATEGORIES = [
  { name: 'Accommodation', color: '#9333ea' },
  { name: 'Food', color: '#f97316' },
  { name: 'Activities', color: '#ec4899' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Shopping', color: '#10b981' },
  { name: 'Other', color: '#6b7280' }
]

export default function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trips } = useTrips()
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [newItem, setNewItem] = useState({ category: 'Accommodation', name: '', amount: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  const trip = trips.find(t => t.id === tripId)

  useEffect(() => {
    if (!trip) return

    // Auto-calculate from activities
    const activityBudget: BudgetItem[] = (trip.activities || [])
      .filter(a => a.selected && a.price)
      .map(a => ({
        id: `activity-${a.id}`,
        category: 'Activities',
        name: a.name,
        amount: a.price || 0
      }))

    setBudgetItems(activityBudget)
  }, [trip])

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount) return

    const item: BudgetItem = {
      id: `manual-${Date.now()}`,
      category: newItem.category,
      name: newItem.name,
      amount: parseFloat(newItem.amount)
    }

    setBudgetItems([...budgetItems, item])
    setNewItem({ category: 'Accommodation', name: '', amount: '' })
    setShowAddForm(false)
  }

  const handleDeleteItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id))
  }

  const getCategoryTotal = (categoryName: string) => {
    return budgetItems
      .filter(item => item.category === categoryName)
      .reduce((sum, item) => sum + item.amount, 0)
  }

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0)

  const chartData = CATEGORIES.map(cat => ({
    name: cat.name,
    amount: getCategoryTotal(cat.name),
    color: cat.color
  })).filter(cat => cat.amount > 0)

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pt-16 flex items-center justify-center">
        <p className="text-gray-600">Trip not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-16">
      <TripSubNav />
      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Budget Tracker
              </span>
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">{trip.destination}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Track your expenses and stay within budget
            </p>
          </motion.div>

          {/* Total Budget Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-8 bg-gradient-to-r from-purple-600 to-orange-500 text-white">
              <div className="text-center">
                <p className="text-lg mb-2 opacity-90">Total Budget</p>
                <p className="text-6xl font-bold">${totalBudget.toFixed(2)}</p>
                <p className="text-sm mt-2 opacity-90">{budgetItems.length} items</p>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Budget Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center mb-6">
                  <PieChart className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Budget Breakdown
                  </h2>
                </div>
                {chartData.length > 0 ? (
                  <BudgetChart categories={chartData} total={totalBudget} />
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No budget items yet. Add some to see the breakdown!
                  </p>
                )}
              </Card>
            </motion.div>

            {/* Budget Items List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Expenses
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-orange-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>

                {/* Add Item Form */}
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="space-y-3">
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <Input
                        type="text"
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newItem.amount}
                        onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAddItem} className="flex-1">Add</Button>
                        <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Items List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {budgetItems.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                      No expenses yet
                    </p>
                  ) : (
                    budgetItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            ${item.amount}
                          </span>
                          {!item.id.startsWith('activity-') && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

