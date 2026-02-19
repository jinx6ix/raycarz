import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Big Five Safari Kenya & Tanzania Tours | East Africa Wildlife Safaris',
  description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda. Book affordable wildlife tours, wildebeest migration, and gorilla trekking adventures with expert guides.',
  keywords: ['Big 5 Safari Kenya', 'Cheap Safaris Kenya', 'Tanzania Safaris', 'Wildebeest Migration', 'Uganda Gorilla Trekking', 'Rwanda Tours', 'Wildlife Safari', 'East Africa Tours'],
  generator: 'Next.js',
  applicationName: 'RAYCARZ Tours & Safaris',
  creator: 'RAYCARZ Tours & Safaris',
  publisher: 'RAYCARZ Tours & Safaris',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://safaris-eastafrica.com',
    siteName: 'RAYCARZ Tours & Safaris',
    title: 'Big Five Safari Kenya & Tanzania Tours | East Africa Wildlife Safaris',
    description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda. Book affordable wildlife tours, wildebeest migration, and gorilla trekking adventures.',
    images: [
      {
        url: 'https://safaris-eastafrica.com/images/logo-remove-background.com.png',
        width: 1200,
        height: 630,
        alt: 'Big Five Safari Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Five Safari Kenya & Tanzania Tours',
    description: 'Experience the ultimate Big 5 Safari in Kenya, Tanzania, Uganda, and Rwanda.',
    creator: '@EastAfricaSafaris',
  },
  alternates: {
    canonical: 'https://safaris-eastafrica.com',
  },
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
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
