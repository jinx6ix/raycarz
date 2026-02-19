// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Script from 'next/script';
import BlogPostClient from './BlogPostClient';
import { generateBlogPostStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data-blog';
import blogPostsData from '@/data/blog-posts.json';
import toursData from '@/data/tours.json';
import type { BlogPost } from '../types';
import type { Tour } from '@/app/tours/[slug]/types';

// Cast the imported JSON to the correct types
const blogPosts = blogPostsData as unknown as BlogPost[];
const tours = toursData as unknown as Tour[];

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

// Enhanced metadata generation with SEO optimization
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    return {};
  }

  // Get related tours for additional SEO context
  const relatedToursList = post.relatedTours
    .map((id: string) => tours.find(t => t.id === id))
    .filter((t: Tour | undefined): t is Tour => t !== undefined);

  return {
    title: `${post.title} | African Safari Blog | ${post.category}`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    keywords: [
      ...post.keywords,
      `${post.category} safari`,
      `african safari ${post.category.toLowerCase()}`,
      `${post.category} travel guide`,
      `safari ${post.category.toLowerCase()} tips`,
      'east africa travel blog',
      'wildlife photography',
      ...relatedToursList.map((t: { title: string; }) => t.title.toLowerCase()),
    ].join(', '),
    authors: [{ name: typeof post.author === 'string' ? post.author : '' }],
    creator: typeof post.author === 'string' ? post.author : post.author.name,
    publisher: 'Your Safari Company Name',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      url: `https://yoursafariwebsite.com/blog/${post.slug}`,
      siteName: 'Your Safari Company Name',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
      authors: [typeof post.author === 'string' ? post.author : post.author.name],
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 120).replace(/<[^>]*>/g, ''),
      images: [post.image],
      creator: '@yoursafaricompany',
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
      canonical: `https://yoursafariwebsite.com/blog/${post.slug}`,
    },
    category: post.category,
    classification: 'Blog Post',
    other: {
      'article:published_time': post.date,
      'article:author': post.author,
      'article:section': post.category,
      ...post.keywords.reduce((acc: any, keyword: any, index: number) => ({
        ...acc,
        [`article:tag:${index + 1}`]: keyword
      }), {})
    },
  };
}

// Server Component
export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = blogPosts.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related blog posts
  const relatedBlogPosts = (post.relatedPosts ?? [])
    .map(slug => blogPosts.find(p => p.slug === slug))
    .filter((p): p is BlogPost => p !== undefined)
    .slice(0, 3);

  // Get related tours
  const relatedToursList = post.relatedTours
    .map((id: string) => tours.find(t => t.id === id))
    .filter((t: Tour | undefined): t is Tour => t !== undefined)
    .slice(0, 3);

  // Get other posts in same category
  const categoryPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Get popular posts based on related counts
  const popularPosts = blogPosts
    .filter(p => p.slug !== post.slug)
    .sort((a, b) => (b.relatedPosts?.length || 0) - (a.relatedPosts?.length || 0))
    .slice(0, 3);

  // Generate structured data
  const structuredData = generateBlogPostStructuredData(post, relatedBlogPosts, relatedToursList);
  
  // Generate breadcrumb data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.category, url: `/blog?category=${encodeURIComponent(post.category)}` },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  // Calculate reading time accurately (if not provided)
  const wordsPerMinute = 200;
  const wordCount = post.content.split(/\s+/).length;
  const calculatedReadTime = post.readTime || `${Math.ceil(wordCount / wordsPerMinute)} min read`;

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
      <Suspense fallback={<BlogPostLoading />}>
        <BlogPostClient 
          post={{ ...post, readTime: calculatedReadTime }}
          relatedBlogPosts={relatedBlogPosts}
          relatedToursList={relatedToursList}
          categoryPosts={categoryPosts}
          popularPosts={popularPosts}
        />
      </Suspense>
    </>
  );
}

// Loading Component
function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-96 w-full bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}