// app/destinations/DestinationsClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  PawPrint, 
  Compass, 
  Star, 
  Filter, 
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Share2,
  Bookmark,
  Eye
} from 'lucide-react';

interface DestinationsClientProps {
  destinations: any[];
  totalTours: number;
  countries: string[];
  popularDestinations: string[];
}

export default function DestinationsClient({ 
  destinations, 
  totalTours, 
  countries,
  popularDestinations 
}: DestinationsClientProps) {
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [expandedDestination, setExpandedDestination] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let filtered = [...destinations];
    
    if (filterCountry !== 'all') {
      filtered = filtered.filter(d => d.country === filterCountry);
    }
    
    if (selectedActivities.length > 0) {
      filtered = filtered.filter(d => 
        d.highlights?.some((h: string) => selectedActivities.includes(h))
      );
    }
    
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'tours':
        filtered.sort((a, b) => (b.tourCount || 0) - (a.tourCount || 0));
        break;
    }
    
    return filtered;
  }, [destinations, filterCountry, sortBy, selectedActivities]);

  // Get all unique activities for filtering
  const allActivities = useMemo(() => {
    const activities = new Set<string>();
    destinations.forEach(d => {
      d.highlights?.forEach((h: string) => activities.add(h));
    });
    return Array.from(activities).slice(0, 10);
  }, [destinations]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleShare = async (destination: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destination.name} - East African Safari Destination`,
          text: `Explore ${destination.name} for your next safari adventure!`,
          url: `https://www.raycarz.com/destinations/${destination.slug}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white py-8 md:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        
        {/* SEO Friendly Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            East African Safari Destinations
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the wonders of <strong>Kenya, Tanzania, Uganda, and Rwanda</strong>. 
            Each destination offers unique <strong>wildlife experiences</strong>, 
            <strong>cultural encounters</strong>, and breathtaking landscapes perfect for 
            your <strong>African safari adventure</strong>.
          </p>
          
          {/* Quick Stats for SEO */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {countries.length} Countries
            </span>
            <span className="flex items-center">
              <PawPrint className="w-4 h-4 mr-1" />
              {destinations.length} Destinations
            </span>
            <span className="flex items-center">
              <Compass className="w-4 h-4 mr-1" />
              {totalTours}+ Tours
            </span>
          </div>

          {/* Popular Destinations for SEO */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <span className="text-sm font-medium text-gray-700">Popular:</span>
            {popularDestinations.map((dest, index) => (
              <Link
                key={dest}
                href={`/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                {dest}{index < popularDestinations.length - 1 ? ',' : ''}
              </Link>
            ))}
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-gray-50 rounded-lg p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full md:hidden"
          >
            <span className="font-semibold flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter & Sort
            </span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Country Filter */}
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
                aria-label="Filter by country"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white"
                aria-label="Sort destinations"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="tours">Sort by Tours</option>
              </select>

              {/* Activity Filters */}
              <div className="flex flex-wrap gap-2 flex-1">
                {allActivities.map(activity => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedActivities.includes(activity)
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <section 
          className="grid md:grid-cols-2 gap-6 md:gap-8"
          aria-label="Safari destinations"
        >
          {filteredDestinations.map((destination, index) => (
            <motion.article
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              {/* Main Destination Card */}
              <Link href={`/destinations/${destination.slug}`} className="block group">
                <Card className="h-full hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
                  {/* Image with overlay */}
                  <div className="relative w-full h-64 md:h-72 overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={`${destination.name} - ${destination.description.substring(0, 100)}...`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority={index < 2}
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                    
                    {/* Overlay with rating */}
                    {destination.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center shadow-lg">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="ml-1 font-semibold">{destination.rating}</span>
                        {destination.reviewCount && (
                          <span className="ml-1 text-sm text-gray-600">
                            ({destination.reviewCount})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick action buttons */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleShare(destination);
                        }}
                        className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                        aria-label="Share destination"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to wishlist functionality
                        }}
                        className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                        aria-label="Save destination"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl md:text-3xl group-hover:text-amber-600 transition-colors">
                          {destination.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {destination.country}
                        </CardDescription>
                      </div>
                    </div>
                    <CardDescription className="text-base line-clamp-3">
                      {destination.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 gap-2">
                      {destination.highlights?.slice(0, 4).map((highlight: string) => (
                        <div key={highlight} className="flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                          <span className="text-gray-700 truncate">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Info Pills */}
                    <div className="flex flex-wrap gap-2">
                      {destination.bestSeason && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {destination.bestSeason.split(',')[0]}
                        </Badge>
                      )}
                      {destination.wildlife?.slice(0, 3).map((animal: string) => (
                        <Badge key={animal} variant="secondary" className="text-xs">
                          {animal}
                        </Badge>
                      ))}
                      {destination.wildlife?.length > 3 && (
                        <Badge variant="secondary">+{destination.wildlife.length - 3} more</Badge>
                      )}
                    </div>

                    {/* Tours Available */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        <span className="font-bold text-amber-600">{destination.tourCount}</span> tours available
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        View details
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Featured Tours */}
              {destination.tours && destination.tours.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {destination.tours.slice(0, 2).map((tour: any) => (
                    <Link key={tour.id} href={`/tours/${tour.slug}`} className="block group">
                      <Card className="hover:shadow-lg transition-all">
                        <div className="relative w-full h-28 md:h-32">
                          {tour.images?.[0] && (
                            <Image
                              src={tour.images[0].src}
                              alt={tour.images[0].alt || `${tour.title} in ${destination.name}`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          )}
                          {tour.price && (
                            <div className="absolute bottom-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold">
                              ${tour.price}
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">
                            {tour.title}
                          </h4>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {tour.duration?.split('/')[0] || 'N/A'}
                            </Badge>
                            {tour.rating && (
                              <div className="flex items-center text-xs">
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                <span className="ml-1">{tour.rating}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </section>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No destinations match your filters.</p>
            <button
              onClick={() => {
                setFilterCountry('all');
                setSelectedActivities([]);
              }}
              className="mt-4 text-amber-600 hover:text-amber-700"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Call to Action with Enhanced SEO */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Ready to Explore East Africa?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all <span className="font-bold text-amber-600">{totalTours}</span> safari tours across{' '}
            <strong>Kenya, Tanzania, Uganda, and Rwanda</strong>. Find the perfect adventure with expert guides,
            comfortable accommodations, and unforgettable wildlife encounters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                Browse All Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8">
                Contact Safari Experts
              </Button>
            </Link>
          </div>

          {/* Quick Contact Options */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm text-gray-600">
            <a href="tel:+1234567890" className="flex items-center hover:text-amber-600">
              <Phone className="w-4 h-4 mr-2" />
              +1 (234) 567-890
            </a>
            <a href="mailto:info@yoursafariwebsite.com" className="flex items-center hover:text-amber-600">
              <Mail className="w-4 h-4 mr-2" />
              info@yoursafariwebsite.com
            </a>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-gray-50 rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Choose East Africa for Your Safari?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">The Great Migration</h3>
              <p className="text-gray-600">
                Witness the <strong>Great Migration</strong> across the Serengeti and Maasai Mara, 
                one of the Seven Natural Wonders of Africa. Millions of wildebeest, zebras, and gazelles 
                traverse these plains in search of fresh grazing.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Mountain Gorilla Trekking</h3>
              <p className="text-gray-600">
                Experience the thrill of <strong>gorilla trekking</strong> in Uganda's Bwindi Impenetrable 
                Forest or Rwanda's Volcanoes National Park. Get up close with endangered mountain gorillas 
                in their natural habitat.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">The Big Five</h3>
              <p className="text-gray-600">
                Spot the <strong>Big Five</strong> (lion, leopard, elephant, rhino, buffalo) across various 
                national parks. East Africa offers some of the best wildlife viewing opportunities on the continent.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Year-Round Safari Destination</h3>
              <p className="text-gray-600">
                Each season offers unique experiences. From the <strong>calving season</strong> in Serengeti 
                (January-February) to the <strong>dry season</strong> for optimal wildlife viewing 
                (June-October), there's always a perfect time to visit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}