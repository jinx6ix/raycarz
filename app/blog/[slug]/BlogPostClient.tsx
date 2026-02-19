// app/blog/[slug]/BlogPostClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  Tag, 
  User,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Printer,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  Star,
  TrendingUp,
  Sparkles,
  Eye
} from 'lucide-react';
import type { BlogPost } from '../types';
import type { Tour } from '@/app/tours/[slug]/types';

interface BlogPostClientProps {
  post: BlogPost & { readTime: string };
  relatedBlogPosts: BlogPost[];
  relatedToursList: Tour[];
  categoryPosts: BlogPost[];
  popularPosts: BlogPost[];
}

export default function BlogPostClient({ 
  post, 
  relatedBlogPosts, 
  relatedToursList, 
  categoryPosts,
  popularPosts 
}: BlogPostClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [readingProgress, setReadingProgress] = useState(0);
  const [comments, setComments] = useState<Array<{ author: string; content: string; date: string }>>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const element = articleRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      const windowScrollTop = window.scrollY - element.offsetTop;
      
      if (windowScrollTop <= 0) {
        setReadingProgress(0);
      } else if (windowScrollTop >= totalHeight) {
        setReadingProgress(100);
      } else {
        setReadingProgress((windowScrollTop / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`blog-likes-${post.slug}`);
    if (savedLikes) {
      setLikes(parseInt(savedLikes));
    }
  }, [post.slug]);

  // Handle like
  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`blog-likes-${post.slug}`, newLikes.toString());
  };

  // Handle save
  const handleSave = () => {
    setIsSaved(!isSaved);
    const savedPosts = JSON.parse(localStorage.getItem('saved-posts') || '[]');
    
    if (!isSaved) {
      savedPosts.push(post.slug);
    } else {
      const index = savedPosts.indexOf(post.slug);
      if (index > -1) savedPosts.splice(index, 1);
    }
    
    localStorage.setItem('saved-posts', JSON.stringify(savedPosts));
  };

  // Handle share
  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;
    const text = `Check out this article: ${post.title}`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    
    setShowShareMenu(false);
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    const comment = {
      author: commentAuthor,
      content: newComment,
      date: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    setCommentAuthor('');
    setShowCommentForm(false);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Toggle font size
  const toggleFontSize = () => {
    setFontSize(prev => prev === 'normal' ? 'large' : 'normal');
  };

  // Parse content into sections for table of contents
  const parseContentIntoSections = (content: string) => {
    // This is a simplified version - you'd want to parse actual HTML headings
    const lines = content.split('\n');
    const sections: { id: string; title: string; level: number }[] = [];
    let idCounter = 0;

    lines.forEach(line => {
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);
      
      if (h2Match) {
        sections.push({
          id: `section-${idCounter++}`,
          title: h2Match[1],
          level: 2,
        });
      } else if (h3Match) {
        sections.push({
          id: `section-${idCounter++}`,
          title: h3Match[1],
          level: 3,
        });
      }
    });

    return sections;
  };

  const sections = parseContentIntoSections(post.content);

  return (
    <main className={`min-h-screen bg-gradient-to-b from-slate-50 to-white ${fontSize === 'large' ? 'text-lg' : ''}`}>
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-amber-500 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Accessibility Toolbar */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-lg hover:bg-amber-50"
          onClick={toggleFontSize}
          title="Toggle font size"
        >
          {fontSize === 'normal' ? 'A+' : 'A-'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-lg hover:bg-amber-50"
          onClick={handlePrint}
          title="Print article"
        >
          <Printer className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-lg hover:bg-amber-50"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Table of Contents (Mobile) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b shadow-sm">
        <button
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <span className="font-semibold">On this page</span>
          {showTableOfContents ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        {showTableOfContents && sections.length > 0 && (
          <div className="border-t bg-gray-50 p-4">
            <div className="space-y-2">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block text-sm hover:text-amber-600 transition-colors ${
                    section.level === 3 ? 'pl-4' : ''
                  }`}
                  onClick={() => setShowTableOfContents(false)}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb with Schema */}
      <nav className="bg-white border-b" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <li>
              <Link href="/blog" className="text-amber-600 hover:text-amber-700 hover:underline">
                Blog
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <li>
              <Link 
                href={`/blog?category=${encodeURIComponent(post.category)}`} 
                className="text-amber-600 hover:text-amber-700 hover:underline"
              >
                {post.category}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <li>
              <span className="text-gray-600 line-clamp-1" aria-current="page">
                {post.title}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-none hover:bg-amber-200">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
            {post.title}
          </h1>
          
          {/* Author and Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <ThumbsUp className={`w-4 h-4 ${likes > 0 ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{likes}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-50"
                >
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => handleShare()}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <LinkIcon className="w-4 h-4 text-gray-600" />
                    <span>Copy Link</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article 
              ref={articleRef}
              className={`prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-amber-600 hover:prose-a:text-amber-700 ${
                fontSize === 'large' ? 'prose-xl' : ''
              }`}
            >
              {/* Parse and render content with section IDs */}
              <div ref={contentRef} dangerouslySetInnerHTML={{ 
                __html: post.content.replace(
                  /<h2>(.*?)<\/h2>/g,
                  (match, title) => `<h2 id="section-${Date.now()}" class="scroll-mt-20">${title}</h2>`
                ) 
              }} />
            </article>

            {/* Keywords/Tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-12">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map(keyword => (
                    <Link
                      key={keyword}
                      href={`/blog?search=${encodeURIComponent(keyword)}`}
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-white text-gray-700 hover:bg-amber-100 cursor-pointer transition-colors"
                      >
                        #{keyword}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tours in Content */}
            {relatedToursList.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Featured Safari Tours
                </h3>
                <div className="grid gap-6">
                  {relatedToursList.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/tours/${tour.slug}`}>
                        <Card className="hover:shadow-xl transition-all cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
                                  {tour.title}
                                </h4>
                                <p className="text-gray-600 mb-3">{tour.shortDescription}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {tour.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-amber-500 fill-current" />
                                    {tour.rating} / 5
                                  </span>
                                </div>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-3xl font-bold text-amber-600">${tour.price}</p>
                                <p className="text-sm text-gray-500">per person</p>
                                <Badge className="mt-2 bg-amber-100 text-amber-700 border-none group-hover:bg-amber-200">
                                  View Tour <ExternalLink className="w-3 h-3 ml-1 inline" />
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-16 border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {showCommentForm ? (
                <form onSubmit={handleCommentSubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Comment *
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      Post Comment
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button 
                  onClick={() => setShowCommentForm(true)}
                  className="mb-8 bg-amber-600 hover:bg-amber-700"
                >
                  Leave a Comment
                </Button>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents (Desktop) */}
            {sections.length > 0 && (
              <Card className="hidden lg:block sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`block text-sm hover:text-amber-600 transition-colors ${
                          section.level === 3 ? 'pl-4' : ''
                        }`}
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Posts */}
            {relatedBlogPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedBlogPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="block p-3 rounded-lg hover:bg-amber-50 transition-colors group"
                    >
                      <h4 className="font-medium text-gray-900 group-hover:text-amber-600 text-sm line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {relatedPost.readTime}
                        <span>•</span>
                        <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Category Posts */}
            {categoryPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">More in {post.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryPosts.map((categoryPost) => (
                    <Link
                      key={categoryPost.slug}
                      href={`/blog/${categoryPost.slug}`}
                      className="block p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 text-sm line-clamp-2">
                        {categoryPost.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(categoryPost.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    Popular Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {popularPosts.map((popularPost) => (
                    <Link
                      key={popularPost.slug}
                      href={`/blog/${popularPost.slug}`}
                      className="block p-3 rounded-lg hover:bg-purple-50 transition-colors group"
                    >
                      <h4 className="font-medium text-gray-900 group-hover:text-purple-600 text-sm line-clamp-2">
                        {popularPost.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>1.2k views</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Author Box */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                    <p className="text-xs text-gray-600">Safari Expert & Guide</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  John has over 10 years of experience leading safaris across East Africa. 
                  He specializes in wildlife photography and conservation.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CTA Box */}
            <Card className="bg-amber-600 text-white border-none sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Ready for Your Safari?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-100 mb-6">
                  Book one of our recommended tours and experience African wildlife firsthand with expert guides.
                </p>
                <div className="space-y-3">
                  <Link href="/tours">
                    <Button className="w-full bg-white text-amber-600 hover:bg-amber-50">
                      Browse All Tours
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full border-amber-400 text-amber-100 hover:bg-amber-700">
                      Contact an Expert
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-amber-200 text-center mt-4">
                  Free consultation • No obligation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss a Safari Story</h2>
          <p className="text-amber-100 mb-8">
            Get the latest travel guides, photography tips, and exclusive offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Button className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-3">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-amber-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </main>
  );
}