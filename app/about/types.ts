// app/about/types.ts
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image?: string;
    department?: 'leadership' | 'guides' | 'conservation' | 'support';
    expertise?: string[];
    languages?: string[];
    yearsExperience?: number;
    certifications?: string[];
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
    email?: string;
    featured?: boolean;
  }
  
  export interface CompanyStat {
    id: string;
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    description?: string;
    icon?: string;
    year?: number;
    source?: string;
  }
  
  export interface Testimonial {
    id: string;
    author: string;
    location?: string;
    content: string;
    rating: number;
    date: string;
    tour?: string;
    image?: string;
    verified?: boolean;
    video?: string;
  }
  
  export interface SustainabilityInitiative {
    id: string;
    title: string;
    description: string;
    icon: string;
    impact: string;
    metrics: {
      label: string;
      value: string;
    }[];
    images?: string[];
    status: 'ongoing' | 'completed' | 'planned';
    partners?: string[];
  }
  
  export interface Milestone {
    year: number;
    title: string;
    description: string;
    image?: string;
    icon?: string;
  }
  
  export interface Award {
    id: string;
    name: string;
    organization: string;
    year: number;
    category?: string;
    description?: string;
    image?: string;
  }
  
  export interface Partnership {
    id: string;
    name: string;
    logo: string;
    description: string;
    website: string;
    type: 'conservation' | 'community' | 'tourism' | 'certification';
  }
  
  export interface CompanyValues {
    mission: string;
    vision: string;
    values: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  }
  
  export interface CompanyStory {
    founded: number;
    founders: string[];
    history: Milestone[];
    headquarters: string;
    regions: string[];
  }
  
  export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
      linkedin?: string;
    };
  }
  
  // For about page sections
  export interface AboutSection {
    id: string;
    title: string;
    content: string;
    image?: string;
    layout?: 'left' | 'right' | 'full';
    cta?: {
      text: string;
      url: string;
    };
  }
  
  // For awards display
  export interface AwardDisplay {
    year: number;
    awards: Award[];
  }
  
  // For timeline display
  export interface TimelineItem extends Milestone {
    position: 'left' | 'right';
  }
  
  // For structured data
  export interface AboutStructuredData {
    '@context': string;
    '@graph': Array<{
      '@type': string;
      name: string;
      description: string;
      foundingDate: string;
      founders: Array<{ '@type': 'Person'; name: string }>;
      address: {
        '@type': 'PostalAddress';
        addressCountry: string;
      };
      aggregateRating?: {
        '@type': 'AggregateRating';
        ratingValue: number;
        reviewCount: number;
      };
      employee?: Array<{
        '@type': 'Person';
        name: string;
        jobTitle: string;
      }>;
      award?: string[];
      knowsAbout?: string[];
      slogan: string;
      email: string;
      telephone: string;
      sameAs: string[];
      logo: string;
      image: string[];
    }>;
  }