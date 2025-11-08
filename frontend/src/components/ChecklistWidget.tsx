import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: '1', text: 'Book flights', completed: false },
  { id: '2', text: 'Book accommodation', completed: false },
  { id: '3', text: 'Apply for visa (if needed)', completed: false },
  { id: '4', text: 'Purchase travel insurance', completed: false },
  { id: '5', text: 'Notify bank of travel plans', completed: false },
  { id: '6', text: 'Get vaccinations (if needed)', completed: false },
  { id: '7', text: 'Make copies of important documents', completed: false },
  { id: '8', text: 'Arrange airport transportation', completed: false },
  { id: '9', text: 'Download offline maps', completed: false },
  { id: '10', text: 'Exchange currency', completed: false }
]

export default function ChecklistWidget() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST)

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const completedCount = checklist.filter(item => item.completed).length
  const progress = (completedCount / checklist.length) * 100

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pre-Trip Checklist
          </p>
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            {completedCount} / {checklist.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-600 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {checklist.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
              item.completed
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span
              className={`flex-1 ${
                item.completed
                  ? 'text-gray-500 dark:text-gray-400 line-through'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

