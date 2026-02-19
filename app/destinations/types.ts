export interface Destination {
    id: string;
    slug: string;
    name: string;
    country: 'Kenya' | 'Tanzania' | 'Uganda' | 'Rwanda';
    description: string;
    longDescription?: string;
    image: string;
    gallery?: string[];
    highlights: string[];
    bestSeason: string;
    wildlife: string[];
    activities?: string[];
    parks?: Array<{
      name: string;
      description: string;
      highlights?: string[];
    }>;
    rating?: number;
    reviewCount?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
    elevation?: string;
    area?: string;
    established?: string;
    accommodations?: Array<{
      name: string;
      type: string;
      description?: string;
    }>;
    gettingThere?: {
      byAir?: string;
      byRoad?: string;
    };
    climate?: {
      description: string;
      temperatures: string;
      rainfall: string;
    };
    conservation?: {
      status: string;
      efforts: string[];
    };
    keywords?: string[];
    relatedDestinations?: string[];
  }
  
  export interface Park {
    name: string;
    description: string;
    highlights: string[];
    wildlife: string[];
    bestSeason?: string;
    image?: string;
  }
  
  export interface Accommodation {
    name: string;
    type: 'lodge' | 'camp' | 'hotel' | 'resort';
    description: string;
    amenities?: string[];
    priceRange?: string;
    image?: string;
  }
  
  export interface TravelTip {
    title: string;
    description: string;
    icon?: string;
  }
  
  export interface ClimateInfo {
    month: string;
    avgTemp: number;
    rainfall: number;
    description: string;
  }
  
  export interface WildlifeSighting {
    animal: string;
    bestSeason: string;
    probability: 'High' | 'Medium' | 'Low';
    locations: string[];
  }
  
  // For generating static params
  export interface DestinationParams {
    slug: string;
  }
  
  // For metadata generation
  export interface DestinationMetadata {
    title: string;
    description: string;
    keywords: string[];
    openGraph?: {
      title: string;
      description: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
    };
  }
  
  // API response type for destination data
  export interface DestinationResponse {
    destination: Destination;
    relatedDestinations: Destination[];
    tours: Array<{
      id: string;
      title: string;
      slug: string;
      price: number;
      duration: string;
      difficulty: string;
      rating?: number;
      image?: string;
    }>;
    stats: {
      totalTours: number;
      averageRating: number;
      bestTimeToVisit: string;
      wildlifeCount: number;
    };
  }
  
  // Filter options for destination search
  export interface DestinationFilter {
    country?: string;
    wildlife?: string[];
    activity?: string[];
    priceRange?: [number, number];
    duration?: string[];
    rating?: number;
  }
  
  // Sort options
  export type DestinationSortOption = 
    | 'name-asc'
    | 'name-desc'
    | 'rating-desc'
    | 'tours-desc'
    | 'alphabetical';
  
  // Review type
  export interface DestinationReview {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    helpful?: number;
    verified?: boolean;
  }
  
  // FAQ type for destination
  export interface DestinationFAQ {
    question: string;
    answer: string;
    category?: string;
  }
  
  // Itinerary suggestion
  export interface DestinationItinerary {
    days: number;
    title: string;
    description: string;
    highlights: string[];
    accommodations?: string[];
    activities?: string[];
    price?: {
      from: number;
      to: number;
      currency: string;
    };
  }
  
  // Conservation info
  export interface ConservationInfo {
    title: string;
    description: string;
    initiatives: Array<{
      name: string;
      description: string;
      website?: string;
    }>;
    howToHelp: string[];
  }
  
  // Nearby attractions
  export interface NearbyAttraction {
    name: string;
    type: 'park' | 'cultural' | 'activity' | 'landmark';
    distance: string;
    description: string;
    image?: string;
  }
  
  // For breadcrumbs
  export interface BreadcrumbItem {
    name: string;
    url: string;
    position: number;
  }
  
  // For structured data
  export interface DestinationStructuredData {
    '@context': string;
    '@type': 'TouristDestination';
    name: string;
    description: string;
    image: string[];
    address: {
      '@type': 'PostalAddress';
      addressCountry: string;
    };
    geo?: {
      '@type': 'GeoCoordinates';
      latitude: number;
      longitude: number;
    };
    containsPlace?: Array<{
      '@type': 'TouristAttraction';
      name: string;
      description: string;
    }>;
    aggregateRating?: {
      '@type': 'AggregateRating';
      ratingValue: number;
      reviewCount: number;
    };
  }