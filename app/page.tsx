import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import tours from "@/data/tours.json";
import destinations from "@/data/destinations.json";

export const metadata = {
  title: "African Safari Tours | Kenya Tanzania Uganda Rwanda | Book Now",
  description: "Discover the best African safari tours in Kenya, Tanzania, Uganda, and Rwanda. Big Five wildlife, gorilla trekking, Kilimanjaro, and Serengeti migrations. Affordable safari packages with expert guides.",
  keywords: "safari tours, African safari, Kenya safari, Tanzania safari, Uganda gorilla trek, Rwanda wildlife, Big Five, Masai Mara, Serengeti",
  openGraph: {
    title: "African Safari Tours | Kenya Tanzania Uganda Rwanda",
    description: "Book unforgettable African safaris in East Africa. See Big Five animals, trek mountain gorillas, and experience wildlife adventures.",
    images: [
      {
        url: "/images/tours/big-five-masai-mara-1.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Home() {
  // Get featured tours
  const featuredTours = tours.slice(0, 6);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full py-20 px-4 md:py-32 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-pretty">
                  Unforgettable African Safari Adventures
                </h1>
                <p className="text-xl text-gray-600 text-pretty">
                  Experience the Big Five, witness the wildebeest migration, and trek mountain gorillas in Kenya, Tanzania, Uganda, and Rwanda.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Link href="/tours">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Browse All Tours
                  </Button>
                </Link>
                <Link href="/destinations">
                  <Button size="lg" variant="outline">
                    Explore Destinations
                  </Button>
                </Link>
              </div>
              <div className="flex gap-6 pt-4 text-sm">
                <div>
                  <div className="font-bold text-2xl text-amber-600">33+</div>
                  <p className="text-gray-600">Expert-Curated Tours</p>
                </div>
                <div>
                  <div className="font-bold text-2xl text-amber-600">4</div>
                  <p className="text-gray-600">East African Countries</p>
                </div>
                <div>
                  <div className="font-bold text-2xl text-amber-600">4.8★</div>
                  <p className="text-gray-600">Avg. Guest Rating</p>
                </div>
              </div>
            </div>
            <div className="relative w-full h-96 md:h-96 lg:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/big-five-masai-mara-1.jpg"
                alt="Lions in natural habitat during Big Five Safari Kenya Masai Mara"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore East African Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Discover the best safari experiences across Kenya, Tanzania, Uganda, and Rwanda.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.id} href={`/destinations/${destination.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={destination.image}
                      alt={`${destination.name} safari destination`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {destination.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights?.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="secondary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Safari Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              Handpicked safari experiences from Big Five wildlife to gorilla trekking.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <Link key={tour.id} href={`/tours/${tour.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col">
                  <div className="relative w-full h-48">
                    {tour.images?.[0] && (
                      <Image
                        src={tour.images[0].src}
                        alt={tour.images[0].alt}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardHeader className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg line-clamp-2">{tour.title}</CardTitle>
                        <CardDescription>{tour.duration}</CardDescription>
                      </div>
                      {tour.rating && (
                        <div className="text-right">
                          <div className="font-bold text-amber-600">{tour.rating}★</div>
                          <div className="text-xs text-gray-500">({tour.reviewCount})</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{tour.shortDescription}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        {tour.originalPrice && (
                          <div className="text-xs text-gray-400 line-through">${tour.originalPrice}</div>
                        )}
                        <div className="text-2xl font-bold text-amber-600">${tour.price}</div>
                        <div className="text-xs text-gray-500">{tour.groupSize}</div>
                      </div>
                      <Badge variant="secondary">{tour.difficulty}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center pt-6">
            <Link href="/tours">
              <Button size="lg" variant="outline">
                View All 33 Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Our Safari Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best African safari experiences with expert guides, comfortable accommodations, and unforgettable wildlife encounters.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Expert Guides",
                description: "Professional guides with years of wildlife expertise and knowledge of animal behavior.",
                icon: "🦁",
              },
              {
                title: "Best Value",
                description: "Affordable safari packages from budget options to luxury experiences.",
                icon: "💰",
              },
              {
                title: "Safety First",
                description: "Experienced teams ensuring your safety during all activities and game drives.",
                icon: "✓",
              },
              {
                title: "Flexible Booking",
                description: "Custom itineraries, group discounts, and easy cancellation policies.",
                icon: "📅",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 bg-slate-50">
                <CardHeader className="space-y-4">
                  <div className="text-4xl">{item.icon}</div>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-pretty">
            Ready for Your African Safari Adventure?
          </h2>
          <p className="text-lg opacity-90 text-pretty">
            Book your safari tour today and experience the magic of East African wildlife.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/tours">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-gray-100 w-full sm:w-auto">
                Browse All Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
