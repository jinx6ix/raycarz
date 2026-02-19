// app/blog/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import BlogClient from './BlogClient';
import { generateBlogStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data';
import blogPostsData from '@/data/blog-posts.json';
import type { BlogPost } from './types';

// Cast the imported JSON to the correct type
const blogPosts = blogPostsData as unknown as BlogPost[];

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'African Safari Blog | Wildlife Guides & Travel Tips | East Africa',
  description: 'Expert safari blog with wildlife photography tips, conservation news, destination guides, and travel advice for Kenya, Tanzania, Uganda, and Rwanda.',
  keywords: [
    'african safari blog',
    'wildlife photography tips',
    'safari travel guide',
    'east africa travel blog',
    'kenya safari blog',
    'tanzania travel tips',
    'uganda gorilla trekking blog',
    'rwanda safari guide',
    'african wildlife conservation',
    'safari packing list',
    'great migration blog',
    'maasai mara travel guide',
    'serengeti safari tips',
    'african travel photography',
    'sustainable safari tourism'
  ],
  authors: [{ name: 'Your Safari Company Name' }],
  creator: 'Your Safari Company Name',
  publisher: 'Your Safari Company Name',
  openGraph: {
    title: 'African Safari Blog | Expert Travel Guides & Wildlife Tips',
    description: 'Discover expert insights on African safaris, wildlife photography, conservation, and travel tips from experienced guides.',
    url: 'https://yoursafariwebsite.com/blog',
    siteName: 'Your Safari Company Name',
    images: [
      {
        url: 'https://yoursafariwebsite.com/images/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'African Safari Blog - Wildlife and Travel Guides',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'African Safari Blog | Travel Tips & Wildlife Guides',
    description: 'Expert insights on African safaris, wildlife photography, and travel tips.',
    images: ['https://yoursafariwebsite.com/images/twitter-blog.jpg'],
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
    canonical: 'https://yoursafariwebsite.com/blog',
    languages: {
      'en-US': 'https://yoursafariwebsite.com/blog',
      'fr': 'https://yoursafariwebsite.com/fr/blog',
      'de': 'https://yoursafariwebsite.com/de/blog',
    },
  },
  category: 'Travel Blog',
  classification: 'Safari Travel Guides',
};

// Generate structured data for blog listing
const structuredData = generateBlogStructuredData(blogPosts);

// Extract unique categories for filtering
const categories = Array.from(new Set(blogPosts.map(post => post.category))).sort();

// Get featured/latest posts for SEO
const latestPosts = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
  .map(post => ({
    title: post.title,
    url: `/blog/${post.slug}`,
    date: post.date
  }));

// Server Component
export default function BlogPage() {
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
              { name: 'Blog', url: '/blog' },
            ])
          ),
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<BlogLoading />}>
        <BlogClient 
          initialPosts={blogPosts}
          categories={categories}
          latestPosts={latestPosts}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function BlogLoading() {
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
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
        </div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white border-b sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="h-10 bg-gray-200 rounded-lg w-full mb-4 animate-pulse" />
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}