// lib/structured-data.ts
import { Tour } from '@/app/tours/[slug]/types';
import { Destination } from '@/app/destinations/types';
import { BlogPost } from '@/app/blog/types';

// For the destinations listing page (multiple destinations)
export function generateDestinationStructuredData(destinations: Destination[], totalTours: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        itemListElement: destinations.map((dest, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'TouristDestination',
            name: dest.name,
            description: dest.description,
            image: dest.image,
            address: {
              '@type': 'PostalAddress',
              addressCountry: dest.country,
            },
            containsPlace: dest.parks?.map(park => ({
              '@type': 'TouristAttraction',
              name: park.name,
              description: park.description,
            })),
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the best time for an East African safari?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The best time is during the dry season from June to October for general wildlife viewing. For the Great Migration, July to October is ideal in the Maasai Mara, while December to March is best in the Serengeti.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which countries are included in East African safaris?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The main East African safari destinations include Kenya, Tanzania, Uganda, and Rwanda. Each offers unique wildlife experiences and landscapes.',
            },
          },
          {
            '@type': 'Question',
            name: 'What wildlife can I see on an East African safari?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can see the Big Five (lion, leopard, elephant, rhino, buffalo), cheetahs, giraffes, zebras, wildebeest, hippos, crocodiles, and over 1,000 bird species. Uganda and Rwanda also offer mountain gorilla trekking.',
            },
          },
        ],
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
            name: 'Destinations',
            item: 'https://yoursafariwebsite.com/destinations',
          },
        ],
      },
      {
        '@type': 'TravelAgency',
        name: 'Your Safari Company Name',
        description: 'Premium East African Safari Tours',
        url: 'https://yoursafariwebsite.com',
        logo: 'https://yoursafariwebsite.com/logo.png',
        sameAs: [
          'https://facebook.com/yoursafaricompany',
          'https://instagram.com/yoursafaricompany',
          'https://twitter.com/yoursafaricompany',
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
        },
      },
    ],
  };
}

// For a single destination page
export function generateSingleDestinationStructuredData(
  destination: Destination,
  tours: Tour[],
  relatedDestinations: Destination[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': `https://yoursafariwebsite.com/destinations/${destination.slug}#destination`,
        name: destination.name,
        description: destination.longDescription || destination.description,
        url: `https://yoursafariwebsite.com/destinations/${destination.slug}`,
        image: [destination.image, ...(destination.gallery || [])],
        address: {
          '@type': 'PostalAddress',
          addressCountry: destination.country,
        },
        geo: destination.coordinates ? {
          '@type': 'GeoCoordinates',
          latitude: destination.coordinates.lat,
          longitude: destination.coordinates.lng,
        } : undefined,
        containsPlace: destination.parks?.map(park => ({
          '@type': 'TouristAttraction',
          name: park.name,
          description: park.description,
        })),
        aggregateRating: destination.rating ? {
          '@type': 'AggregateRating',
          ratingValue: destination.rating,
          reviewCount: destination.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      },
      {
        '@type': 'ItemList',
        itemListElement: tours.slice(0, 10).map((tour, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: tour.title,
            description: tour.description,
            url: `https://yoursafariwebsite.com/tours/${tour.slug}`,
            image: tour.images?.[0]?.src,
            offers: {
              '@type': 'Offer',
              price: tour.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the best time to visit ${destination.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: destination.bestSeason || 'The best time varies by season and what you want to see.',
            },
          },
          {
            '@type': 'Question',
            name: `What wildlife can I see in ${destination.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `You can see ${destination.wildlife?.slice(0, 5).join(', ')} and many other species.`,
            },
          },
          {
            '@type': 'Question',
            name: `How do I get to ${destination.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: destination.gettingThere?.byAir || destination.gettingThere?.byRoad || 'Contact us for detailed travel information.',
            },
          },
        ],
      },
    ],
  };
}

// For tours listing page
export const generateToursStructuredData = (tours: Tour[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': tours.slice(0, 10).map((tour, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `https://www.africansafaritours.com/tours/${tour.slug}`,
      'name': tour.title,
      'description': tour.shortDescription || tour.description,
      'image': tour.images?.[0]?.src,
    })),
    'numberOfItems': tours.length,
    'name': 'African Safari Tours',
    'description': 'Expertly curated African safari tours across East Africa',
  };
};

// For breadcrumbs
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

export function generateBlogStructuredData(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://yoursafariwebsite.com/blog#blog',
        name: 'African Safari Blog',
        description: 'Expert insights on wildlife, photography, conservation, and unforgettable African safari experiences.',
        url: 'https://yoursafariwebsite.com/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Your Safari Company Name',
          logo: {
            '@type': 'ImageObject',
            url: 'https://yoursafariwebsite.com/logo.png',
          },
        },
        blogPost: posts.slice(0, 10).map(post => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: post.author.name,
          },
          url: `https://yoursafariwebsite.com/blog/${post.slug}`,
          keywords: post.tags?.join(', '),
        })),
      },
      {
        '@type': 'ItemList',
        itemListElement: posts.slice(0, 10).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://yoursafariwebsite.com/blog/${post.slug}`,
        })),
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
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Your Safari Company Name - Blog',
        url: 'https://yoursafariwebsite.com/blog',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://yoursafariwebsite.com/blog?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function generateBlogPostStructuredData(post: BlogPost, relatedPosts: BlogPost[] = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        image: post.image,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Person',
          name: post.author.name,
          ...(post.author.avatar && { image: post.author.avatar }),
          ...(post.author.bio && { description: post.author.bio }),
        },
        publisher: {
          '@type': 'Organization',
          name: 'Your Safari Company Name',
          logo: {
            '@type': 'ImageObject',
            url: 'https://yoursafariwebsite.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://yoursafariwebsite.com/blog/${post.slug}`,
        },
        keywords: post.tags?.join(', '),
        articleSection: post.category,
        ...(relatedPosts.length > 0 && {
          about: relatedPosts.slice(0, 3).map(p => ({
            '@type': 'Thing',
            name: p.title,
            url: `https://yoursafariwebsite.com/blog/${p.slug}`,
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
            name: post.title,
            item: `https://yoursafariwebsite.com/blog/${post.slug}`,
          },
        ],
      },
    ],
  };
}

