// app/destinations/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Script from 'next/script';
import DestinationClient from './DestinationClient';
import { 
  generateSingleDestinationStructuredData, 
  generateBreadcrumbStructuredData 
} from '@/lib/structured-data';
import destinationsData from '@/data/destinations.json';
import toursData from '@/data/tours.json';
import type { Tour } from '@/app/tours/[slug]/types';
import type { Destination } from '@/app/destinations/types';

// Cast the imported JSON to the correct types
const destinations = destinationsData as unknown as Destination[];
const tours = toursData as unknown as Tour[];

// Generate static paths for all destinations
export async function generateStaticParams() {
  return destinations.map((dest: Destination) => ({
    slug: dest.slug,
  }));
}

// Enhanced metadata generation with SEO optimization
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d: Destination) => d.slug === slug);

  if (!destination) {
    return {};
  }

  const destinationTours = tours.filter((t: Tour) => t.country === destination.country);
  const tourCount = destinationTours.length;

  return {
    title: `${destination.name} Safari | African Wildlife Tours & Best Time to Visit ${new Date().getFullYear()}`,
    description: destination.longDescription || destination.description,
    keywords: [
      ...(destination.keywords || []),
      `${destination.name} safari`,
      `${destination.name} national park`,
      `${destination.country} safari`,
      `${destination.name} wildlife`,
      `safari in ${destination.name}`,
      `${destination.name} tours`,
      `${destination.name} accommodations`,
      `best time to visit ${destination.name}`,
      `${destination.name} travel guide`,
      `${destination.name} attractions`,
    ].join(', '),
    authors: [{ name: 'RAYCARZ Tours & Safaris' }],
    creator: 'RAYCARZ Tours & Safaris',
    publisher: 'RAYCARZ Tours & Safaris',
    openGraph: {
      title: `${destination.name} Safari | African Wildlife Adventure`,
      description: destination.longDescription?.substring(0, 160) || destination.description,
      url: `https://www.raycarz.com/destinations/${destination.slug}`,
      siteName: 'RAYCARZ Tours & Safaris',
      images: [
        {
          url: destination.image,
          width: 1200,
          height: 630,
          alt: `${destination.name} - Safari Destination in ${destination.country}`,
        },
        ...(destination.gallery?.slice(0, 3).map((img: string) => ({
          url: img,
          width: 800,
          height: 600,
          alt: `${destination.name} landscape and wildlife`,
        })) || []),
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${destination.name} Safari | African Wildlife Experience`,
      description: destination.longDescription?.substring(0, 120) || destination.description,
      images: [destination.image],
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
      canonical: `https://www.raycarz.com/destinations/${destination.slug}`,
      languages: {
        'en-US': `https://www.raycarz.com/destinations/${destination.slug}`,
        'fr': `https://www.raycarz.com/destinations/${destination.slug}`,
        'de': `https://www.raycarz.com/destinations/${destination.slug}`,
      },
    },
    category: 'Safari Destination',
    classification: 'Travel Destination',
    other: {
      'destination-country': destination.country,
      'best-season': destination.bestSeason,
      'tour-count': tourCount.toString(),
    },
  };
}

// Server Component
export default async function DestinationPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const destination = destinations.find((d: Destination) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  // Pre-process data for better performance
  const destinationTours = tours
    .filter((t: Tour) => t.country === destination.country)
    .map(tour => ({
      ...tour,
      destinationName: destination.name,
    }));

  const relatedDestinations = destinations
    .filter((d: Destination) => 
      d.id !== destination.id && 
      (d.country === destination.country || d.highlights?.some(h => destination.highlights?.includes(h)))
    )
    .slice(0, 3)
    .map(d => ({
      ...d,
      tourCount: tours.filter((t: Tour) => t.country === d.country).length,
    }));

  // Generate structured data - using the correct function for single destination
  const structuredData = generateSingleDestinationStructuredData(destination, destinationTours, relatedDestinations);
  
  // Generate breadcrumb data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: destination.name, url: `/destinations/${destination.slug}` },
  ]);

  // Calculate stats with safe property access
  const stats = {
    totalTours: destinationTours.length,
    averageRating: destinationTours.reduce((acc, t) => acc + (t.rating || 0), 0) / destinationTours.length || 0,
    wildlifeCount: destination.wildlife?.length || 0,
    accommodationCount: destination.accommodations?.length || 0,
    parkCount: destination.parks?.length || 0,
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<DestinationLoading />}>
        <DestinationClient
          destination={destination}
          tours={destinationTours}
          relatedDestinations={relatedDestinations}
          stats={stats}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function DestinationLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative w-full h-96 bg-gray-300 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse sticky top-4" />
          </div>
        </div>
      </div>
    </div>
  );
}