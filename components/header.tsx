'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tours', label: 'Tours' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/blog', label: 'Blog' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 items-center justify-between">
          {/* EVEN WIDER & taller-scaling logo */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
            <Image
              src="/logo-remove-background.com.png"
              alt="RAYCARZ Tours & Safaris Logo"
              width={620}
              height={124}
              priority
              className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 xl:h-32 object-contain"
            />
          </Link>

          {/* Desktop Navigation + CTA – scaled up spacing */}
          <div className="hidden md:flex md:items-center md:gap-5 lg:gap-7 xl:gap-9">
            <nav className="flex items-center gap-2.5 lg:gap-5 xl:gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className="text-gray-800 hover:text-amber-700 hover:bg-amber-50 px-4 lg:px-5 xl:px-7 text-sm lg:text-base xl:text-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <Link href="/booking">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-7 lg:px-9 xl:px-11 py-5 lg:py-6 xl:py-7 text-base lg:text-lg xl:text-xl font-medium transition-colors">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button – slightly larger touch target */}
          <button
            className="md:hidden rounded-md p-3 sm:p-3.5 text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen ? "true" : "false"}
          >
            {isOpen ? (
              <X className="h-9 w-9 sm:h-10 sm:w-10" />
            ) : (
              <Menu className="h-9 w-9 sm:h-10 sm:w-10" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer – increased text sizes for better readability */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b px-6 py-5 sm:py-6">
            <span className="text-xl sm:text-2xl font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-3 hover:bg-gray-100"
            >
              <X className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700" />
            </button>
          </div>

          <nav className="flex flex-col px-5 py-6 sm:py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-4 px-5 text-gray-800 hover:bg-amber-50 hover:text-amber-700 rounded-lg text-lg sm:text-xl font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-10 sm:mt-12 px-5">
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-7 sm:py-8 text-xl sm:text-2xl font-medium">
                  Book Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}