export interface Tour {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice?: number;
    currency: string;
    duration: string;
    groupSize: string;
    difficulty: string;
    bestSeason: string;
    country: string;
    rating: number;
    reviewCount: number;
    images: Array<{
      src: string;
      alt: string;
    }>;
    highlights?: string[];
    included?: string[];
    notIncluded?: string[];
    itinerary?: Array<{
      day: number;
      title: string;
      description: string;
    }>;
    keywords?: string[];
    relatedTours?: string[];
  }