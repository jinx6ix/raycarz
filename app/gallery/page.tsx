// app/gallery/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import GalleryClient from './GalleryClient';
import { generateGalleryStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data-gallery';
import socialPostsData from '@/data/social-posts.json';
import type { SocialPost } from './types';

// Cast the imported JSON to the correct type
const socialPosts = socialPostsData as unknown as SocialPost[];

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'African Safari Photo Gallery | Wildlife Photography | East Africa',
  description: 'Explore stunning photos and videos from East African safaris. Witness wildlife, landscapes, and cultural moments captured by our expert guides and guests.',
  keywords: [
    'african safari photos',
    'wildlife photography gallery',
    'east africa safari pictures',
    'kenya safari photos',
    'tanzania wildlife images',
    'uganda gorilla photos',
    'rwanda safari pictures',
    'african wildlife photography',
    'safari video gallery',
    'big five photos',
    'great migration pictures',
    'maasai mara images',
    'serengeti photos',
    'african landscape photography',
    'safari moments captured'
  ],
  authors: [{ name: 'Your Safari Company Name' }],
  creator: 'Your Safari Company Name',
  publisher: 'Your Safari Company Name',
  openGraph: {
    title: 'African Safari Photo Gallery | Wildlife Photography',
    description: 'Stunning photos and videos from African safaris. Witness the beauty of East African wildlife through our lens.',
    url: 'https://yoursafariwebsite.com/gallery',
    siteName: 'Your Safari Company Name',
    images: socialPosts.slice(0, 5).map(post => ({
      url: post.image,
      width: 1200,
      height: 630,
      alt: post.title,
    })),
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'African Safari Photo Gallery',
    description: 'Stunning photos and videos from African safaris. Witness the beauty of East African wildlife.',
    images: socialPosts[0]?.image ? [socialPosts[0].image] : [],
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
    canonical: 'https://yoursafariwebsite.com/gallery',
    languages: {
      'en-US': 'https://yoursafariwebsite.com/gallery',
      'fr': 'https://yoursafariwebsite.com/fr/gallery',
      'de': 'https://yoursafariwebsite.com/de/gallery',
    },
  },
  category: 'Gallery',
  classification: 'Photography Gallery',
};

// Calculate stats for the gallery
const totalPhotos = socialPosts.filter(p => p.type === 'photo').length;
const totalVideos = socialPosts.filter(p => p.type === 'video').length;
const totalLikes = socialPosts.reduce((sum, post) => sum + post.likes, 0);
const totalViews = socialPosts.reduce((sum, post) => sum + post.views, 0);

// Get unique tags
const allTags = Array.from(new Set(socialPosts.flatMap(post => post.tags))).sort();

// Get popular tags (most used)
const tagCounts = socialPosts.reduce((acc, post) => {
  post.tags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {} as Record<string, number>);

const popularTags = Object.entries(tagCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([tag]) => tag);

// Get featured/trending posts (most likes)
const trendingPosts = [...socialPosts]
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 3)
  .map(post => ({
    title: post.title,
    slug: post.id,
    image: post.image,
  }));

// Generate structured data
const structuredData = generateGalleryStructuredData(socialPosts, totalPhotos, totalVideos);

// Server Component
export default function GalleryPage() {
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
              { name: 'Gallery', url: '/gallery' },
            ])
          ),
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<GalleryLoading />}>
        <GalleryClient 
          initialPosts={socialPosts}
          allTags={allTags}
          popularTags={popularTags}
          trendingPosts={trendingPosts}
          stats={{
            totalPhotos,
            totalVideos,
            totalPosts: socialPosts.length,
            totalLikes,
            totalViews,
          }}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function GalleryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-96 animate-pulse" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white border-b sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}