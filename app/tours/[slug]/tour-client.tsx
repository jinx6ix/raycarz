'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import TourBookingForm from '@/components/tour-booking-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Tour } from './types';

interface TourClientProps {
  tour: Tour;
  relatedTours: Tour[];
}

export default function TourClient({ tour, relatedTours }: TourClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Adjust based on card width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Images */}
      <section className="w-full">
        <div className="relative w-full h-96 md:h-96 lg:h-96">
          {tour.images?.[0] && (
            <Image
              src={tour.images[0].src}
              alt={tour.images[0].alt}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-2 mb-4">
                <Badge className="bg-amber-500">{tour.country}</Badge>
                <Badge variant="secondary">{tour.difficulty}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance">{tour.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="border-l-2 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-bold text-gray-900">{tour.duration}</div>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Group Size</div>
                    <div className="font-bold text-gray-900">{tour.groupSize}</div>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Best Season</div>
                    <div className="font-bold text-gray-900 text-sm">{tour.bestSeason}</div>
                  </div>
                  <div className="border-l-2 border-amber-500 pl-4">
                    <div className="text-sm text-gray-600">Rating</div>
                    <div className="font-bold text-gray-900">{tour.rating}★ ({tour.reviewCount})</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Day-by-Day Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tour.itinerary?.map(day => (
                  <div key={day.day} className="pb-6 border-b last:border-b-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold">
                          {day.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{day.title}</h4>
                        <p className="text-gray-600 mt-2">{day.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included & Excluded</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Included</h4>
                  <ul className="space-y-2">
                    {tour.included?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-bold text-gray-900 mb-4">Not Included</h4>
                  <ul className="space-y-2">
                    {tour.notIncluded?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-gray-400 font-bold mt-1">○</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {tour.images && tour.images.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tour.images.map((image, idx) => (
                      <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-6">
            <TourBookingForm 
              tour={{
                id: tour.id,
                title: tour.title,
                price: tour.price,
                currency: tour.currency,
                duration: tour.duration,
                groupSize: tour.groupSize,
                difficulty: tour.difficulty,
                bestSeason: tour.bestSeason,
                originalPrice: tour.originalPrice
              }}
            />

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <span className="text-amber-600 font-bold">★</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Keywords */}
            {tour.keywords && tour.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tour Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tour.keywords.map(keyword => (
                      <Badge key={keyword} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-12 px-4 md:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Related Tours</h2>
                <p className="text-gray-600">Explore similar safari experiences</p>
              </div>
              
              {/* Scroll Controls */}
              {relatedTours.length > 6 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('left')}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll('right')}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Scrollable Tours Container */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {relatedTours.map(relatedTour => (
                  <Link 
                    key={relatedTour.id} 
                    href={`/tours/${relatedTour.slug}`}
                    className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col">
                      <div className="relative w-full h-40">
                        {relatedTour.images?.[0] && (
                          <Image
                            src={relatedTour.images[0].src}
                            alt={relatedTour.images[0].alt}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <CardHeader className="flex-1">
                        <CardTitle className="text-base line-clamp-2">{relatedTour.title}</CardTitle>
                        <CardDescription>{relatedTour.duration}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-xl font-bold text-amber-600">${relatedTour.price}</div>
                          <Badge variant="secondary">{relatedTour.difficulty}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Gradient Fade Effect */}
              {relatedTours.length > 6 && (
                <>
                  <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}