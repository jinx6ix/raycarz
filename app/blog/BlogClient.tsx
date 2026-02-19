// app/blog/BlogClient.tsx
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Search, 
  Calendar, 
  User,
  Tag,
  Clock,
  Filter,
  X,
  TrendingUp,
  BookOpen,
  Share2,
  Mail,
  Bell,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import type { BlogPost } from './types';

interface BlogClientProps {
  initialPosts: BlogPost[];
  categories: string[];
  latestPosts: { title: string; url: string; date: string }[];
}

export default function BlogClient({ initialPosts, categories, latestPosts }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPosts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.author.name.toLowerCase().includes(term) ||
        post.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.every(tag => post.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          // This would ideally use view count, but for now using random
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialPosts, selectedCategory, searchTerm, selectedTags, sortBy]);

  // Get paginated posts
  const paginatedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  // Load more posts
  const loadMore = useCallback(() => {
    setVisiblePosts(prev => Math.min(prev + 3, filteredPosts.length));
  }, [filteredPosts.length]);

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle newsletter signup
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }, 1500);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      
      {/* Breadcrumb with Schema */}
      <nav className="bg-white border-b" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <li>
              <span className="text-gray-600" aria-current="page">Blog</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Header with SEO Optimization */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Safari Blog & Travel Guides
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
            Expert insights on <strong>wildlife photography</strong>, <strong>conservation</strong>, 
            <strong> destination guides</strong>, and travel advice for unforgettable 
            <strong> African safari experiences</strong>.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-amber-500" />
              {initialPosts.length} Articles
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-amber-500" />
              {categories.length} Categories
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2 text-amber-500" />
              {Array.from(new Set(initialPosts.map(p => p.author.name))).length} Authors
            </span>
          </div>

          {/* Latest Posts for SEO */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
            <span className="font-medium text-gray-700">Latest:</span>
            {latestPosts.map((post, index) => (
              <Link
                key={post.url}
                href={post.url}
                className="text-amber-600 hover:text-amber-700 hover:underline"
              >
                {post.title}
                {index < latestPosts.length - 1 && <span className="text-gray-400 ml-1">•</span>}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Search and Filter Bar (Sticky) */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Search Bar with Keyboard Shortcut */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles... (Press '/' to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              aria-label="Search blog posts"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-500">
              /
            </kbd>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full md:hidden mb-2 px-4 py-2 bg-gray-100 rounded-lg"
          >
            <span className="font-semibold flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Categories
            </span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Filter Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Show all categories"
              >
                All Articles
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label={`Filter by category: ${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 mr-2">Popular tags:</span>
                {allTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Sort and Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:border-amber-500"
                  aria-label="Sort articles by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>

                {(selectedCategory || searchTerm || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-amber-600"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-amber-600">{paginatedPosts.length}</span> of{' '}
                <span className="font-medium">{filteredPosts.length}</span> articles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {filteredPosts.length > 0 ? (
          <>
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="popLayout">
                {paginatedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block group h-full">
                      <Card className="h-full hover:shadow-xl transition-all overflow-hidden cursor-pointer">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading={index < 2 ? 'eager' : 'lazy'}
                          />
                          {post.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardHeader className="p-5">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {post.category}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                            {post.title}
                          </h2>
                          
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>

                          {/* Author Info */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              {post.author.avatar ? (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-amber-600" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {post.author.name}
                              </span>
                            </div>

                            {/* Engagement Stats */}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                1.2k
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                89
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                12
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                >
                  Load More Articles
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
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any articles matching your search criteria.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Get Safari Tips & Updates
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for the latest travel guides, wildlife photography tips, 
              and exclusive safari offers.
            </p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                  aria-label="Email for newsletter"
                />
              </div>
              <Button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
              >
                {newsletterStatus === 'loading' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : newsletterStatus === 'success' ? (
                  <span className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Subscribed!
                  </span>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explore by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map(cat => {
              const count = initialPosts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="p-4 bg-gray-50 hover:bg-amber-50 rounded-lg text-center transition-colors group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">
                    {cat}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {count} article{count !== 1 ? 's' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}