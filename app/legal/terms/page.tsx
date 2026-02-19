import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | RAYCARZ Tours & Safaris',
  description: 'Terms and conditions for booking safaris with RAYCARZ Tours & Safaris. Read our policies on cancellations, refunds, liability, and booking conditions.',
  keywords: ['Safari terms of service', 'Tour booking terms', 'Cancellation policy', 'Safari terms and conditions'],
};

export default function TermsPage() {
  const sections = [
    {
      id: 'booking',
      title: '1. Booking & Reservation Terms',
      content: `By booking a safari tour with RAYCARZ Tours & Safaris, you agree to these terms and conditions. All bookings are subject to availability and confirmation. A deposit of 30% is required to secure your booking, with full payment due 30 days before departure. Bookings made within 30 days of departure require full payment.`,
    },
    {
      id: 'cancellation',
      title: '2. Cancellation & Refund Policy',
      content: `Cancellations made more than 60 days before departure receive a full refund minus 10% administrative fee. Cancellations made 30-60 days before departure receive a 50% refund. Cancellations made less than 30 days before departure are non-refundable. No refunds are provided for cancellations due to traveler circumstances, medical conditions, or government restrictions.`,
    },
    {
      id: 'liability',
      title: '3. Liability & Risk Assumption',
      content: `Safari tourism involves inherent risks including wildlife encounters, variable weather, remote locations, and limited medical facilities. RAYCARZ Tours & Safaris is not liable for personal injury, death, loss of luggage, or property damage. Travelers participate at their own risk and assume all risks associated with safari activities. We are not responsible for airline operations, hotel services, or third-party service providers.`,
    },
    {
      id: 'documents',
      title: '4. Travel Documents & Visas',
      content: `Travelers are responsible for obtaining valid passports, visas, and travel insurance. We recommend checking visa requirements 3-6 months before travel. RAYCARZ Tours & Safaris is not liable for entry denials due to invalid documents. Vaccination certificates may be required - check current requirements with your embassy.`,
    },
    {
      id: 'health',
      title: '5. Health & Medical Conditions',
      content: `Travel to East Africa may involve health risks including malaria, altitude sickness, and limited medical facilities in remote areas. Consult your doctor before traveling. Travelers with pre-existing conditions must disclose them during booking. RAYCARZ Tours & Safaris is not liable for health complications or medical emergencies.`,
    },
    {
      id: 'conduct',
      title: '6. Traveler Conduct & Park Regulations',
      content: `All travelers must follow park regulations, guide instructions, and safety protocols. Violation of these terms may result in immediate removal from the tour without refund. Travelers must respect wildlife, environment, and local communities. Alcohol, drugs, and violent behavior are prohibited.`,
    },
    {
      id: 'modifications',
      title: '7. Itinerary Modifications',
      content: `While we plan detailed itineraries, weather, wildlife patterns, and unforeseen circumstances may require changes. RAYCARZ Tours & Safaris reserves the right to modify itineraries without prior notice. Safety is our priority - no refunds are offered for changes made for safety or operational reasons.`,
    },
    {
      id: 'payment',
      title: '8. Payment Terms',
      content: `We accept bank transfers, credit cards, and digital payment methods. Payment must be received in full before departure (unless alternative arrangements are made). Late payments may result in booking cancellation. Currency conversions are at current rates - any exchange rate changes are traveler responsibility.`,
    },
    {
      id: 'privacy',
      title: '9. Privacy & Personal Data',
      content: `Your personal information is protected under our Privacy Policy. We collect data necessary for bookings, communications, and legal compliance. We never share data with third parties except for travel arrangements and legal requirements. See our full Privacy Policy for detailed information.`,
    },
    {
      id: 'dispute',
      title: '10. Dispute Resolution',
      content: `Any disputes arising from tour bookings or services are governed by Kenyan law. We encourage resolution through direct communication. If unresolved, disputes may be escalated to arbitration. Travelers waive the right to legal action except through arbitration.`,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-amber-600 hover:text-amber-700">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Terms of Service</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 text-lg">
            Please read these terms carefully before booking your East Africa safar experience.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025. These terms may be updated at any time.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-amber-50 border-y">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm"
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
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Questions About Our Terms?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about these terms and conditions, please contact our team.
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
      </div>
    </main>
  );
}
