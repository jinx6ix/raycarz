// app/gallery/types.ts
export interface SocialPost {
    id: string;
    title: string;
    caption: string;
    image: string;
    type: 'photo' | 'video';
    date: string;
    likes: number;
    comments: number;
    views: number;
    tags: string[];
    location?: {
      name: string;
      country: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    photographer?: {
      name: string;
      avatar?: string;
    };
    dimensions?: {
      width: number;
      height: number;
    };
    videoUrl?: string;
    videoDuration?: string;
    featured?: boolean;
    exif?: {
      camera?: string;
      lens?: string;
      aperture?: string;
      shutterSpeed?: string;
      iso?: string;
      focalLength?: string;
    };
  }
  
  export interface GalleryCategory {
    name: string;
    slug: string;
    count: number;
    coverImage?: string;
    description?: string;
  }
  
  export interface GalleryStats {
    totalPosts: number;
    totalPhotos: number;
    totalVideos: number;
    totalLikes: number;
    totalViews: number;
    totalComments: number;
  }
  
  export interface Photographer {
    name: string;
    slug: string;
    avatar?: string;
    bio?: string;
    postCount: number;
    totalLikes: number;
    specialties?: string[];
  }
  
  export interface LocationGallery {
    location: string;
    country: string;
    posts: SocialPost[];
    coverImage?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  
  // For lightbox gallery
  export interface LightboxImage extends SocialPost {
    index: number;
  }
  
  // For filtering
  export interface GalleryFilter {
    type?: 'photo' | 'video' | null;
    tag?: string | null;
    location?: string | null;
    photographer?: string | null;
    year?: number | null;
    featured?: boolean;
  }
  
  // For pagination
  export interface PaginatedGallery {
    posts: SocialPost[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  // For image optimization
  export interface ImageDimensions {
    width: number;
    height: number;
    aspectRatio: number;
  }
  
  // For sharing
  export interface ShareData {
    url: string;
    title: string;
    description: string;
    image?: string;
  }