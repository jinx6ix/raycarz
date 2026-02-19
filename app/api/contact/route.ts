import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email';

interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactMessage;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    const missingFields = requiredFields.filter((field) => !body[field as keyof ContactMessage]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email notification (using existing email service)
    // In a production system, you'd want a separate contact email template
    const bookingDetails = {
      tourTitle: `Contact Form: ${body.subject}`,
      tourId: 'contact-form',
      name: body.name,
      email: body.email,
      phone: body.phone,
      country: 'N/A',
      numberOfGuests: 0,
      startDate: new Date().toISOString(),
      specialRequests: body.message,
      price: 0,
      currency: 'USD',
    };

    const emailSent = await sendBookingConfirmation(bookingDetails);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint. Use POST method to send messages.' },
    { status: 200 }
  );
}
