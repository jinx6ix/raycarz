// app/about/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import AboutClient from './AboutClient';
import { generateAboutStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data-about';
import teamMembersRaw from '@/data/team.json';

// Ensure teamMembers conforms to the TeamMember type
const teamMembers: TeamMember[] = teamMembersRaw.map(member => ({
  ...member,
  department: ['leadership', 'conservation', 'guides', 'support'].includes(member.department)
    ? (member.department as 'leadership' | 'conservation' | 'guides' | 'support')
    : undefined,
}));
import stats from '@/data/company-stats.json';
import testimonials from '@/data/testimonials.json';
import type { TeamMember, CompanyStat, Testimonial } from './types';

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'About RAYCARZ Tours & Safaris | Expert Safari Guides & Sustainable Tourism',
  description: 'Learn about RAYCARZ Tours & Safaris - expert guides, sustainable tourism, and unforgettable wildlife experiences in Kenya, Tanzania, Uganda, and Rwanda. 20+ years of experience.',
  keywords: [
    'about safari company',
    'RAYCARZ tours and safaris',
    'safari company story',
    'our mission',
    'safari team',
    'safari experience',
    'east africa safari company',
    'kenya safari company',
    'tanzania safari company',
    'uganda safari company',
    'rwanda safari company',
    'sustainable safari tourism',
    'wildlife conservation company',
    'african safari experts',
    'local safari guides'
  ],
  authors: [{ name: 'RAYCARZ Tours & Safaris' }],
  creator: 'RAYCARZ Tours & Safaris',
  publisher: 'RAYCARZ Tours & Safaris',
  openGraph: {
    title: 'About RAYCARZ Tours & Safaris | Expert Safari Guides & Sustainable Tourism',
    description: 'Discover our story, mission, and commitment to sustainable tourism. Expert guides, conservation efforts, and unforgettable wildlife experiences.',
    url: 'https://raycarz.com/about',
    siteName: 'RAYCARZ Tours & Safaris',
    images: [
      {
        url: 'https://raycarz.com/images/about-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'RAYCARZ Tours & Safaris - About Us',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About RAYCARZ Tours & Safaris',
    description: 'Expert safari guides and sustainable tourism in East Africa. 20+ years of experience.',
    images: ['https://raycarz.com/images/about-twitter.jpg'],
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
    canonical: 'https://raycarz.com/about',
    languages: {
      'en-US': 'https://raycarz.com/about',
      'fr': 'https://raycarz.com/fr/about',
      'de': 'https://raycarz.com/de/about',
    },
  },
  category: 'About Us',
  classification: 'Safari Company Profile',
};

// Calculate company metrics
const totalTeamMembers = teamMembers?.length || 0;
const totalYearsExperience = stats?.yearsExperience || 20;
const totalCustomers = stats?.happyCustomers || 10000;
const totalTours = stats?.curatedTours || 33;
const totalCountries = 4; // Kenya, Tanzania, Uganda, Rwanda

// Generate structured data
const structuredData = generateAboutStructuredData(
  teamMembers,
  stats,
  testimonials,
  { totalYearsExperience, totalCustomers, totalTours, totalCountries }
);

// Server Component
export default function AboutPage() {
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
              { name: 'About', url: '/about' },
            ])
          ),
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<AboutLoading />}>
        <AboutClient 
          teamMembers={teamMembers}
          stats={{
            yearsExperience: totalYearsExperience,
            happyCustomers: totalCustomers,
            countries: totalCountries,
            tours: totalTours,
            teamMembers: totalTeamMembers,
          }}
          testimonials={testimonials}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function AboutLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="h-96 bg-gradient-to-br from-amber-600/50 to-amber-700/50 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}