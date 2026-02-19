'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Moderate', 'Strenuous'] as const;
const COUNTRIES = ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'] as const;
const TOURS_PER_PAGE = 6;

interface ToursClientProps {
  initialTours: typeof import('@/data/tours.json');
  countryCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  totalTours: number;
  minPrice: number;
  maxPrice: number;
  avgRating: string;
  uniqueLocations: string[];
}

// Component that uses useSearchParams - wrapped in Suspense
function ToursContent({ 
  initialTours, 
  countryCounts, 
  difficultyCounts,
  totalTours,
  minPrice,
  maxPrice,
  avgRating,
  uniqueLocations 
}: ToursClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params for shareable filters
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    searchParams.get('country') || null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    searchParams.get('difficulty') || null
  );
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'duration'>(
    (searchParams.get('sort') as any) || 'rating'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update URL when filters change (for shareable links and SEO)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (sortBy !== 'rating') params.set('sort', sortBy);
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(url, { scroll: false });
  }, [selectedCountry, selectedDifficulty, sortBy, searchQuery, currentPage, router]);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: any) => {
    return (...args: any[]) => {
      setCurrentPage(1);
      callback(...args);
    };
  };

  const filteredTours = useMemo(() => {
    let result = initialTours.filter(tour => {
      const matchCountry = !selectedCountry || tour.country === selectedCountry;
      const matchDifficulty = !selectedDifficulty || tour.difficulty === selectedDifficulty;
      const matchSearch = !searchQuery || 
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchCountry && matchDifficulty && matchSearch;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'duration':
          const aDays = parseInt(a.duration.split(' ')[0]);
          const bDays = parseInt(b.duration.split(' ')[0]);
          return aDays - bDays;
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCountry, selectedDifficulty, sortBy, searchQuery, initialTours]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTours.length / TOURS_PER_PAGE);
  const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
  const endIndex = startIndex + TOURS_PER_PAGE;
  const currentTours = filteredTours.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of tours grid
    document.getElementById('tours-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const clearAllFilters = () => {
    setSelectedCountry(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
    setSortBy('rating');
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCountry, selectedDifficulty, searchQuery].filter(Boolean).length;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* SEO H1 - Visible to search engines but styled as hidden */}
      <h1 className="sr-only">African Safari Tours - Expertly Curated Safari Experiences</h1>
      
      {/* Hero Section with SEO Keywords */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Your Perfect{' '}
              <span className="text-amber-300">African Safari</span>
            </h2>
            <p className="text-xl md:text-2xl text-amber-100 mb-8">
              Explore {totalTours}+ expertly curated tours across {uniqueLocations.join(', ')}. 
              From luxury game drives to budget camping adventures.
            </p>
            
            {/* SEO Rich Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-amber-300">{totalTours}+</div>
                <div className="text-sm text-amber-100">Safari Tours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-amber-300">{uniqueLocations.length}</div>
                <div className="text-sm text-amber-100">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-amber-300">{avgRating}★</div>
                <div className="text-sm text-amber-100">Avg Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-amber-300">${minPrice}</div>
                <div className="text-sm text-amber-100">Starting From</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-40 bg-slate-50 pt-2 pb-4 -mt-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tours by name, destination, or wildlife..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                className="w-full px-4 py-4 pl-12 rounded-lg border-0 focus:ring-2 focus:ring-amber-500"
                aria-label="Search tours"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-4">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="w-full flex items-center justify-between bg-white"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </span>
              <ChevronLeft className={`h-4 w-4 transform transition-transform ${isFilterOpen ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 relative">
          {/* Sticky Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Active Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedCountry}
                        <button title='Clear' onClick={() => handleFilterChange(setSelectedCountry)(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedDifficulty && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedDifficulty}
                        <button title='Clear' onClick={() => handleFilterChange(setSelectedDifficulty)(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {searchQuery}
                        <button title='Clear' onClick={() => handleFilterChange(setSearchQuery)('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Country Filter */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Destinations</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleFilterChange(() => setSelectedCountry(null))}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      !selectedCountry
                        ? 'bg-amber-100 text-amber-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Countries
                  </button>
                  {COUNTRIES.map(country => (
                    <button
                      key={country}
                      onClick={handleFilterChange(() => setSelectedCountry(country))}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCountry === country
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{country}</span>
                      <span className="float-right text-sm text-gray-500">
                        {countryCounts[country]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Difficulty Level</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleFilterChange(() => setSelectedDifficulty(null))}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      !selectedDifficulty
                        ? 'bg-amber-100 text-amber-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Levels
                  </button>
                  {DIFFICULTIES.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={handleFilterChange(() => setSelectedDifficulty(difficulty))}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedDifficulty === difficulty
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{difficulty}</span>
                      <span className="float-right text-sm text-gray-500">
                        {difficultyCounts[difficulty]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={handleFilterChange((e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSortBy(e.target.value as any)
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Sort tours by"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration: Short to Long</option>
                </select>
              </div>

              {/* SEO Content Block */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Why Book With Us?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    Expert local guides
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    Best price guarantee
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    24/7 customer support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">✓</span>
                    Sustainable tourism practices
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Filters */}
          <aside 
            className={`
              lg:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Mobile filter content - same as desktop but with close button */}
              <div className="space-y-6">
                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Active Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearAllFilters();
                          setIsFilterOpen(false);
                        }}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {selectedCountry}
                          <button title='Clear' onClick={() => handleFilterChange(setSelectedCountry)(null)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedDifficulty && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {selectedDifficulty}
                          <button title='Clear' onClick={() => handleFilterChange(setSelectedDifficulty)(null)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {searchQuery && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Search: {searchQuery}
                          <button title='Clear' onClick={() => handleFilterChange(setSearchQuery)('')}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Country Filter */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Destinations</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleFilterChange(() => {
                        setSelectedCountry(null);
                        setIsFilterOpen(false);
                      })}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        !selectedCountry
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Countries
                    </button>
                    {COUNTRIES.map(country => (
                      <button
                        key={country}
                        onClick={handleFilterChange(() => {
                          setSelectedCountry(country);
                          setIsFilterOpen(false);
                        })}
                        className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCountry === country
                            ? 'bg-amber-100 text-amber-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{country}</span>
                        <span className="float-right text-sm text-gray-500">
                          {countryCounts[country]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Difficulty Level</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleFilterChange(() => {
                        setSelectedDifficulty(null);
                        setIsFilterOpen(false);
                      })}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        !selectedDifficulty
                          ? 'bg-amber-100 text-amber-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Levels
                    </button>
                    {DIFFICULTIES.map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={handleFilterChange(() => {
                          setSelectedDifficulty(difficulty);
                          setIsFilterOpen(false);
                        })}
                        className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-amber-100 text-amber-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{difficulty}</span>
                        <span className="float-right text-sm text-gray-500">
                          {difficultyCounts[difficulty]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Sort By</h3>
                  <select
                    title='Sort By'
                    value={sortBy}
                    onChange={handleFilterChange((e: React.ChangeEvent<HTMLSelectElement>) => {
                      setSortBy(e.target.value as any);
                      setIsFilterOpen(false);
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration: Short to Long</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Scrollable Tours Grid */}
          <div className="lg:col-span-3">
            {/* Results Header - Sticky within tours section */}
            <div className="sticky top-24 z-30 bg-slate-50 py-4 -mt-4 mb-4 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredTours.length}</span> tours found
                  {filteredTours.length !== totalTours && (
                    <span className="text-gray-400"> (filtered from {totalTours})</span>
                  )}
                </div>
                
                {/* Page indicator */}
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages || 1}
                </div>
              </div>
            </div>
            
            {/* Tours Grid - 6 per page - Scrollable */}
            <div id="tours-grid" className="space-y-8">
              {filteredTours.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent className="space-y-4">
                    <div className="text-6xl mb-4">🦒</div>
                    <h3 className="text-xl font-semibold text-gray-900">No tours found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We couldn't find any tours matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Clear all filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentTours.map((tour, index) => (
                      <Link 
                        key={tour.id} 
                        href={`/tours/${tour.slug}`}
                        className="group"
                        prefetch={index < 2} // Prefetch first 2 tours on each page
                      >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col">
                          <div className="relative w-full h-48 overflow-hidden">
                            {tour.images?.[0] && (
                              <Image
                                src={tour.images[0].src}
                                alt={tour.images[0].alt || `${tour.title} safari tour`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={currentPage === 1 && index < 2} // Priority load first 2 images on page 1
                              />
                            )}
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                                {tour.country}
                              </Badge>
                            </div>
                            
                            {/* Discount badge */}
                            {tour.originalPrice && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-red-500 text-white">
                                  Save ${tour.originalPrice - tour.price}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <CardHeader className="space-y-2 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className="text-lg line-clamp-2 group-hover:text-amber-600 transition-colors">
                                  {tour.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <span>{tour.duration}</span>
                                  <span>•</span>
                                  <span>{tour.groupSize}</span>
                                </CardDescription>
                              </div>
                              {tour.rating && (
                                <div className="text-right flex-shrink-0">
                                  <div className="font-bold text-amber-600 flex items-center gap-1">
                                    {tour.rating}★
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {tour.reviewCount} reviews
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {tour.shortDescription || tour.description}
                            </p>
                            
                            {/* Keywords/Tags */}
                            {tour.keywords && tour.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {tour.keywords.slice(0, 3).map(keyword => (
                                  <Badge 
                                    key={keyword} 
                                    variant="outline" 
                                    className="text-xs bg-gray-50"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-end justify-between pt-4 border-t">
                              <div>
                                {tour.originalPrice && (
                                  <div className="text-xs text-gray-400 line-through">
                                    ${tour.originalPrice}
                                  </div>
                                )}
                                <div className="text-2xl font-bold text-amber-600">
                                  ${tour.price}
                                  <span className="text-sm font-normal text-gray-500 ml-1">
                                    / person
                                  </span>
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  tour.difficulty === 'Easy' ? 'default' : 
                                  tour.difficulty === 'Moderate' ? 'secondary' : 
                                  'destructive'
                                }
                                className="capitalize"
                              >
                                {tour.difficulty}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                      {/* Previous Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === -1 ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              onClick={() => goToPage(page)}
                              className={`min-w-[40px] ${
                                currentPage === page 
                                  ? 'bg-amber-500 hover:bg-amber-600' 
                                  : 'hover:bg-amber-50'
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>

                      {/* Next Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-full"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-center text-sm text-gray-500">
                    Showing {startIndex + 1} - {Math.min(endIndex, filteredTours.length)} of {filteredTours.length} tours
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SEO Footer Content */}
        <section className="mt-16 pt-8 border-t">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore African Safari Tours by Destination
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COUNTRIES.map(country => {
                const countryTours = initialTours.filter(t => t.country === country);
                if (countryTours.length === 0) return null;
                
                return (
                  <div key={country}>
                    <h3 className="font-semibold text-gray-900 mb-2">{country} Safaris</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {countryTours.slice(0, 4).map(tour => (
                        <li key={tour.id}>
                          <Link 
                            href={`/tours/${tour.slug}`}
                            className="hover:text-amber-600 transition-colors"
                          >
                            {tour.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

// Loading fallback for Suspense
function ToursLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="hidden lg:block lg:col-span-1">
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense boundary
export default function ToursClient(props: ToursClientProps) {
  return (
    <Suspense fallback={<ToursLoading />}>
      <ToursContent {...props} />
    </Suspense>
  );
}