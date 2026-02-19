export interface ImageData {
  src: string
  alt: string
  title?: string
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
}

export interface Tour {
  id: string
  title: string
  country: string
  region: string
  slug: string
  description: string
  shortDescription: string
  price: number
  currency: string
  duration: string
  groupSize: string
  difficulty: string
  bestSeason: string
  rating: number
  reviewCount: number
  keywords: string[]
  longTailKeywords: string[]
  images: ImageData[]
  itinerary: ItineraryDay[]
  included: string[]
  notIncluded: string[]
  relatedTours: string[]
  highlights: string[]
}

export interface Destination {
  country: string
  slug: string
  description: string
  bestSeason: string
  'featured Wildlife': string[]
  keywords: string[]
  tours: string[]
}

export interface FAQ {
  category: string
  faqs: {
    question: string
    answer: string
  }[]
}

export interface Booking {
  tourTitle: string
  tourId: string
  name: string
  email: string
  phone: string
  country: string
  numberOfGuests: number
  startDate: string
  specialRequests?: string
  price: number
  currency: string
}

export interface Review {
  id: string
  tourId: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  source: 'google' | 'tripadvisor' | 'trustpilot' | 'internal'
}
