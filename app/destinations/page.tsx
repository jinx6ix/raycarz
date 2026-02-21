// app/destinations/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import DestinationsClient from './destinations-client';
import { generateDestinationStructuredData } from '@/lib/structured-data';
import Script from 'next/script';
import destinations from '@/data/destinations.json';
import tours from '@/data/tours.json';

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: 'East African Safari Destinations | Kenya, Tanzania, Uganda & Rwanda',
  description: 'Explore premier safari destinations across East Africa. Discover Kenya\'s Maasai Mara, Tanzania\'s Serengeti, Uganda\'s gorilla trekking, and Rwanda\'s Volcanoes National Park.',
  keywords: [
    'east african safari destinations',
    'kenya safari destinations',
    'tanzania safari destinations',
    'uganda gorilla trekking',
    'rwanda safari',
    'maasai mara',
    'serengeti national park',
    'ngorongoro crater',
    'bwindi impenetrable forest',
    'volcanoes national park',
    'african wildlife destinations',
    'big five safari locations',
    'east africa travel guide',
    'safari vacation spots',
    'african adventure destinations'
  ],
  authors: [{ name: 'Your Safari Company Name' }],
  creator: 'Your Safari Company Name',
  publisher: 'Your Safari Company Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'East African Safari Destinations | Explore Kenya, Tanzania, Uganda & Rwanda',
    description: 'Discover the best safari destinations in East Africa. From the Great Migration in Serengeti to mountain gorillas in Rwanda.',
    url: 'https://www.raycarz.com/destinations',
    siteName: 'Your Safari Company Name',
    images: [
      {
        url: 'https://www.raycarz.com/og-destinations.jpg',
        width: 1200,
        height: 630,
        alt: 'East African Safari Destinations - Wildlife and Landscapes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'East African Safari Destinations',
    description: 'Explore premier safari destinations across Kenya, Tanzania, Uganda & Rwanda',
    images: ['https://www.raycarz.com/twitter-destinations.jpg'],
    creator: '@RAYCARZ Tours & Safaris',
    site: '@RAYCARZ Tours & Safaris',
  },
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
  alternates: {
    canonical: 'https://www.raycarz.com/destinations',
    languages: {
      'en-US': 'https://www.raycarz.com/destinations',
      'fr': 'https://www.raycarz.com/destinations',
      'de': 'https://www.raycarz.com/destinations',
    },
  },
  category: 'travel',
  classification: 'Safari Destinations',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

// Generate structured data for SEO
const structuredData = generateDestinationStructuredData(
  destinations.map(destination => ({
    ...destination,
    country: destination.country as 'Kenya' | 'Tanzania' | 'Uganda' | 'Rwanda',
  })),
  tours.length
);

// Pre-process data for better performance
const destinationsWithTours = destinations.map(destination => ({
  ...destination,
  tours: tours.filter(t => t.country === destination.country).slice(0, 3),
  tourCount: tours.filter(t => t.country === destination.country).length,
}));

export default function DestinationsPage() {
  // Calculate aggregate stats for the page
  const totalTours = tours.length;
  const countries = [...new Set(destinations.map(d => d.country))];
  const popularDestinations = destinations
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)
    .map(d => d.name);

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* BreadcrumbList Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.raycarz.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Destinations',
                item: 'https://www.raycarz.com/destinations',
              },
            ],
          }),
        }}
      />

      {/* Main Content with Suspense for loading states */}
      <Suspense fallback={<DestinationsLoading />}>
        <DestinationsClient 
          destinations={destinationsWithTours}
          totalTours={totalTours}
          countries={countries}
          popularDestinations={popularDestinations}
        />
      </Suspense>
    </>
  );
}

// Loading component for better UX
function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto" />
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-3xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}