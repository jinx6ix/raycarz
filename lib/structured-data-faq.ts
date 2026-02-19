// lib/structured-data-faq.ts
import { FAQ } from '@/app/faq/types';

export function generateFAQStructuredData(faqs: Record<string, FAQ[]>) {
  // Flatten all FAQs and create Question entities
  const allFAQs = Object.values(faqs).flat();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': 'https://yoursafariwebsite.com/faq#faqpage',
        mainEntity: allFAQs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
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
            item: 'https://yoursafariwebsite.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'FAQ',
            item: 'https://yoursafariwebsite.com/faq',
          },
        ],
      },
      {
        '@type': 'WebSite',
        name: 'Your Safari Company Name - FAQ',
        url: 'https://yoursafariwebsite.com/faq',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://yoursafariwebsite.com/faq?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function generateCategoryStructuredData(category: string, faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${category} - Safari FAQ`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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