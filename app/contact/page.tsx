// app/contact/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import ContactClient from './ContactClient';
import { generateContactStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data-contact';
import officeLocations from '@/data/office-locations.json';
import type { OfficeLocation } from './types';

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Contact RAYCARZ Tours & Safaris | Kenya Safari Experts | Get in Touch',
  description: 'Contact our Kenya-based safari experts for personalized tour planning, booking assistance, and answers to all your questions about East African safaris.',
  keywords: [
    'contact safari company',
    'kenya safari contact',
    'safari support',
    'book safari',
    'travel assistance',
    'safari booking help',
    'kenya safari experts',
    'east africa safari contact',
    'safari customer service',
    'nairobi safari office',
    'safari tour inquiry',
    'african safari questions',
    'custom safari planning',
    'safari reservation',
    'travel consultation'
  ],
  authors: [{ name: 'RAYCARZ Tours & Safaris' }],
  creator: 'RAYCARZ Tours & Safaris',
  publisher: 'RAYCARZ Tours & Safaris',
  openGraph: {
    title: 'Contact RAYCARZ Tours & Safaris | Kenya Safari Experts',
    description: "Get in touch with our Kenya-based safari team. We're here to help plan your perfect African adventure.",
    url: 'https://raycarz.com/contact',
    siteName: 'RAYCARZ Tours & Safaris',
    images: [
      {
        url: 'https://raycarz.com/contact-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact RAYCARZ Tours & Safaris - Kenya Safari Experts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact RAYCARZ Tours & Safaris',
    description: 'Contact our Kenya-based safari experts for personalized tour planning.',
    images: ['https://raycarz.com/contact-twitter.jpg'],
    creator: '@raycarzsafaris',
    site: '@raycarzsafaris',
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
    canonical: 'https://raycarz.com/contact',
    languages: {
      'en-US': 'https://raycarz.com/contact',
      'fr': 'https://raycarz.com/contact',
      'de': 'https://raycarz.com/contact',
    },
  },
  category: 'Contact',
  classification: 'Customer Support',
};

// Default office location (Kenya)
const defaultOffice: OfficeLocation = {
  country: 'Kenya',
  city: 'Nairobi',
  address: 'Westlands, Nairobi, Kenya',
  phone: '+254787644555',
  email: 'info@raycarz.com',
  hours: 'Monday-Friday: 8:00 AM - 6:00 PM EAT',
  coordinates: {
    lat: -1.286389,
    lng: 36.817223,
  },
};

// Generate structured data
const structuredData = generateContactStructuredData(defaultOffice);

// Server Component
export default function ContactPage() {
  return (
    <>
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Home', url: '/' },
              { name: 'Contact', url: '/contact' },
            ])
          ),
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<ContactLoading />}>
        <ContactClient office={defaultOffice} />
      </Suspense>
    </>
  );
}

// Loading Component
function ContactLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
        </div>

        {/* Contact Cards Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Form Skeleton */}
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}