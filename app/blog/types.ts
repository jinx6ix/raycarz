// app/blog/types.ts
export interface BlogPost {
    relatedTours: any;
    keywords: any;
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: {
      toLowerCase: any;
      name: string;
      avatar?: string;
      bio?: string;
    };
    date: string;
    readTime: string;
    tags?: string[];
    featured?: boolean;
    relatedPosts?: string[];
    comments?: Comment[];
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  }
  
  export interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    avatar?: string;
  }
  
  export interface BlogCategory {
    name: string;
    slug: string;
    count: number;
    description?: string;
  }
  
  export interface BlogAuthor {
    name: string;
    slug: string;
    avatar?: string;
    bio?: string;
    social?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    postCount?: number;
  }
  
  // For RSS feed
  export interface BlogRSSItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    guid: string;
    author?: string;
    category?: string[];
  }
  
  // For newsletter signup
  export interface NewsletterSignup {
    email: string;
    name?: string;
    preferences?: string[];
  }
  
  // For search functionality
  export interface BlogSearchParams {
    query?: string;
    category?: string;
    tag?: string;
    author?: string;
    page?: number;
    limit?: number;
  }
  
  export interface BlogSearchResult {
    posts: BlogPost[];
    total: number;
    page: number;
    totalPages: number;
  }
  
  // For blog archive
  export interface BlogArchiveItem {
    year: number;
    months: {
      month: number;
      count: number;
      posts: BlogPost[];
    }[];
  }
  
  // For popular posts
  export interface PopularPost {
    id: string;
    slug: string;
    title: string;
    views: number;
    image?: string;
    excerpt?: string;
  }