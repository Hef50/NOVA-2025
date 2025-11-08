import type { Trip } from '../types/trip'

export function createDemoTrips(): Trip[] {
  const today = new Date()
  const futureDate1 = new Date(today)
  futureDate1.setDate(today.getDate() + 15)
  const futureDate2 = new Date(today)
  futureDate2.setDate(today.getDate() + 22)
  
  const futureDate3 = new Date(today)
  futureDate3.setDate(today.getDate() + 45)
  const futureDate4 = new Date(today)
  futureDate4.setDate(today.getDate() + 52)

  return [
    {
      id: 'demo-1',
      destination: 'Tokyo, Japan',
      startDate: futureDate1.toISOString(),
      endDate: futureDate2.toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      description: 'Explore the vibrant streets of Tokyo, from ancient temples to modern skyscrapers',
      createdAt: new Date().toISOString(),
      packingList: [
        { id: '1', name: 'Passport', category: 'Documents', packed: true },
        { id: '2', name: 'Camera', category: 'Electronics', packed: true },
        { id: '3', name: 'Comfortable Shoes', category: 'Clothing', packed: false },
        { id: '4', name: 'Travel Adapter', category: 'Electronics', packed: false },
      ]
    },
    {
      id: 'demo-2',
      destination: 'Paris, France',
      startDate: futureDate3.toISOString(),
      endDate: futureDate4.toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'Experience the romance and culture of the City of Light',
      createdAt: new Date().toISOString(),
      packingList: [
        { id: '5', name: 'Passport', category: 'Documents', packed: false },
        { id: '6', name: 'Phrasebook', category: 'Books', packed: false },
        { id: '7', name: 'Sunglasses', category: 'Accessories', packed: false },
      ]
    },
    {
      id: 'demo-3',
      destination: 'Bali, Indonesia',
      startDate: futureDate3.toISOString(),
      endDate: futureDate4.toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      description: 'Relax on pristine beaches and discover ancient temples',
      createdAt: new Date().toISOString(),
      packingList: []
    }
  ]
}

