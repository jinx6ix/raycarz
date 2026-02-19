import { notFound } from 'next/navigation';
import tours from '@/data/tours.json';
import TourClient from './tour-client';
import { Tour } from './types';

export function generateStaticParams() {
  return tours.map(tour => ({
    slug: tour.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tours.find(t => t.slug === slug);
  
  if (!tour) {
    return {};
  }

  return {
    title: `${tour.title} | African Safari Tours`,
    description: tour.description,
    keywords: tour.keywords?.join(', '),
    openGraph: {
      title: tour.title,
      description: tour.shortDescription,
      images: tour.images?.[0] ? [{
        url: tour.images[0].src,
        width: 1200,
        height: 630,
      }] : [],
    },
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tours.find(t => t.slug === slug);

  if (!tour) {
    notFound();
  }

  // Get all related tours (not just 3)
  const relatedTours = tour.relatedTours?.map(id => tours.find(t => t.id === id)).filter(Boolean) as Tour[] || [];

  return <TourClient tour={tour} relatedTours={relatedTours} />;
}