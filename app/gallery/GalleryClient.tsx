// app/gallery/GalleryClient.tsx
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Eye, 
  Camera, 
  Video,
  Filter,
  X,
  Share2,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MapPin,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Grid,
  List,
  SlidersHorizontal,
  Clock,
  Bookmark
} from 'lucide-react';
import type { SocialPost } from './types';

interface GalleryClientProps {
  initialPosts: SocialPost[];
  allTags: string[];
  popularTags: string[];
  trendingPosts: { title: string; slug: string; image: string }[];
  stats: {
    totalPhotos: number;
    totalVideos: number;
    totalPosts: number;
    totalLikes: number;
    totalViews: number;
  };
}

export default function GalleryClient({ 
  initialPosts, 
  allTags, 
  popularTags,
  trendingPosts,
  stats 
}: GalleryClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get all available years
  const availableYears = useMemo(() => {
    const years = new Set(initialPosts.map(post => new Date(post.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    if (selectedType) {
      filtered = filtered.filter(post => post.type === selectedType);
    }

    if (selectedYear) {
      filtered = filtered.filter(post => 
        new Date(post.date).getFullYear() === selectedYear
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [initialPosts, selectedTag, selectedType, selectedYear]);

  // Load liked and saved posts from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('gallery-likes');
    if (savedLikes) {
      setLikedPosts(new Set(JSON.parse(savedLikes)));
    }

    const saved = localStorage.getItem('gallery-saved');
    if (saved) {
      setSavedPosts(new Set(JSON.parse(saved)));
    }
  }, []);

  // Handle like
  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
    localStorage.setItem('gallery-likes', JSON.stringify(Array.from(newLikedPosts)));
  };

  // Handle save
  const handleSave = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedPosts = new Set(savedPosts);
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId);
    } else {
      newSavedPosts.add(postId);
    }
    setSavedPosts(newSavedPosts);
    localStorage.setItem('gallery-saved', JSON.stringify(Array.from(newSavedPosts)));
  };

  // Handle share
  const handleShare = async (post: SocialPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/gallery/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.caption,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Open lightbox
  const openLightbox = (post: SocialPost, index: number) => {
    setSelectedPost(post);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPost(null);
    setIsPlaying(false);
    document.body.style.overflow = 'unset';
  };

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredPosts.length
      : (currentIndex - 1 + filteredPosts.length) % filteredPosts.length;
    
    setCurrentIndex(newIndex);
    setSelectedPost(filteredPosts[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentIndex, filteredPosts]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedType(null);
    setSelectedYear(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      
      {/* Breadcrumb with Schema */}
      <nav className="bg-white border-b" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <li>
              <span className="text-gray-600" aria-current="page">Gallery</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Header with Stats */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Safari Gallery
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Stunning <strong>photos</strong> and <strong>videos</strong> from our safaris. 
                Follow our adventures and witness the beauty of <strong>African wildlife</strong>.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 text-sm bg-amber-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="font-bold text-amber-600">{stats.totalPhotos}</div>
                <div className="text-gray-600">Photos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{stats.totalVideos}</div>
                <div className="text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{stats.totalLikes.toLocaleString()}</div>
                <div className="text-gray-600">Likes</div>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-amber-500" />
              Trending:
            </span>
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filter Bar (Sticky) */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full md:hidden mb-2 px-4 py-2 bg-gray-100 rounded-lg"
          >
            <span className="font-semibold flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters & Options
            </span>
            {showFilters ? <ChevronRightIcon className="w-4 h-4 rotate-90" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>

          {/* Filter Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedType === null 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Show all types"
              >
                <Grid className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setSelectedType('photo')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedType === 'photo' 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Show only photos"
              >
                <Camera className="w-4 h-4" />
                Photos ({stats.totalPhotos})
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedType === 'video' 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Show only videos"
              >
                <Video className="w-4 h-4" />
                Videos ({stats.totalVideos})
              </button>
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 mr-2">Year:</span>
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedYear === null
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedYear === year
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Tags Filter */}
            <div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                {allTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTag === tag 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters and Results */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
              <div className="flex flex-wrap gap-2">
                {selectedType && (
                  <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                    {selectedType === 'photo' ? <Camera className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                    {selectedType}
                    <button title='Clear' onClick={() => setSelectedType(null)} className="ml-1 hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedTag && (
                  <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {selectedTag}
                    <button title='Clear' onClick={() => setSelectedTag(null)} className="ml-1 hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedYear && (
                  <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedYear}
                    <button title='Clear' onClick={() => setSelectedYear(null)} className="ml-1 hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid Columns (when in grid mode) */}
                {viewMode === 'grid' && (
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {[2, 3, 4].map(cols => (
                      <button
                        key={cols}
                        onClick={() => setGridColumns(cols)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          gridColumns === cols ? 'bg-white shadow' : 'hover:bg-gray-200'
                        }`}
                      >
                        {cols} col
                      </button>
                    ))}
                  </div>
                )}

                {/* Results Count */}
                <span className="text-sm text-gray-600">
                  Showing <span className="font-medium text-amber-600">{filteredPosts.length}</span> of {stats.totalPosts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {filteredPosts.length > 0 ? (
          <>
            <motion.div 
              className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? `grid-cols-1 md:grid-cols-${gridColumns} lg:grid-cols-${gridColumns}` 
                  : 'grid-cols-1'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onHoverStart={() => setHoveredPost(post.id)}
                    onHoverEnd={() => setHoveredPost(null)}
                    onClick={() => openLightbox(post, index)}
                    className="cursor-pointer group"
                  >
                    <Card className="hover:shadow-xl transition-all overflow-hidden">
                      <div className="relative aspect-square w-full bg-gray-200">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) ${100/gridColumns}vw, ${100/gridColumns}vw`}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          loading={index < 6 ? 'eager' : 'lazy'}
                        />
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/70 text-white border-none backdrop-blur-sm">
                            {post.type === 'video' ? (
                              <><Video className="w-3 h-3 mr-1" /> Video</>
                            ) : (
                              <><Camera className="w-3 h-3 mr-1" /> Photo</>
                            )}
                          </Badge>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                            aria-label="Like"
                          >
                            <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => handleSave(post.id, e)}
                            className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                            aria-label="Save"
                          >
                            <Bookmark className={`w-4 h-4 ${savedPosts.has(post.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => handleShare(post, e)}
                            className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                            aria-label="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Overlay Stats */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                          <div className="flex gap-4 text-white">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{post.comments.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <CardContent className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.caption}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map(tag => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                            )}
                          </div>

                          {/* Location and Date */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {post.location && (
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {post.location.name}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button (if we had pagination) */}
            {filteredPosts.length > 12 && (
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any gallery posts matching your filters.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && selectedPost && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                title='Close'
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-amber-500 z-10 p-2 bg-black/50 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                title='Previous'
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
                className="absolute left-4 text-white hover:text-amber-500 z-10 p-2 bg-black/50 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                title='Next'
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
                className="absolute right-4 text-white hover:text-amber-500 z-10 p-2 bg-black/50 rounded-full"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>

              {/* Image/Video */}
              <div className="relative max-w-5xl max-h-[80vh] w-full mx-4">
                {selectedPost.type === 'video' ? (
                  <div className="relative aspect-video w-full">
                    <video
                      ref={videoRef}
                      src={selectedPost.videoUrl}
                      poster={selectedPost.image}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay={isPlaying}
                      muted={isMuted}
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 rounded-full p-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 text-white hover:text-amber-500"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 text-white hover:text-amber-500"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    width={1200}
                    height={800}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                  <p className="text-gray-200 mb-4">{selectedPost.caption}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {selectedPost.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedPost.location.name}, {selectedPost.location.country}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {selectedPost.photographer && (
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {selectedPost.photographer.name}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedPost.tags.map(tag => (
                      <Badge key={tag} className="bg-white/20 text-white border-none">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* EXIF Data (for photos) */}
                  {selectedPost.type === 'photo' && selectedPost.exif && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {selectedPost.exif.camera && (
                        <div className="bg-white/10 rounded p-2">
                          <span className="block text-gray-300">Camera</span>
                          <span className="font-medium">{selectedPost.exif.camera}</span>
                        </div>
                      )}
                      {selectedPost.exif.lens && (
                        <div className="bg-white/10 rounded p-2">
                          <span className="block text-gray-300">Lens</span>
                          <span className="font-medium">{selectedPost.exif.lens}</span>
                        </div>
                      )}
                      {selectedPost.exif.aperture && (
                        <div className="bg-white/10 rounded p-2">
                          <span className="block text-gray-300">Aperture</span>
                          <span className="font-medium">{selectedPost.exif.aperture}</span>
                        </div>
                      )}
                      {selectedPost.exif.shutterSpeed && (
                        <div className="bg-white/10 rounded p-2">
                          <span className="block text-gray-300">Shutter</span>
                          <span className="font-medium">{selectedPost.exif.shutterSpeed}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {filteredPosts.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Own Gallery</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Book a safari adventure with us and capture stunning memories of African wildlife. 
            Our photography tours are designed for photographers of all levels.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/tours?category=photography"
              className="bg-white text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 font-medium transition-colors"
            >
              Photography Tours
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white px-6 py-3 rounded-lg border-2 border-white hover:bg-white/10 font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}