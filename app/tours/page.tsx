import { Metadata } from 'next';
import tours from '@/data/tours.json';
import ToursClient from './tours-client';
import { generateToursStructuredData } from '@/lib/structured-data';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'African Safari Tours | Expertly Curated Safari Experiences',
  description: 'Discover 50+ expertly curated African safari tours across Kenya, Tanzania, Uganda & Rwanda. From luxury game drives to budget camping safaris, find your perfect adventure.',
  keywords: 'African safari, safari tours, Kenya safaris, Tanzania safaris, Uganda gorilla trekking, Rwanda safaris, wildlife tours, East Africa travel',
  authors: [{ name: 'RAYCARZ Tours & Safaris' }],
  creator: 'RAYCARZ Tours & Safaris',
  publisher: 'RAYCARZ Tours & Safaris',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph for social sharing
  openGraph: {
    title: 'EAST African Safari Tours | Expertly Curated Safari Experiences',
    description: 'Discover 50+ expertly curated African safari tours across East Africa. From luxury game drives to budget camping safaris.',
    url: 'https://www.raycarz.com/tours',
    siteName: 'African Safari Tours',
    images: [
      {
        url: 'https://www.raycarz.com/og-tours.jpg',
        width: 1200,
        height: 630,
        alt: 'African Safari Tours - Expertly Curated Safari Experiences',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'African Safari Tours | Expertly Curated Safari Experiences',
    description: 'Discover 50+ expertly curated African safari tours across East Africa.',
    images: ['https://www.raycarz.com/twitter-tours.jpg'],
    creator: '@RAYCARZ Tours & Safaris',
    site: '@RAYCARZ Tours & Safaris',
  },

  // Robots meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: 'https://www.raycarz.com/tours',
    languages: {
      'en-US': 'https://www.raycarz.com/tours',
      'fr-FR': 'https://www.raycarz.com/tours',
      'de-DE': 'https://www.raycarz.com/tours',
    },
  },

  // Verification for search consoles
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },

  // Category
  category: 'travel',
};

// Generate static params for ISR
export const revalidate = 3600; // Revalidate every hour

// Get unique values for filters (server-side)
const DIFFICULTIES = ['Easy', 'Moderate', 'Strenuous'] as const;
const COUNTRIES = ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'] as const;

// Pre-calculate filter counts for SEO and performance
const getFilterCounts = () => {
  const countryCounts = COUNTRIES.reduce((acc, country) => {
    acc[country] = tours.filter(t => t.country === country).length;
    return acc;
  }, {} as Record<string, number>);

  const difficultyCounts = DIFFICULTIES.reduce((acc, difficulty) => {
    acc[difficulty] = tours.filter(t => t.difficulty === difficulty).length;
    return acc;
  }, {} as Record<string, number>);

  return { countryCounts, difficultyCounts };
};

export default async function ToursPage() {
  // Pre-calculate data for client
  const { countryCounts, difficultyCounts } = getFilterCounts();
  
  // Generate structured data for SEO
  const structuredData = generateToursStructuredData(tours);

  // Get unique locations for SEO
  const uniqueLocations = [...new Set(tours.map(t => t.country))];
  
  // Calculate stats for SEO
  const totalTours = tours.length;
  const minPrice = Math.min(...tours.map(t => t.price));
  const maxPrice = Math.max(...tours.map(t => t.price));
  const avgRating = (tours.reduce((acc, t) => acc + (t.rating || 0), 0) / tours.length).toFixed(1);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://www.raycarz.com'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Tours',
                'item': 'https://www.raycarz.com/tours'
              }
            ]
          })
        }}
      />

      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            'name': 'African Safari Tours',
            'url': 'https://www.raycarz.com',
            'logo': 'https://www.raycarz.com/logo.png',
            'sameAs': [
              'https://www.facebook.com/africansafaritours',
              'https://www.instagram.com/africansafaritours',
              'https://twitter.com/africansafari',
              'https://www.pinterest.com/africansafaritours'
            ],
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'KE'
            }
          })
        }}
      />

      {/* FAQ Structured Data for Tours Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is the best time to go on an African safari?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'The best time for an African safari is during the dry season (June to October) when animals gather around water sources. However, each country and park has optimal viewing times.'
                }
              },
              {
                '@type': 'Question',
                'name': 'How much does an African safari cost?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': `African safari tours range from $${minPrice} to $${maxPrice} depending on duration, accommodation, and activities. We offer options for every budget.`
                }
              }
            ]
          })
        }}
      />

      {/* Tours Page Content */}
      <ToursClient 
        initialTours={tours}
        countryCounts={countryCounts}
        difficultyCounts={difficultyCounts}
        totalTours={totalTours}
        minPrice={minPrice}
        maxPrice={maxPrice}
        avgRating={avgRating}
        uniqueLocations={uniqueLocations}
      />
    </>
  );
}