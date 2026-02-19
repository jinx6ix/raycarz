import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | RAYCARZ Tours & Safaris',
  description: 'Learn how we use cookies on our website. Understand cookie types, how to manage cookies, and your privacy preferences.',
  keywords: ['Cookie policy', 'Website cookies', 'Cookie management', 'Browser settings'],
};

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Required for website functionality. Enable user login, payment processing, and security. Cannot be disabled.',
      examples: 'Session tokens, security keys, language preferences',
      necessary: true,
    },
    {
      name: 'Performance Cookies',
      description: 'Help us understand how visitors use our website. Analyze page performance, load times, and user interactions.',
      examples: 'Page views, bounce rate, time on page, click tracking',
      necessary: false,
    },
    {
      name: 'Functional Cookies',
      description: 'Remember user preferences and settings. Enhance browsing experience with personalized features.',
      examples: 'Remember login, theme preference, tour filters, search history',
      necessary: false,
    },
    {
      name: 'Analytical Cookies',
      description: 'Provide insights into website traffic and user behavior. Help us improve services and content.',
      examples: 'Google Analytics, visitor demographics, pages visited, interaction time',
      necessary: false,
    },
    {
      name: 'Marketing Cookies',
      description: 'Track conversions and create audience segments for targeted marketing. Used by ad partners.',
      examples: 'Remarketing pixels, email signup tracking, ad performance',
      necessary: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-amber-600 hover:text-amber-700">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Cookie Policy</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600 text-lg">
            Understand how we use cookies and how to manage your preferences.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* What are Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They are widely used to improve user experience, remember preferences, and analyze website usage. Cookies cannot contain malicious code or harm your device.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you visit our website, we may set cookies to enhance your experience. Some cookies are essential for website functionality, while others help us understand and improve our services.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
        <div className="space-y-4 mb-8">
          {cookieTypes.map((type, idx) => (
            <Card key={idx} className={type.necessary ? 'border-red-200 bg-red-50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  {type.necessary && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Required</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Purpose:</p>
                  <p className="text-gray-700">{type.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Examples:</p>
                  <p className="text-gray-600 text-sm">{type.examples}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Manage Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">How to Manage Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Browser Controls</h3>
              <p className="text-gray-700 mb-3">
                Most browsers allow you to control cookies through settings:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2"><span className="font-medium min-w-fit">Chrome:</span> Settings {'>'} Privacy {'>'} Cookies and other site data</li>
                <li className="flex gap-2"><span className="font-medium min-w-fit">Firefox:</span> Preferences {'>'} Privacy {'>'} Cookies and site data</li>
                <li className="flex gap-2"><span className="font-medium min-w-fit">Safari:</span> Preferences {'>'} Privacy {'>'} Cookies and website data</li>
                <li className="flex gap-2"><span className="font-medium min-w-fit">Edge:</span> Settings {'>'} Privacy {'>'} Cookies and other site data</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Disabling essential cookies may affect website functionality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>You can clear cookies at any time through browser settings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Clearing cookies may log you out of your account</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Some preferences may need to be reset after clearing cookies</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Do Not Track */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Do Not Track (DNT)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Some browsers include a "Do Not Track" feature. We respect DNT signals and minimize tracking data collection for users with DNT enabled. However, some functionality may be limited.
            </p>
            <p className="text-gray-700">
              To enable DNT in your browser:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Chrome: Settings {'>'} Advanced {'>'} Privacy and security {'>'} Send "Do not track"</li>
              <li>• Firefox: Preferences {'>'} Privacy {'>'} Enhanced Tracking Protection</li>
              <li>• Safari: Preferences {'>'} Privacy {'>'} Prevent cross-site tracking</li>
            </ul>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Our website uses third-party services that may set their own cookies:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex gap-2"><span className="font-medium min-w-fit">Google Analytics:</span> Analyze website usage and user behavior</li>
              <li className="flex gap-2"><span className="font-medium min-w-fit">Payment Processors:</span> Securely process booking payments</li>
              <li className="flex gap-2"><span className="font-medium min-w-fit">Email Services:</span> Track email opens and clicks (with consent)</li>
              <li className="flex gap-2"><span className="font-medium min-w-fit">Social Media:</span> Integration for sharing and analytics</li>
            </ul>
            <p className="text-gray-700 text-sm mt-4">
              These services have their own privacy policies. We are not responsible for third-party cookies, but we ensure they comply with data protection standards.
            </p>
          </CardContent>
        </Card>

        {/* Policy Changes */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Questions About Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              For questions about our cookie policy or to manage your preferences, please contact us.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 font-medium"
            >
              Contact Us
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
