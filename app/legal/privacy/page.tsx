import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | RAYCARZ Tours & Safaris',
  description: 'Our privacy policy explains how we collect, use, and protect your personal data. Learn about our data protection practices and your rights.',
  keywords: ['Privacy policy', 'Data protection', 'Personal information', 'GDPR compliance'],
};

export default function PrivacyPage() {
  const sections = [
    {
      id: 'overview',
      title: '1. Privacy Overview',
      content: `RAYCARZ Tours & Safaris is committed to protecting your privacy and personal data. We collect minimal necessary information for booking, communication, and legal compliance. Your data is encrypted, secure, and never sold to third parties. This policy complies with international data protection standards including GDPR.`,
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content: `We collect: (1) Booking information: name, email, phone, address, passport details, payment information; (2) Communication data: emails, phone calls, feedback; (3) Technical data: IP address, browser type, website usage patterns; (4) Health information: medical conditions relevant to safari safety. We only collect information you provide or that is necessary for service delivery.`,
    },
    {
      id: 'usage',
      title: '3. How We Use Your Information',
      content: `Your data is used to: Process bookings and send confirmations; Communicate about your safari; Send updates and newsletters (with consent); Process payments securely; Improve our services; Comply with legal obligations; Send safety and medical information to guides; Contact you about changes or emergencies. We do not use data for marketing without your explicit consent.`,
    },
    {
      id: 'sharing',
      title: '4. Data Sharing & Third Parties',
      content: `We share data only as necessary with: Payment processors (securely); Accommodation and activity providers; Airlines and transport companies; Guides and logistics partners. We never sell, rent, or share data for marketing. Data is shared under strict confidentiality agreements. All third parties comply with data protection standards.`,
    },
    {
      id: 'security',
      title: '5. Data Security',
      content: `Your data is protected by: SSL/TLS encryption for all transmissions; Secure password protection; Regular security audits; Limited staff access; Secure servers in data centers. While we implement best practices, no online system is 100% secure. We are not liable for unauthorized access due to circumstances beyond our control.`,
    },
    {
      id: 'retention',
      title: '6. Data Retention',
      content: `We retain booking data for 7 years (for accounting and legal requirements). Communication records are kept for 2 years. You can request deletion of personal data at any time (subject to legal retention requirements). Marketing preferences can be changed or withdrawn at any time.`,
    },
    {
      id: 'rights',
      title: '7. Your Privacy Rights',
      content: `You have the right to: Access your personal data; Correct inaccurate data; Request deletion (subject to legal holds); Object to processing; Withdraw consent for marketing; Data portability; File complaints with data protection authorities. To exercise these rights, email privacy@safaris-eastafrica.com with your request.`,
    },
    {
      id: 'cookies',
      title: '8. Cookies & Tracking',
      content: `Our website uses cookies for: Session management; User preferences; Analytics; Advertising (with consent). You can disable cookies in your browser settings. Some functionality may not work without cookies. See our Cookie Policy for detailed information.`,
    },
    {
      id: 'children',
      title: '9. Children\'s Privacy',
      content: `Our services are not intentionally directed at children under 13. We do not knowingly collect data from children without parental consent. Parents/guardians are responsible for providing accurate information about minors. If we discover we\'ve collected data from children without consent, we will delete it immediately.`,
    },
    {
      id: 'changes',
      title: '10. Policy Changes',
      content: `We may update this policy to reflect legal changes, new practices, or service improvements. Updates are posted on this page with a new "last updated" date. Continued use of our services constitutes acceptance of updated policies. We will notify you of significant changes via email.`,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-amber-600 hover:text-amber-700">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Privacy Policy</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">
            We are committed to protecting your personal data and respecting your privacy.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025. This policy is GDPR compliant.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-blue-50 border-y">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {sections.map(section => (
            <Card key={section.id} id={section.id} className="scroll-mt-4">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}

          {/* Contact Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Privacy Concerns?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                To exercise your privacy rights or report concerns, contact:
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-medium text-gray-900">Data Privacy Officer</p>
                <p className="text-gray-600">Email: privacy@safaris-eastafrica.com</p>
              </div>
              <Link
                href="/contact"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Contact Us
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
