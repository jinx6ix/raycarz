// lib/structured-data-about.ts
import { TeamMember, CompanyStat, Testimonial } from '@/app/about/types';

export function generateAboutStructuredData(
  teamMembers: TeamMember[],
  stats: any,
  testimonials: Testimonial[],
  metrics: {
    totalYearsExperience: number;
    totalCustomers: number;
    totalTours: number;
    totalCountries: number;
  }
) {
  // Format team members for schema
  const leadershipTeam = teamMembers
    ?.filter(m => m.department === 'leadership')
    .map(member => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      description: member.bio,
      ...(member.email && { email: member.email }),
      ...(member.expertise && { knowsAbout: member.expertise }),
    }));

  // Format testimonials for aggregate rating
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://raycarz.com/about#organization',
        name: 'RAYCARZ Tours & Safaris',
        url: 'https://raycarz.com',
        logo: 'https://raycarz.com/logo.png',
        description: 'Creating unforgettable wildlife experiences while supporting local communities and conservation efforts in East Africa.',
        foundingDate: '2003',
        founders: [
          {
            '@type': 'Person',
            name: 'IAN IRAYA',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+254-726-665-100',
          contactType: 'customer service',
          email: 'info@raycarz.com',
          availableLanguage: ['English', 'Swahili', 'French', 'German'],
        },
        sameAs: [
          'https://facebook.com/raycarzsafaris',
          'https://instagram.com/raycarzsafaris',
          'https://twitter.com/raycarzsafaris',
          'https://linkedin.com/company/raycarzsafaris',
          'https://youtube.com/raycarzsafaris',
        ],
        knowsAbout: [
          'Kenya Safari',
          'Tanzania Safari',
          'Uganda Gorilla Trekking',
          'Rwanda Safari',
          'Wildlife Conservation',
          'Sustainable Tourism',
          'Great Migration',
          'Big Five Safari',
        ],
        slogan: 'Creating unforgettable wildlife experiences while supporting local communities and conservation efforts',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating.toFixed(1),
          reviewCount: testimonials.length,
          bestRating: 5,
          worstRating: 1,
        },
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          value: teamMembers?.length || 50,
        },
        ...(leadershipTeam && { employee: leadershipTeam }),
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
            name: 'About',
            item: 'https://raycarz.com/about',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://raycarz.com/about#webpage',
        url: 'https://raycarz.com/about',
        name: 'About RAYCARZ Tours & Safaris',
        description: 'Learn about RAYCARZ Tours & Safaris - expert guides, sustainable tourism, and unforgettable wildlife experiences in East Africa.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://raycarz.com',
        },
        about: {
          '@type': 'Organization',
          '@id': 'https://raycarz.com/about#organization',
        },
        mainEntity: {
          '@type': 'Organization',
          '@id': 'https://raycarz.com/about#organization',
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

export function generateTeamMemberStructuredData(member: TeamMember) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://raycarz.com/about#${member.id}`,
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    ...(member.email && { email: member.email }),
    ...(member.image && { image: member.image }),
    ...(member.expertise && { knowsAbout: member.expertise }),
    ...(member.languages && {
      knowsLanguage: member.languages.map(lang => ({
        '@type': 'Language',
        name: lang,
      })),
    }),
    worksFor: {
      '@type': 'Organization',
      name: 'RAYCARZ Tours & Safaris',
    },
    ...(member.socialLinks && {
      sameAs: Object.values(member.socialLinks).filter(Boolean),
    }),
  };
}