import tours from '@/data/tours.json'
import { Tour } from '@/types/tour'

export function getAllTours(): Tour[] {
  return tours as Tour[]
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug) as Tour | undefined
}

export function getToursByCountry(country: string): Tour[] {
  return tours.filter(
    (tour) => (tour as Tour).country.toLowerCase() === country.toLowerCase()
  ) as Tour[]
}

export function getToursByKeyword(keyword: string): Tour[] {
  const searchTerm = keyword.toLowerCase()
  return tours.filter((tour) => {
    const t = tour as Tour
    return (
      t.title.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.keywords?.some((k) => k.toLowerCase().includes(searchTerm)) ||
      t.longTailKeywords?.some((k) => k.toLowerCase().includes(searchTerm))
    )
  }) as Tour[]
}

export function getRelatedTours(tourId: string, limit: number = 3): Tour[] {
  const tour = tours.find((t) => (t as Tour).id === tourId) as Tour | undefined
  if (!tour || !tour.relatedTours) return []

  const relatedIds = tour.relatedTours.slice(0, limit)
  return tours.filter((t) => relatedIds.includes((t as Tour).id)) as Tour[]
}

export function getFeaturedTours(limit: number = 6): Tour[] {
  // Return highest rated tours
  return (tours as Tour[])
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
}

export function getToursByDifficulty(difficulty: string): Tour[] {
  return (tours as Tour[]).filter(
    (tour) => tour.difficulty?.toLowerCase() === difficulty.toLowerCase()
  )
}

export function getToursByPriceRange(
  minPrice: number,
  maxPrice: number
): Tour[] {
  return (tours as Tour[]).filter(
    (tour) => tour.price >= minPrice && tour.price <= maxPrice
  )
}

export function getToursByDuration(minDays: number, maxDays: number): Tour[] {
  return (tours as Tour[]).filter((tour) => {
    const daysMatch = tour.duration?.match(/(\d+)\s*days?/i)
    if (!daysMatch) return false
    const days = parseInt(daysMatch[1], 10)
    return days >= minDays && days <= maxDays
  })
}

export function getTourCountByCountry(): Record<string, number> {
  const counts: Record<string, number> = {}
  ;(tours as Tour[]).forEach((tour) => {
    counts[tour.country] = (counts[tour.country] || 0) + 1
  })
  return counts
}

export function getAverageRating(tours_: Tour[]): number {
  if (tours_.length === 0) return 0
  const sum = tours_.reduce((acc, tour) => acc + (tour.rating || 0), 0)
  return parseFloat((sum / tours_.length).toFixed(1))
}

export function getDestinationStats() {
  const countries = [...new Set((tours as Tour[]).map((t) => t.country))]
  return {
    totalTours: tours.length,
    totalCountries: countries.length,
    countries: countries,
  }
}

export function searchTours(
  query: string,
  filters?: {
    country?: string
    minPrice?: number
    maxPrice?: number
    difficulty?: string
  }
): Tour[] {
  let results = getToursByKeyword(query)

  if (filters?.country) {
    results = results.filter(
      (t) => t.country.toLowerCase() === filters.country?.toLowerCase()
    )
  }

  if (filters?.minPrice !== undefined) {
    results = results.filter((t) => t.price >= filters.minPrice!)
  }

  if (filters?.maxPrice !== undefined) {
    results = results.filter((t) => t.price <= filters.maxPrice!)
  }

  if (filters?.difficulty) {
    results = results.filter(
      (t) => t.difficulty?.toLowerCase() === filters.difficulty?.toLowerCase()
    )
  }

  return results
}
