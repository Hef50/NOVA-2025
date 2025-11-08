export interface DaySchedule {
  day: number
  date: string
  activities: Activity[]
}

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  imageUrl?: string
  description?: string
  activities?: Activity[]
  packingList?: PackingItem[]
  schedule?: DaySchedule[]
  createdAt: string
}

export interface Activity {
  id: string
  name: string
  description: string
  category: 'food' | 'attraction' | 'entertainment' | 'shopping' | 'other'
  price?: number
  imageUrl?: string
  selected: boolean
}

export interface PackingItem {
  id: string
  name: string
  category: string
  packed: boolean
  recommended?: boolean
  buyLink?: string
}

