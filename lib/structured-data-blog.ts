// lib/structured-data-blog.ts
import { BlogPost } from '@/app/blog/types';
import { Tour } from '@/app/tours/[slug]/types';

export function generateBlogPostStructuredData(
  post: BlogPost, 
  relatedPosts: BlogPost[] = [],
  relatedTours: Tour[] = []
) {
  // Clean content for description
  const cleanContent = post.content.replace(/<[^>]*>/g, '');
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `https://yoursafariwebsite.com/blog/${post.slug}#blogposting`,
        headline: post.title,
        description: cleanContent.substring(0, 200),
        image: {
          '@type': 'ImageObject',
          url: post.image,
          width: 1200,
          height: 630,
        },
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Person',
          name: post.author,
          url: `https://yoursafariwebsite.com/blog/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Your Safari Company Name',
          logo: {
            '@type': 'ImageObject',
            url: 'https://yoursafariwebsite.com/logo.png',
            width: 600,
            height: 60,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://yoursafariwebsite.com/blog/${post.slug}`,
        },
        keywords: post.keywords?.join(', '),
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
        timeRequired: post.readTime,
        ...(relatedPosts.length > 0 && {
          mentions: relatedPosts.map(p => ({
            '@type': 'Thing',
            name: p.title,
            url: `https://yoursafariwebsite.com/blog/${p.slug}`,
          })),
        }),
        ...(relatedTours.length > 0 && {
          mentions: relatedTours.map(t => ({
            '@type': 'Product',
            name: t.title,
            url: `https://yoursafariwebsite.com/tours/${t.slug}`,
            offers: {
              '@type': 'Offer',
              price: t.price,
              priceCurrency: 'USD',
            },
          })),
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://yoursafariwebsite.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://yoursafariwebsite.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.category,
            item: `https://yoursafariwebsite.com/blog?category=${encodeURIComponent(post.category)}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: post.title,
            item: `https://yoursafariwebsite.com/blog/${post.slug}`,
          },
        ],
      },
    ],
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://yoursafariwebsite.com${item.url}`,
    })),
  };
}