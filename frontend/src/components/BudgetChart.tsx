import { motion } from 'framer-motion'

interface BudgetChartProps {
  categories: {
    name: string
    amount: number
    color: string
  }[]
  total: number
}

export default function BudgetChart({ categories, total }: BudgetChartProps) {
  return (
    <div className="space-y-4">
      {categories.map((category, index) => {
        const percentage = total > 0 ? (category.amount / total) * 100 : 0
        
        return (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${category.amount}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

