// app/faq/FAQClient.tsx
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  Search, 
  ChevronRight,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Mail,
  Phone,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  FileText,
  ExternalLink,
  X,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Sparkles,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronLeft,
  ChevronUp
} from 'lucide-react';
import type { FAQ } from './types';

interface FAQClientProps {
  faqs: Record<string, FAQ[]>;
  categories: string[];
  totalFAQs: number;
  popularFAQs: Array<{ question: string; answer: string }>;
}

export default function FAQClient({ faqs, categories, totalFAQs, popularFAQs }: FAQClientProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('General');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all unique tags from FAQs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(faqs).flat().forEach(faq => {
      faq.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [faqs]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recently-viewed-faqs');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  // Load feedback from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faq-feedback');
    if (saved) {
      setFeedbackGiven(JSON.parse(saved));
    }
  }, []);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter FAQs based on search and tags
  const filteredFAQs = useMemo(() => {
    let results: Array<{ category: string; faq: FAQ; id: string }> = [];

    Object.entries(faqs).forEach(([category, categoryFAQs]) => {
      categoryFAQs.forEach((faq, index) => {
        const faqId = `${category}-${index}`;
        
        // Search filter
        const matchesSearch = !searchTerm || 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        // Tags filter
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.every(tag => faq.tags?.includes(tag));

        if (matchesSearch && matchesTags) {
          results.push({ category, faq, id: faqId });
        }
      });
    });

    return results;
  }, [faqs, searchTerm, selectedTags]);

  // Toggle category
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Toggle FAQ
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
    
    // Add to recently viewed
    if (expandedFAQ !== id) {
      const updated = [id, ...recentlyViewed.filter(v => v !== id)].slice(0, 5);
      setRecentlyViewed(updated);
      localStorage.setItem('recently-viewed-faqs', JSON.stringify(updated));
    }
  };

  // Handle feedback
  const handleFeedback = (faqId: string, helpful: 'yes' | 'no') => {
    const newFeedback = { ...feedbackGiven, [faqId]: helpful };
    setFeedbackGiven(newFeedback);
    localStorage.setItem('faq-feedback', JSON.stringify(newFeedback));
  };

  // Handle share
  const handleShare = async (faq: { question: string; answer: string }, platform?: string) => {
    const url = `${window.location.origin}/faq#${faq.question.toLowerCase().replace(/\s+/g, '-')}`;
    const text = `Check out this FAQ: ${faq.question}`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(faq.question)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(faq.question)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: faq.question,
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
    
    setShowShareMenu(null);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setShowSearchResults(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">

        {/* Breadcrumb with Schema */}
        <nav className="bg-white border-b -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-4xl mx-auto py-3">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link href="/" className="text-amber-600 hover:text-amber-700 hover:underline">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <li>
                <span className="text-gray-600" aria-current="page">FAQ</span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about <strong>African safari tours</strong>, 
            <strong> destinations</strong>, <strong>wildlife</strong>, and <strong>booking information</strong>.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <HelpCircle className="w-4 h-4 mr-1 text-amber-500" />
              {totalFAQs} Questions
            </span>
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1 text-amber-500" />
              {categories.length} Categories
            </span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search FAQs... (Press '/' to focus)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
            }}
            className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            aria-label="Search FAQs"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-500">
            /
          </kbd>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-amber-500" />
            Popular:
          </span>
          {popularFAQs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(faq.question)}
              className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs hover:bg-amber-200 transition-colors"
            >
              {faq.question.substring(0, 30)}...
            </button>
          ))}
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 mr-2">Filter by topic:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                )}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters */}
        {(searchTerm || selectedTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 bg-amber-50 p-3 rounded-lg">
            <span className="text-sm font-medium text-amber-700">Active filters:</span>
            {searchTerm && (
              <Badge className="bg-amber-200 text-amber-800 flex items-center gap-1">
                Search: "{searchTerm}"
                <button title='Clear Search' onClick={() => setSearchTerm('')} className="ml-1 hover:text-amber-900">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} className="bg-amber-200 text-amber-800 flex items-center gap-1">
                #{tag}
                <button title='Clear Filter' onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))} className="ml-1 hover:text-amber-900">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-amber-700 hover:text-amber-800 underline ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Search Results or FAQs by Category */}
        {showSearchResults && searchTerm ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Search Results ({filteredFAQs.length})
            </h2>
            {filteredFAQs.length > 0 ? (
              <div className="space-y-3">
                {filteredFAQs.map(({ category, faq, id }) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge className="mb-2 bg-amber-100 text-amber-700 border-none">
                              {category}
                            </Badge>
                            <CardTitle className="text-base text-gray-900">
                              {faq.question}
                            </CardTitle>
                          </div>
                          <button
                            title="Expand FAQ"
                            onClick={() => {
                              toggleFAQ(id);
                              setShowSearchResults(false);
                              setExpandedCategory(category);
                            }}
                            className="text-amber-600 hover:text-amber-700"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="py-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No FAQs found matching your search.</p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* FAQs by Category */
          <div className="space-y-6">
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Recently Viewed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentlyViewed.map(id => {
                    const [category, index] = id.split('-');
                    const faq = faqs[category]?.[parseInt(index)];
                    if (!faq) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setExpandedCategory(category);
                          toggleFAQ(id);
                        }}
                        className="px-3 py-1 bg-white rounded-full text-xs hover:bg-blue-100 transition-colors"
                      >
                        {faq.question.substring(0, 30)}...
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Categories */}
            {categories.map(category => {
              const categoryFAQs = faqs[category];
              const categoryId = category.toLowerCase().replace(/\s+/g, '-');
              const isExpanded = expandedCategory === category;
              const categoryFaqCount = categoryFAQs.length;

              return (
                <div key={category} className="space-y-3">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full"
                  >
                    <Card className={`cursor-pointer hover:shadow-md transition-all ${
                      isExpanded ? 'border-amber-500 shadow-md' : ''
                    }`}>
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <HelpCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="text-left">
                              <CardTitle className="text-lg">{category}</CardTitle>
                              <CardDescription>
                                {categoryFaqCount} question{categoryFaqCount !== 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  </button>

                  {/* Category FAQs */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pl-4 md:pl-8 overflow-hidden"
                      >
                        {categoryFAQs.map((faq: FAQ, idx: number) => {
                          const faqId = `${category}-${idx}`;
                          const isFaqExpanded = expandedFAQ === faqId;

                          return (
                            <div key={faqId} className="space-y-2">
                              <button
                                onClick={() => toggleFAQ(faqId)}
                                className="w-full text-left"
                              >
                                <Card className={`cursor-pointer hover:shadow-md transition-all ${
                                  isFaqExpanded ? 'bg-amber-50 border-amber-300' : ''
                                }`}>
                                  <CardHeader className="py-3">
                                    <div className="flex items-start justify-between gap-4">
                                      <CardTitle className="text-base text-gray-900 font-medium pr-8">
                                        {faq.question}
                                      </CardTitle>
                                      <ChevronDown
                                        className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform ${
                                          isFaqExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </div>
                                  </CardHeader>
                                </Card>
                              </button>

                              {/* Answer */}
                              <AnimatePresence>
                                {isFaqExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card className="ml-4 bg-slate-50 border-0">
                                      <CardContent className="pt-6 space-y-4">
                                        <p className="text-gray-700 leading-relaxed">
                                          {faq.answer}
                                        </p>

                                        {/* Tags */}
                                        {faq.tags && faq.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {faq.tags.map(tag => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="bg-white text-gray-600"
                                              >
                                                #{tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}

                                        {/* Related Links */}
                                        {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                                          <div className="border-t pt-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                              Related Links
                                            </h4>
                                            <div className="space-y-2">
                                              {faq.relatedLinks.map(link => (
                                                <Link
                                                  key={link.url}
                                                  href={link.url}
                                                  className="flex items-center text-sm text-amber-600 hover:text-amber-700"
                                                >
                                                  {link.title}
                                                  <ExternalLink className="w-3 h-3 ml-1" />
                                                </Link>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Helpful Feedback */}
                                        <div className="border-t pt-4 flex items-center justify-between flex-wrap gap-4">
                                          <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-600">
                                              Was this helpful?
                                            </span>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => handleFeedback(faqId, 'yes')}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                                  feedbackGiven[faqId] === 'yes'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                                }`}
                                              >
                                                <ThumbsUp className="w-3 h-3" />
                                                Yes
                                              </button>
                                              <button
                                                onClick={() => handleFeedback(faqId, 'no')}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                                  feedbackGiven[faqId] === 'no'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                                                }`}
                                              >
                                                <ThumbsDown className="w-3 h-3" />
                                                No
                                              </button>
                                            </div>
                                          </div>

                                          {/* Share Button */}
                                          <div className="relative">
                                            <button
                                              onClick={() => setShowShareMenu(showShareMenu === faqId ? null : faqId)}
                                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-amber-600"
                                            >
                                              <Share2 className="w-3 h-3" />
                                              Share
                                            </button>

                                            {showShareMenu === faqId && (
                                              <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-10 min-w-[150px]"
                                              >
                                                <button
                                                  onClick={() => handleShare(faq, 'facebook')}
                                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                                                >
                                                  <Facebook className="w-4 h-4 text-blue-600" />
                                                  Facebook
                                                </button>
                                                <button
                                                  onClick={() => handleShare(faq, 'twitter')}
                                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                                                >
                                                  <Twitter className="w-4 h-4 text-sky-500" />
                                                  Twitter
                                                </button>
                                                <button
                                                  onClick={() => handleShare(faq, 'linkedin')}
                                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                                                >
                                                  <Linkedin className="w-4 h-4 text-blue-700" />
                                                  LinkedIn
                                                </button>
                                                <button
                                                  onClick={() => handleShare(faq, 'email')}
                                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                                                >
                                                  <Mail className="w-4 h-4 text-gray-600" />
                                                  Email
                                                </button>
                                                <button
                                                  onClick={() => handleShare(faq)}
                                                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                                                >
                                                  <LinkIcon className="w-4 h-4 text-gray-600" />
                                                  Copy Link
                                                </button>
                                              </motion.div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Last Updated */}
                                        {faq.lastUpdated && (
                                          <p className="text-xs text-gray-400 text-right">
                                            Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                                          </p>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
          <CardContent className="pt-8 pb-8 px-6 space-y-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Didn't find your answer?
            </h2>
            <p className="text-amber-100 max-w-md mx-auto">
              Contact our safari experts for personalized assistance with your tour planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-2 h-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/booking">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 px-6 py-2 h-auto"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Book a Call
                </Button>
              </Link>
            </div>
            <p className="text-xs text-amber-200">
                  Available 24/7 • Free consultation • No obligation
                </p>
          </CardContent>
        </Card>

        {/* Print and Share Options */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print FAQs
          </Button>
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <ChevronUp className="w-4 h-4" />
            Back to Top
          </Button>
        </div>
      </div>
    </main>
  );
}