import { MetadataRoute } from 'next';
import tours from '@/data/tours.json';
import destinations from '@/data/destinations.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safaris-eastafrica.com';

  // Home page
  const homeUrl: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Tours pages
  const toursUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...tours.map((tour) => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  // Destination pages
  const destinationsUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...destinations.map((destination) => ({
      url: `${baseUrl}/destinations/${destination.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...homeUrl, ...toursUrls, ...destinationsUrls, ...staticUrls];
}
