// lib/structured-data-gallery.ts
import { SocialPost } from '@/app/gallery/types';

export function generateGalleryStructuredData(posts: SocialPost[], totalPhotos: number, totalVideos: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery',
        '@id': 'https://www.raycarz.com/gallery#gallery',
        name: 'RAYCARZ Tours & Safari Photo Gallery',
        description: 'Stunning photos and videos from East African safaris. Witness wildlife, landscapes, and cultural moments captured by our expert guides and guests.',
        url: 'https://www.raycarz.com/gallery',
        image: posts.slice(0, 10).map(post => post.image),
        numberOfItems: posts.length,
        about: {
          '@type': 'Thing',
          name: 'African Wildlife Photography',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://www.raycarz.com/gallery',
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: posts.slice(0, 10).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': post.type === 'video' ? 'VideoObject' : 'ImageObject',
            name: post.title,
            description: post.caption,
            contentUrl: post.image,
            ...(post.type === 'video' && {
              uploadDate: post.date,
              thumbnailUrl: post.image,
              ...(post.videoDuration && { duration: post.videoDuration }),
            }),
            ...(post.type === 'photo' && {
              exifData: post.exif ? JSON.stringify(post.exif) : undefined,
            }),
            keywords: post.tags.join(', '),
            datePublished: post.date,
            creator: post.photographer ? {
              '@type': 'Person',
              name: post.photographer.name,
            } : undefined,
            contentLocation: post.location ? {
              '@type': 'Place',
              name: post.location.name,
              address: {
                '@type': 'PostalAddress',
                addressCountry: post.location.country,
              },
              ...(post.location.coordinates && {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: post.location.coordinates.lat,
                  longitude: post.location.coordinates.lng,
                },
              }),
            } : undefined,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.raycarz.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Gallery',
            item: 'https://www.raycarz.com/gallery',
          },
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Your Safari Company Name - Gallery',
        url: 'https://www.raycarz.com/gallery',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.raycarz.com/gallery?tag={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function generateSinglePostStructuredData(post: SocialPost, relatedPosts: SocialPost[] = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': post.type === 'video' ? 'VideoObject' : 'ImageObject',
        '@id': `https://www.raycarz.com/gallery/${post.id}#${post.type}`,
        name: post.title,
        description: post.caption,
        contentUrl: post.image,
        ...(post.type === 'video' && {
          uploadDate: post.date,
          thumbnailUrl: post.image,
          ...(post.videoDuration && { duration: post.videoDuration }),
        }),
        ...(post.type === 'photo' && {
          exifData: post.exif ? JSON.stringify(post.exif) : undefined,
        }),
        keywords: post.tags.join(', '),
        datePublished: post.date,
        creator: post.photographer ? {
          '@type': 'Person',
          name: post.photographer.name,
          ...(post.photographer.avatar && { image: post.photographer.avatar }),
        } : undefined,
        contentLocation: post.location ? {
          '@type': 'Place',
          name: post.location.name,
          address: {
            '@type': 'PostalAddress',
            addressCountry: post.location.country,
          },
          ...(post.location.coordinates && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: post.location.coordinates.lat,
              longitude: post.location.coordinates.lng,
            },
          }),
        } : undefined,
        interactionStatistic: [
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/LikeAction',
            userInteractionCount: post.likes,
          },
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/CommentAction',
            userInteractionCount: post.comments,
          },
          {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/ViewAction',
            userInteractionCount: post.views,
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
            item: 'https://www.raycarz.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Gallery',
            item: 'https://www.raycarz.com/gallery',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://www.raycarz.com/gallery/${post.id}`,
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
      item: `https://www.raycarz.com${item.url}`,
    })),
  };
}