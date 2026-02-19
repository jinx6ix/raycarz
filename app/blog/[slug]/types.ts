export interface BlogPost {
    slug: string;
    title: string;
    content: string;
    image: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    keywords: string[];
    relatedPosts: string[];
    relatedTours: string[];
  }
  
  export interface Tour {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    duration: string;
    rating: number;
    price: number;
  }