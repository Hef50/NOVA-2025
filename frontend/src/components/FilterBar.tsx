import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Slider } from './ui/slider'

interface FilterBarProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
}

const categories = [
  { id: 'food', label: 'Food', color: 'orange' },
  { id: 'attraction', label: 'Attractions', color: 'purple' },
  { id: 'entertainment', label: 'Entertainment', color: 'pink' },
  { id: 'shopping', label: 'Shopping', color: 'blue' }
]

export default function FilterBar({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange
}: FilterBarProps) {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(c => c !== categoryId))
    } else {
      onCategoryChange([...selectedCategories, categoryId])
    }
  }

  const clearFilters = () => {
    onCategoryChange([])
    onPriceRangeChange([0, 100])
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  onClick={() => toggleCategory(category.id)}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? `bg-${category.color}-500 text-white hover:bg-${category.color}-600`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor:
                            category.color === 'orange'
                              ? '#f97316'
                              : category.color === 'purple'
                              ? '#9333ea'
                              : category.color === 'pink'
                              ? '#ec4899'
                              : '#3b82f6'
                        }
                      : undefined
                  }
                >
                  {category.label}
                </Badge>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">Price Range</p>
          <p className="text-sm font-semibold text-purple-600">
            ${priceRange[0]} - ${priceRange[1] === 100 ? '100+' : priceRange[1]}
          </p>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>
    </motion.div>
  )
}

