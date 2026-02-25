import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-amber-500">🦁</div>
              <h3 className="text-xl font-bold">RAYCARZ Tours & Safaris</h3>
              <p className="text-gray-400 text-sm">Creating unforgettable wildlife adventures.</p>
            </div>
            <div className="space-y-2 pt-4">
              <p className="text-sm text-gray-400">
                <strong>Email:</strong> info@raycarz.com
              </p>
              <p className="text-sm text-gray-400">
                <strong>Phone:</strong> +254787644555
              </p>
              <p className="text-sm text-gray-400">
                <strong>Location:</strong> Nairobi, Kenya
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Browse Tours
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-amber-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-bold text-lg mb-4">Destinations</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations/kenya" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Kenya Safaris
                </Link>
              </li>
              <li>
                <Link href="/destinations/tanzania" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Tanzania Tours
                </Link>
              </li>
              <li>
                <Link href="/destinations/uganda" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Uganda Gorilla Treks
                </Link>
              </li>
              <li>
                <Link href="/destinations/rwanda" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Rwanda Adventures
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-bold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Book a Tour
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8 space-y-4">
          {/* Social Links */}
          <div className="flex gap-4 justify-center md:justify-start">
            <a href="https://facebook.com/eastafricasafaritours" className="text-gray-400 hover:text-amber-500 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-1.751-.233-3.328-.233-3.385 0-5.747 2.138-5.747 6.053v1.48z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/raycarztourandsafaris?igsh=MWd6MXVqY2cxcG51bw==" className="text-gray-400 hover:text-amber-500 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="currentColor" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
            <a href="https://twitter.com/eastafricasafari" className="text-gray-400 hover:text-amber-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 0 11-4s1-6.75 0-7.25a3.75 3.75 0 00-.5-1z" />
              </svg>
            </a>
            <a href="https://youtube.com/eastafricasafaritours" className="text-gray-400 hover:text-amber-500 transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.175c-3.674-1.388-15.231-1.388-18.905 0C.359 4.563-1.5 15.75 1.688 21.575c3.39 4.175 13.345 4.3 17.147.175 3.28-4.125 5.065-16.875 1.775-18.325zM9.6 18v-11l6.4 5.5-6.4 5.5z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
            <p>
              &copy; {currentYear} RAYCARZ Tours & Safaris. All rights reserved. |{' '}
              <Link href="/legal/privacy" className="hover:text-amber-500 transition-colors">
                Privacy Policy
              </Link>{' '}
              |{' '}
              <Link href="/legal/terms" className="hover:text-amber-500 transition-colors">
                Terms of Service
              </Link>{' '}
              |{' '}
              <Link href="/legal/cookies" className="hover:text-amber-500 transition-colors">
                Cookies
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
