// Schema markup component for SEO structured data

export function SchemaMarkup({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Breadcrumb schema helper
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return <SchemaMarkup data={schema} />;
}

// FAQ schema helper
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return <SchemaMarkup data={schema} />;
}

// Organization schema helper
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RAYCARZ Tours & Safaris',
    url: 'https://www.raycarz.com',
    logo: 'https://www.raycarz.com/logo-remove-background.com.png',
    description: 'Premium safari tour operator offering Big Five safaris, gorilla trekking, bird watching, and wildlife adventures across Kenya, Tanzania, Uganda, and Rwanda',
    telephone: '+254787644555',
    email: 'info@raycarz.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ' Nairobi',
      addressLocality: 'Nairobi',
      postalCode: '00100',
      addressCountry: 'KE'
    },
    sameAs: [
      'https://facebook.com/eastafricasafaritours',
      'https://www.instagram.com/raycarztourandsafaris?igsh=MWd6MXVqY2cxcG51bw==',
      'https://twitter.com/eastafricasafari',
      'https://youtube.com/eastafricasafaritours'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+254787644555',
      email: 'info@raycarz.com',
      areaServed: ['KE', 'TZ', 'UG', 'RW']
    }
  };

  return <SchemaMarkup data={schema} />;
}

// Review/Rating schema helper
export function ReviewSchema({ item, reviews }: { item: any; reviews: any[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    image: item.image,
    description: item.description,
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: item.currency || 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item.rating,
      reviewCount: item.reviewCount
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      reviewRating: { '@type': 'Rating', ratingValue: review.rating },
      reviewBody: review.text,
      datePublished: review.date
    }))
  };

  return <SchemaMarkup data={schema} />;
}

// Article schema helper for blog posts
export function ArticleSchema({ article }: { article: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'RAYCARZ Tours & Safaris',
      logo: { '@type': 'ImageObject', url: 'https://www.raycarz.com/logo-remove-background.com.png' }
    },
    articleBody: article.content,
    keywords: article.keywords?.join(', ')
  };

  return <SchemaMarkup data={schema} />;
}

// Local business schema for better local search
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'RAYCARZ Tours & Safaris',
    image: 'https://www.raycarz.com/big-five-masai-mara-1.jpg',
    description: 'Expert-led safari tours and wildlife adventures in East Africa',
    telephone: '+254787644555',
    email: 'info@raycarz.com',
    url: 'https://www.raycarz.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nairobi',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      postalCode: '00100',
      addressCountry: 'KE'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-3.367',
      longitude: '36.682'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00'
    },
    priceRange: '$$$',
    areaServed: [
      {
        '@type': 'City',
        name: 'Nairobi',
        address: { '@type': 'PostalAddress', addressCountry: 'KE' }
      },
      {
        '@type': 'City',
        name: 'Dar es Salaam',
        address: { '@type': 'PostalAddress', addressCountry: 'TZ' }
      },
      {
        '@type': 'City',
        name: 'Kampala',
        address: { '@type': 'PostalAddress', addressCountry: 'UG' }
      },
      {
        '@type': 'City',
        name: 'Kigali',
        address: { '@type': 'PostalAddress', addressCountry: 'RW' }
      }
    ]
  };

  return <SchemaMarkup data={schema} />;
}
