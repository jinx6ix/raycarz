// app/destinations/[slug]/DestinationClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  PawPrint, 
  Star, 
  Clock, 
  Users, 
  Mountain,
  Sun,
  Cloud,
  Thermometer,
  Shield,
  Award,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  HelpCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

interface DestinationClientProps {
  destination: any;
  tours: any[];
  relatedDestinations: any[];
  stats: any;
}

export default function DestinationClient({ 
  destination, 
  tours, 
  relatedDestinations,
  stats 
}: DestinationClientProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.5, triggerOnce: true });

  // Gallery images
  const galleryImages = [
    destination.image,
    ...(destination.gallery || []),
    ...tours.slice(0, 3).flatMap(t => t.images?.map((img: any) => img.src) || [])
  ].filter(Boolean).slice(0, 10);

  // Handle save to wishlist
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Saved to your wishlist');
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destination.name} Safari | ${destination.country}`,
          text: destination.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle font size toggle
  const toggleFontSize = () => {
    setFontSize(prev => prev === 'normal' ? 'large' : 'normal');
  };

  // Simulated weather data fetch
  useEffect(() => {
    if (showWeather && !weatherData) {
      // Simulate API call
      setTimeout(() => {
        setWeatherData({
          current: { temp: 25, condition: 'Sunny', humidity: 65 },
          forecast: [
            { day: 'Mon', temp: 26, condition: 'Sunny' },
            { day: 'Tue', temp: 24, condition: 'Partly Cloudy' },
            { day: 'Wed', temp: 25, condition: 'Sunny' },
          ]
        });
      }, 1000);
    }
  }, [showWeather, weatherData]);

  // Table of contents items
  const tableOfContents = [
    { id: 'overview', title: 'Overview' },
    { id: 'highlights', title: 'Highlights' },
    { id: 'wildlife', title: 'Wildlife' },
    { id: 'best-time', title: 'Best Time to Visit' },
    { id: 'tours', title: 'Tours' },
    { id: 'parks', title: 'National Parks' },
    { id: 'accommodations', title: 'Accommodations' },
    { id: 'getting-there', title: 'Getting There' },
    { id: 'faq', title: 'FAQ' },
  ];

  return (
    <main className={`min-h-screen bg-white ${fontSize === 'large' ? 'text-lg' : ''}`}>
      
      {/* Breadcrumb Navigation for SEO */}
      <nav className="bg-gray-50 border-b py-2 px-4 md:px-6 lg:px-8 text-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-gray-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/destinations" className="hover:text-amber-600 transition-colors">Destinations</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{destination.name}</span>
        </div>
      </nav>

      {/* Accessibility Toolbar */}
      <div className="bg-amber-50 border-b py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFontSize}
            className="text-sm"
          >
            {fontSize === 'normal' ? 'A+' : 'A-'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section with Enhanced SEO */}
      <section className="relative w-full h-[60vh] min-h-[500px] bg-black">
        <Image
          src={destination.image}
          alt={`${destination.name} - ${destination.country} safari destination featuring ${destination.wildlife?.slice(0, 3).join(', ')}`}
          fill
          className="object-cover opacity-90"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Destination Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {destination.country}
              </Badge>
              {destination.rating && (
                <Badge variant="outline" className="bg-amber-500/20 text-white border-amber-500/30">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {destination.rating} ({destination.reviewCount || 0} reviews)
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
              {destination.name} Safari
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mb-6 text-gray-200">
              {destination.description}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-amber-400" />
                <span className="text-sm">Best: {destination.bestSeason?.split(',')[0]}</span>
              </div>
              <div className="flex items-center">
                <PawPrint className="w-5 h-5 mr-2 text-amber-400" />
                <span className="text-sm">{stats.wildlifeCount}+ Wildlife Species</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                <span className="text-sm">{stats.parkCount} National Parks</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-amber-400" />
                <span className="text-sm">{stats.totalTours} Tours Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 backdrop-blur hover:bg-white"
            onClick={handleSave}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 backdrop-blur hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Table of Contents (Mobile) */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <button
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <span className="font-semibold">On this page</span>
          {showTableOfContents ? <ChevronLeft /> : <ChevronRight />}
        </button>
        <AnimatePresence>
          {showTableOfContents && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-gray-50"
            >
              <div className="p-4 space-y-2">
                {tableOfContents.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-2 text-sm hover:text-amber-600 transition-colors"
                    onClick={() => setShowTableOfContents(false)}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8" ref={contentRef}>
            
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About {destination.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {destination.longDescription || destination.description}
                  </p>
                  
                  {/* Key Details Grid */}
                  {destination.established && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      {destination.established && (
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <div className="text-sm text-gray-600">Established</div>
                          <div className="font-bold">{destination.established}</div>
                        </div>
                      )}
                      {destination.area && (
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <div className="text-sm text-gray-600">Area</div>
                          <div className="font-bold">{destination.area}</div>
                        </div>
                      )}
                      {destination.elevation && (
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <div className="text-sm text-gray-600">Elevation</div>
                          <div className="font-bold">{destination.elevation}</div>
                        </div>
                      )}
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-sm text-gray-600">Coordinates</div>
                        <div className="font-bold text-xs">
                          {destination.coordinates?.lat.toFixed(2)}°, {destination.coordinates?.lng.toFixed(2)}°
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Highlights Section */}
            <section id="highlights" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Destination Highlights</CardTitle>
                  <CardDescription>
                    Top attractions and experiences in {destination.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {destination.highlights?.map((highlight: string, index: number) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-600 text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Wildlife Section */}
            <section id="wildlife" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Wildlife in {destination.name}</CardTitle>
                  <CardDescription>
                    {stats.wildlifeCount}+ species you might encounter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {destination.wildlife?.map((animal: string) => (
                      <div
                        key={animal}
                        className="flex items-center gap-2 p-2 border rounded-lg hover:border-amber-500 transition-colors"
                      >
                        <span className="text-2xl">🦁</span>
                        <span className="font-medium">{animal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Best Time to Visit */}
            <section id="best-time" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Best Time to Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-600 text-lg">{destination.bestSeason}</p>
                    
                    {/* Climate Info */}
                    {destination.climate && (
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <Thermometer className="w-5 h-5 text-blue-600 mb-2" />
                          <div className="font-semibold">Temperature</div>
                          <div className="text-sm text-gray-600">{destination.climate.temperatures}</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <Cloud className="w-5 h-5 text-green-600 mb-2" />
                          <div className="font-semibold">Rainfall</div>
                          <div className="text-sm text-gray-600">{destination.climate.rainfall}</div>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg">
                          <Sun className="w-5 h-5 text-amber-600 mb-2" />
                          <div className="font-semibold">Climate</div>
                          <div className="text-sm text-gray-600">{destination.climate.description}</div>
                        </div>
                      </div>
                    )}

                    {/* Month-by-month guide */}
                    <button
                      onClick={() => setShowWeather(!showWeather)}
                      className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {showWeather ? 'Hide' : 'Show'} monthly weather guide
                    </button>

                    {showWeather && (
                      <div className="border rounded-lg p-4">
                        {weatherData ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Sun className="w-5 h-5 text-amber-500 mr-2" />
                                <span className="font-semibold">Current: {weatherData.current.temp}°C</span>
                              </div>
                              <span className="text-sm text-gray-600">{weatherData.current.condition}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {weatherData.forecast.map((day: any) => (
                                <div key={day.day} className="text-center p-2 bg-gray-50 rounded">
                                  <div className="font-medium">{day.day}</div>
                                  <div>{day.temp}°C</div>
                                  <div className="text-xs text-gray-600">{day.condition}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Available Tours */}
            <section id="tours" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Tours in {destination.name}</CardTitle>
                  <CardDescription>
                    {stats.totalTours} carefully curated safari experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tours.length === 0 ? (
                    <p className="text-gray-600">No tours currently available for this destination.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {tours.map((tour, index) => (
                        <motion.div
                          key={tour.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link href={`/tours/${tour.slug}`} className="block group">
                            <Card className="hover:shadow-xl transition-all overflow-hidden">
                              <div className="relative w-full h-48">
                                <Image
                                  src={tour.images?.[0]?.src || '/images/placeholder.jpg'}
                                  alt={tour.images?.[0]?.alt || `${tour.title} in ${destination.name}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                                {tour.difficulty && (
                                  <Badge className="absolute top-2 right-2 bg-amber-600">
                                    {tour.difficulty}
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-bold text-lg group-hover:text-amber-600 transition-colors">
                                  {tour.title}
                                </h4>
                                
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {tour.duration}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Users className="w-4 h-4 mr-2" />
                                    Max {tour.groupSize || '10'} people
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {tour.tags?.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t">
                                  <div>
                                    <span className="text-2xl font-bold text-amber-600">${tour.price}</span>
                                    <span className="text-sm text-gray-500 ml-1">/person</span>
                                  </div>
                                  {tour.rating && (
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                                      <span className="ml-1 font-medium">{tour.rating}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* National Parks */}
            {destination.parks && destination.parks.length > 0 && (
              <section id="parks" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">National Parks & Reserves</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {destination.parks.map((park: any, index: number) => (
                        <div key={park.name} className="border-b last:border-0 pb-6 last:pb-0">
                          <h4 className="font-bold text-xl mb-2">{park.name}</h4>
                          <p className="text-gray-600 mb-3">{park.description}</p>
                          {park.highlights && (
                            <div className="flex flex-wrap gap-2">
                              {park.highlights.map((h: string) => (
                                <Badge key={h} variant="secondary">{h}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Accommodations */}
            {destination.accommodations && destination.accommodations.length > 0 && (
              <section id="accommodations" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Where to Stay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {destination.accommodations.map((acc: any) => (
                        <div key={acc.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold">{acc.name}</h4>
                            <Badge variant="outline">{acc.type}</Badge>
                          </div>
                          {acc.description && (
                            <p className="text-sm text-gray-600">{acc.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Getting There */}
            {destination.gettingThere && (
              <section id="getting-there" className="scroll-mt-20">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Getting to {destination.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {destination.gettingThere.byAir && (
                        <div>
                          <h4 className="font-semibold mb-2">By Air</h4>
                          <p className="text-gray-600">{destination.gettingThere.byAir}</p>
                        </div>
                      )}
                      {destination.gettingThere.byRoad && (
                        <div>
                          <h4 className="font-semibold mb-2">By Road</h4>
                          <p className="text-gray-600">{destination.gettingThere.byRoad}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">What is the best time to visit {destination.name}?</h4>
                      <p className="text-gray-600">{destination.bestSeason}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">What wildlife can I see in {destination.name}?</h4>
                      <p className="text-gray-600">
                        You can see {destination.wildlife?.slice(0, 5).join(', ')}, 
                        and {destination.wildlife?.length - 5} more species.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">How many days should I spend in {destination.name}?</h4>
                      <p className="text-gray-600">
                        We recommend spending at least 3-4 days to fully experience {destination.name} and its wildlife.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Is {destination.name} safe for tourists?</h4>
                      <p className="text-gray-600">
                        Yes, {destination.name} is generally safe for tourists. Always follow your guide's instructions 
                        and park rules for a safe safari experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-sm text-gray-600">Country</div>
                  <div className="font-bold text-gray-900">{destination.country}</div>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-sm text-gray-600">Best Season</div>
                  <div className="font-bold text-gray-900">{destination.bestSeason?.split(',')[0]}</div>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <div className="text-sm text-gray-600">Available Tours</div>
                  <div className="font-bold text-gray-900">{stats.totalTours}</div>
                </div>
                {destination.elevation && (
                  <div className="border-l-4 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Elevation</div>
                    <div className="font-bold text-gray-900">{destination.elevation}</div>
                  </div>
                )}
                {destination.area && (
                  <div className="border-l-4 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Area</div>
                    <div className="font-bold text-gray-900">{destination.area}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Tours */}
            {tours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Popular Tours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tours.slice(0, 3).map(tour => (
                    <Link key={tour.id} href={`/tours/${tour.slug}`} className="block group">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={tour.images?.[0]?.src || '/images/placeholder.jpg'}
                            alt={tour.title}
                            fill
                            className="object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                            {tour.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-amber-600 font-bold text-sm">${tour.price}</span>
                            <span className="text-xs text-gray-500">{tour.duration?.split('/')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Conservation Info */}
            {destination.conservation && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Conservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">{destination.conservation.status}</p>
                  <div className="space-y-2">
                    {destination.conservation.efforts?.map((effort: string) => (
                      <div key={effort} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-sm text-gray-600">{effort}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keywords/Tags */}
            {destination.keywords && destination.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Related Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {destination.keywords.map((keyword: string) => (
                      <Link
                        key={keyword}
                        href={`/search?q=${encodeURIComponent(keyword)}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-amber-100 rounded-full text-sm transition-colors"
                      >
                        {keyword}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Card */}
            <Card className="border-2 border-amber-500 sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Plan Your Safari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                  asChild
                >
                  <Link href={`/contact?destination=${destination.slug}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Free Consultation
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                  size="lg"
                  asChild
                >
                  <Link href={`/tours?destination=${destination.slug}`}>
                    Browse All Tours
                  </Link>
                </Button>
                <div className="text-xs text-center text-gray-500">
                  <Phone className="w-3 h-3 inline mr-1" />
                  <a href="tel:+1234567890" className="hover:text-amber-600">
                    +1 (234) 567-890
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Explore Other Destinations</h2>
              <p className="text-gray-600 mt-2">Discover more safari experiences in East Africa</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedDestinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/destinations/${dest.slug}`} className="block group">
                    <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative w-full h-48">
                        <Image
                          src={dest.image}
                          alt={`${dest.name} - ${dest.country}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-amber-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dest.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{dest.country}</Badge>
                          <span className="text-sm text-gray-500">{dest.tourCount} tours</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Gallery */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsGalleryOpen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                title='Close Gallery'
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-amber-500"
              >
                <Minimize2 className="w-6 h-6" />
              </button>
              
              <button
                title='Previous Image'
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                }}
                className="absolute left-4 p-2 text-white hover:text-amber-500"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <Image
                src={galleryImages[currentImageIndex]}
                alt={`${destination.name} gallery image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              
              <button
                title='Next Image'
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 p-2 text-white hover:text-amber-500"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {galleryImages.map((_, index) => (
                  <button
                   title='Select Image'
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-6 bg-amber-500' 
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}