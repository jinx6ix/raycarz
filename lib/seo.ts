import { Tour } from '@/types/tour'

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbs(
  path: string,
  tourTitle?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
  ]

  if (path.includes('/safari-tours')) {
    breadcrumbs.push({ name: 'Safari Tours', url: '/safari-tours' })
    if (tourTitle) {
      breadcrumbs.push({ name: tourTitle, url: path })
    }
  } else if (path.includes('/destinations')) {
    breadcrumbs.push({ name: 'Destinations', url: '/destinations' })
    const parts = path.split('/')
    if (parts.length > 2) {
      const country = parts[2]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ name: country, url: path })
    }
  }

  return breadcrumbs
}

export function generateProductSchema(tour: Tour) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: tour.title,
    description: tour.description,
    image: tour.images?.[0]?.src || '/images/default-tour.jpg',
    brand: {
      '@type': 'Brand',
      name: 'RAYCARZ Tours & Safaris',
    },
    offers: {
      '@type': 'Offer',
      url: `https://safaris-eastafrica.com/safari-tours/${tour.slug}`,
      priceCurrency: tour.currency,
      price: tour.price.toString(),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.rating.toString(),
      reviewCount: tour.reviewCount.toString(),
    },
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateReviewSchema(
  name: string,
  ratingValue: number,
  reviewCount: number,
  bestRating: number = 5,
  worstRating: number = 1
) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Thing',
      name: name,
    },
    ratingValue: ratingValue.toString(),
    bestRating: bestRating.toString(),
    worstRating: worstRating.toString(),
    reviewCount: reviewCount.toString(),
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RAYCARZ Tours & Safaris',
    image: 'https://safaris-eastafrica.com/logo-remove-background.com.png',
    description:
      'Professional safari tour operator specializing in Big Five safaris, Great Migration tours, and gorilla trekking across Kenya, Tanzania, Uganda, and Rwanda.',
    telephone: '+255-XXX-XXX-XXXX',
    email: 'info@safaris-eastafrica.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Arusha',
      addressLocality: 'Arusha',
      addressCountry: 'TZ',
    },
    url: 'https://safaris-eastafrica.com',
    priceRange: '$$',
    areaServed: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
    servesCuisine: 'African',
  }
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.name,
      item: `https://safaris-eastafrica.com${item.url}`,
    })),
  }
}

export function generateMerchantListingSchema(tours: Tour[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'RAYCARZ Tours & Safaris',
    description: 'Browse our collection of 33+ carefully curated safari and trekking tours across East Africa.',
    url: 'https://safaris-eastafrica.com/safari-tours',
    mainEntity: tours.map((tour) => ({
      '@type': 'Product',
      name: tour.title,
      description: tour.shortDescription,
      image: tour.images?.[0]?.src,
      offers: {
        '@type': 'Offer',
        url: `https://safaris-eastafrica.com/safari-tours/${tour.slug}`,
        priceCurrency: tour.currency,
        price: tour.price.toString(),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tour.rating.toString(),
        reviewCount: tour.reviewCount.toString(),
      },
    })),
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
