import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import type { PackingItem } from '../types/trip'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface PackingListProps {
  items: PackingItem[]
  onToggleItem: (itemId: string) => void
}

const categoryOrder = ['Documents', 'Clothing', 'Toiletries', 'Electronics', 'Health']

export default function PackingList({ items, onToggleItem }: PackingListProps) {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, PackingItem[]>)

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a)
    const bIndex = categoryOrder.indexOf(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {sortedCategories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{category}</h3>
              <Badge variant="outline" className="text-sm">
                {groupedItems[category].filter(item => item.packed).length} /{' '}
                {groupedItems[category].length}
              </Badge>
            </div>

            <div className="space-y-2">
              {groupedItems[category].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => onToggleItem(item.id)}
                  className="cursor-pointer"
                >
                  <div
                    className={`flex items-center p-4 rounded-lg transition-all ${
                      item.packed
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        item.packed
                          ? 'bg-green-500'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      {item.packed ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-3 h-3 text-gray-400" />
                      )}
                    </motion.div>

                    <span
                      className={`flex-1 font-medium ${
                        item.packed ? 'text-green-900 line-through' : 'text-gray-900'
                      }`}
                    >
                      {item.name}
                    </span>

                    {item.recommended && !item.packed && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

