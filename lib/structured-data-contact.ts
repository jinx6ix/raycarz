// lib/structured-data-contact.ts
import { OfficeLocation } from '@/app/contact/types';

export function generateContactStructuredData(office: OfficeLocation) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://raycarz.com/contact#organization',
        name: 'RAYCARZ Tours & Safaris',
        url: 'https://raycarz.com',
        logo: 'https://raycarz.com/logo.png',
        description: 'Kenya-based safari experts offering unforgettable wildlife experiences across East Africa.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: office.address,
          addressLocality: office.city,
          addressCountry: office.country,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: office.phone,
            contactType: 'customer service',
            email: office.email,
            availableLanguage: ['English', 'Swahili', 'French', 'German'],
            areaServed: ['KE', 'TZ', 'UG', 'RW'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
          },
          {
            '@type': 'ContactPoint',
            telephone: office.emergency || office.phone,
            contactType: 'emergency',
            availableLanguage: ['English', 'Swahili'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59',
            },
          },
        ],
        sameAs: [
          'https://facebook.com/raycarzsafaris',
          'https://www.instagram.com/raycarztourandsafaris?igsh=MWd6MXVqY2cxcG51bw==',
          'https://twitter.com/raycarzsafaris',
          'https://linkedin.com/company/raycarzsafaris',
          'https://youtube.com/raycarzsafaris',
          'https://wa.me/+254787644555',
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': 'https://raycarz.com/contact#contactpage',
        url: 'https://raycarz.com/contact',
        name: 'Contact RAYCARZ Tours & Safaris',
        description: 'Get in touch with our Kenya-based safari experts for personalized tour planning and booking assistance.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://raycarz.com',
        },
        about: {
          '@type': 'Organization',
          '@id': 'https://raycarz.com/contact#organization',
        },
        mainEntity: {
          '@type': 'Organization',
          '@id': 'https://raycarz.com/contact#organization',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://raycarz.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact',
            item: 'https://raycarz.com/contact',
          },
        ],
      },
      {
        '@type': 'Place',
        '@id': 'https://raycarz.com/contact#office',
        name: `${office.city} Office`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: office.address,
          addressLocality: office.city,
          addressCountry: office.country,
        },
        ...(office.coordinates && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: office.coordinates.lat,
            longitude: office.coordinates.lng,
          },
        }),
        telephone: office.phone,
        email: office.email,
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
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
      item: `https://raycarz.com${item.url}`,
    })),
  };
}