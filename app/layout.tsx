import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"

import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Big Five Safari Kenya & Tanzania Tours | East Africa Wildlife Safaris | RAYCARZ',
  description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda with RAYCARZ Tours & Safaris. Book affordable wildlife tours, wildebeest migration, and gorilla trekking adventures with expert guides.',
  keywords: ['Big 5 Safari Kenya', 'Cheap Safaris Kenya', 'Tanzania Safaris', 'Wildebeest Migration', 'Uganda Gorilla Trekking', 'Rwanda Tours', 'Wildlife Safari', 'East Africa Tours', 'RAYCARZ Safaris', 'Africa Safari Packages'],
  generator: 'Next.js',
  applicationName: 'RAYCARZ Tours & Safaris',
  creator: 'RAYCARZ Tours & Safaris',
  publisher: 'RAYCARZ Tours & Safaris',
  robots: 'index, follow',
  authors: [{ name: 'RAYCARZ Tours & Safaris' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://raycarz.com',
    siteName: 'RAYCARZ Tours & Safaris',
    title: 'Big Five Safari Kenya & Tanzania Tours | East Africa Wildlife Safaris | RAYCARZ',
    description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda. Book affordable wildlife tours, wildebeest migration, and gorilla trekking adventures with RAYCARZ expert guides.',
    images: [
      {
        url: 'https://raycarz.com/logo-remove-background.com.png',
        width: 1200,
        height: 630,
        alt: 'RAYCARZ Big Five Safari Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Five Safari Kenya & Tanzania Tours | RAYCARZ',
    description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda with RAYCARZ Tours & Safaris.',
    creator: '@RAYCARZSafaris',
    site: '@RAYCARZSafaris',
  },
  alternates: {
    canonical: 'https://raycarz.com',
  },
  verification: {
    google: 'z9vZ7cXUSL4_AmLJqmOiaRC5VROLggVAci1ptZycdwU',
  },
  category: 'Travel & Tourism',
  classification: 'Safari Tours',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#5f4a38',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="z9vZ7cXUSL4_AmLJqmOiaRC5VROLggVAci1ptZycdwU" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}