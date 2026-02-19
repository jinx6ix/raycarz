// app/faq/types.ts
export interface FAQ {
    id?: string;
    question: string;
    answer: string;
    category?: string;
    tags?: string[];
    relatedLinks?: Array<{
      title: string;
      url: string;
    }>;
    helpful?: {
      yes: number;
      no: number;
    };
    lastUpdated?: string;
    featured?: boolean;
  }
  
  export interface FAQCategory {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    faqs: FAQ[];
    count: number;
  }
  
  export interface FAQSearchResult {
    faqs: FAQ[];
    total: number;
    query: string;
  }
  
  export interface FAQStats {
    totalFAQs: number;
    totalCategories: number;
    mostViewed: FAQ[];
    recentlyUpdated: FAQ[];
  }
  
  // For structured data
  export interface FAQStructuredData {
    '@context': string;
    '@type': 'FAQPage';
    mainEntity: Array<{
      '@type': 'Question';
      name: string;
      acceptedAnswer: {
        '@type': 'Answer';
        text: string;
      };
    }>;
  }
  
  // For search functionality
  export interface FAQSearchParams {
    query?: string;
    category?: string;
    tag?: string;
  }
  
  // For helpful feedback
  export interface FAQFeedback {
    faqId: string;
    helpful: boolean;
    timestamp: string;
  }
  
  // For related content
  export interface FAQRelatedContent {
    faqId: string;
    relatedFAQs: string[];
    relatedTours?: string[];
    relatedDestinations?: string[];
    relatedBlogPosts?: string[];
  }