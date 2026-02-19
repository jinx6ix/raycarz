// app/faq/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import FAQClient from './FAQClient';
import { generateFAQStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data-faq';
import faqsData from '@/data/faqs.json';
import type { FAQCategory, FAQ } from './types';

// Cast the imported JSON to the correct type
const faqs = faqsData as unknown as Record<string, FAQ[]>;

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Frequently Asked Questions About African Safaris | Expert Answers',
  description: 'Find answers to common questions about African safari tours, destinations, wildlife, booking, pricing, and travel tips. Expert advice from safari professionals.',
  keywords: [
    'african safari faq',
    'safari questions answered',
    'kenya safari faq',
    'tanzania safari questions',
    'uganda gorilla trekking faq',
    'rwanda safari faq',
    'safari booking questions',
    'african safari pricing',
    'best time for safari',
    'safari packing list',
    'safari safety questions',
    'wildlife viewing faq',
    'safari accommodation questions',
    'east africa travel faq',
    'safari preparation guide'
  ],
  authors: [{ name: 'Your Safari Company Name' }],
  creator: 'Your Safari Company Name',
  publisher: 'Your Safari Company Name',
  openGraph: {
    title: 'Frequently Asked Questions About African Safaris',
    description: 'Expert answers to common questions about African safari tours, destinations, wildlife, and travel tips.',
    url: 'https://yoursafariwebsite.com/faq',
    siteName: 'Your Safari Company Name',
    images: [
      {
        url: 'https://yoursafariwebsite.com/images/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'African Safari FAQ - Expert Answers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions About African Safaris',
    description: 'Expert answers to common questions about African safari tours and travel.',
    images: ['https://yoursafariwebsite.com/images/twitter-faq.jpg'],
    creator: '@yoursafaricompany',
    site: '@yoursafaricompany',
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
    canonical: 'https://yoursafariwebsite.com/faq',
    languages: {
      'en-US': 'https://yoursafariwebsite.com/faq',
      'fr': 'https://yoursafariwebsite.com/fr/faq',
      'de': 'https://yoursafariwebsite.com/de/faq',
    },
  },
  category: 'FAQ',
  classification: 'Customer Support',
};

// Calculate stats
const categories = Object.keys(faqs);
const totalFAQs = Object.values(faqs).reduce((sum, categoryFAQs) => sum + categoryFAQs.length, 0);

// Get popular FAQs (first 5)
const popularFAQs = Object.values(faqs)
  .flat()
  .slice(0, 5)
  .map(faq => ({
    question: faq.question,
    answer: faq.answer.substring(0, 100) + '...',
  }));

// Generate structured data
const structuredData = generateFAQStructuredData(faqs);

// Server Component
export default function FAQPage() {
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
              { name: 'FAQ', url: '/faq' },
            ])
          ),
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<FAQLoading />}>
        <FAQClient 
          faqs={faqs}
          categories={categories}
          totalFAQs={totalFAQs}
          popularFAQs={popularFAQs}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function FAQLoading() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center">
          <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
        </div>

        {/* Search Skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-24 animate-pulse" />
          ))}
        </div>

        {/* FAQ Items Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}