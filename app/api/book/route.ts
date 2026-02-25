import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
  tls: { rejectUnauthorized: false },
});

// Verify SMTP on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP Connection FAILED:', err.message);
  } else {
    console.log('SMTP READY – Tour booking emails will send!');
  }
});

export async function POST(request: NextRequest) {
  let bookingData: any;

  try {
    bookingData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'tourTitle', 'numberOfGuests', 'startDate', 'price'];
    const missingFields = requiredFields.filter((field) => !bookingData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const bookingId = `SAFARI${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.raycarz.com/';
    const adminEmail = process.env.HOST_EMAIL || process.env.SMTP_USER;

    // WhatsApp links
    const adminWhatsApp = 'https://wa.me/+254787644555'; // Update with your business number
    const customerPhone = bookingData.phone.replace(/[^0-9]/g, '').replace(/^0/, '254');
    const customerWhatsApp = `https://wa.me/${customerPhone}`;

    // === CUSTOMER CONFIRMATION EMAIL ===
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed #${bookingId}</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; color: #1f2937; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #92400e, #b45309); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
    .header p { margin: 8px 0 0; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .card { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 25px; margin-bottom: 25px; }
    .card h2 { margin: 0 0 15px; color: #92400e; font-size: 20px; border-bottom: 2px solid #fbbf24; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    td { padding: 10px 0; vertical-align: top; }
    .label { font-weight: 600; color: #92400e; width: 140px; }
    .value { color: #1f2937; }
    .highlight { background: #fef3c7; padding: 6px 12px; border-radius: 6px; font-family: 'Courier New'; font-size: 14px; font-weight: 600; }
    .btn { display: inline-block; background: #b45309; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 0; box-shadow: 0 4px 12px rgba(180,83,9,0.3); }
    .btn-wa { background: #25D366; }
    .help-box { background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 12px; padding: 25px; text-align: center; }
    .help-box h3 { margin: 0 0 15px; color: #059669; font-size: 18px; }
    .footer { background: #f3f4f6; padding: 30px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .footer a { color: #b45309; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Safari Booking Confirmed!</h1>
      <p>RAYCARZ Tours & Safaris</p>
    </div>
    <div class="content">
      <p style="font-size: 18px; margin-bottom: 25px;">Dear <strong>${bookingData.name}</strong>,</p>
      <p>Your safari booking for <strong>${bookingData.tourTitle}</strong> is confirmed! Our team will contact you within <strong>24 hours</strong> to finalize details and answer any questions.</p>

      <div class="card">
        <h2>Booking Summary</h2>
        <table>
          <tr><td class="label">Booking ID:</td><td class="value"><span class="highlight">${bookingId}</span></td></tr>
          <tr><td class="label">Tour:</td><td class="value">${bookingData.tourTitle}</td></tr>
          <tr><td class="label">Start Date:</td><td class="value">${bookingData.startDate}</td></tr>
          <tr><td class="label">Travelers:</td><td class="value">${bookingData.numberOfGuests} person${bookingData.numberOfGuests > 1 ? 's' : ''}</td></tr>
          <tr><td class="label">Total Price:</td><td class="value" style="font-weight:700; color:#dc2626; font-size:18px;">$${parseFloat(bookingData.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          ${bookingData.specialRequests ? `<tr><td class="label">Special Requests:</td><td class="value" style="font-style:italic; color:#6b7280;">${bookingData.specialRequests}</td></tr>` : ''}
        </table>
      </div>

      <div class="help-box">
        <h3>Need Immediate Assistance?</h3>
        <p>Chat with us instantly on WhatsApp for any questions about your booking:</p>
        <a href="${adminWhatsApp}?text=${encodeURIComponent(`Hi, I have a booking #${bookingId} for ${bookingData.tourTitle}`)}" class="btn btn-wa" target="_blank">
          Chat on WhatsApp
        </a>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #fafafa; border-radius: 8px; font-size: 14px; color: #6b7280;">
        <strong>Important:</strong>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li>Full payment is due 30 days before departure</li>
          <li>Travel insurance is highly recommended</li>
          <li>Check visa requirements for the destination country</li>
          <li>Our team will provide detailed itinerary and pre-trip information</li>
        </ul>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e5e7eb; font-size: 14px; color: #6b7280;">
        <p>Thank you for choosing RAYCARZ Tours & Safaris. We're excited to take you on an unforgettable African adventure!</p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;"><strong>RAYCARZ Tours & Safaris</strong></p>
      <p style="margin: 8px 0 0; opacity: 0.8;">
        <a href="tel:+254787644555">+254787644555</a> | 
        <a href="mailto:info@raycarz.com">info@raycarz.com</a>
      </p>
      <p style="margin: 8px 0 0; opacity: 0.7;">© 2025 RAYCARZ Tours & Safaris | All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
    `;

    // === ADMIN/HOST NOTIFICATION EMAIL ===
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking #${bookingId}</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; color: #1f2937; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 25px; margin-bottom: 25px; }
    .card h2 { margin: 0 0 15px; color: #166534; font-size: 18px; border-bottom: 2px solid #bbf7d0; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    td { padding: 10px 0; vertical-align: top; }
    .label { font-weight: 600; color: #166534; width: 120px; }
    .value { color: #065f46; }
    .highlight { background: #d1fae5; padding: 6px 12px; border-radius: 6px; font-family: 'Courier New'; font-weight: 600; }
    .btn { display: inline-block; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 4px; color: white; }
    .btn-wa { background: #25D366; }
    .footer { background: #f3f4f6; padding: 25px; text-align: center; font-size: 13px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Safari Booking!</h1>
      <p style="margin: 8px 0 0; opacity: 0.95;">Action Required</p>
    </div>
    <div class="content">
      <h2 style="margin: 0 0 20px; color: #059669; font-size: 24px;">Customer Information</h2>
      <div class="card">
        <table>
          <tr><td class="label">Name:</td><td class="value"><strong>${bookingData.name}</strong></td></tr>
          <tr><td class="label">Email:</td><td class="value"><a href="mailto:${bookingData.email}" style="color: #059669;">${bookingData.email}</a></td></tr>
          <tr><td class="label">Phone:</td><td class="value"><a href="tel:${bookingData.phone}" style="color: #059669;">${bookingData.phone}</a></td></tr>
          <tr><td class="label">Country:</td><td class="value">${bookingData.country || 'Not specified'}</td></tr>
        </table>
      </div>

      <h2 style="margin: 0 0 20px; color: #059669; font-size: 24px;">Booking Details</h2>
      <div class="card">
        <table>
          <tr><td class="label">Booking ID:</td><td class="value"><span class="highlight">${bookingId}</span></td></tr>
          <tr><td class="label">Tour:</td><td class="value"><strong>${bookingData.tourTitle}</strong></td></tr>
          <tr><td class="label">Start Date:</td><td class="value">${bookingData.startDate}</td></tr>
          <tr><td class="label">Travelers:</td><td class="value">${bookingData.numberOfGuests}</td></tr>
          <tr><td class="label">Total:</td><td class="value" style="font-weight: 700; color: #059669; font-size: 18px;">$${parseFloat(bookingData.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          ${bookingData.specialRequests ? `<tr><td class="label">Special Requests:</td><td class="value" style="font-style:italic; color:#6b7280;">${bookingData.specialRequests}</td></tr>` : ''}
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${customerWhatsApp}?text=${encodeURIComponent(`Hi ${bookingData.name}, thank you for your booking #${bookingId}. We're excited to help you plan your safari!`)}" class="btn btn-wa" target="_blank">
          Contact Customer on WhatsApp
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; text-align: center; font-style: italic; margin-top: 20px;">
        Submission Time: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })} (EAT)
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;"><strong>RAYCARZ Tours & Safaris Booking System</strong></p>
      <p style="margin: 8px 0 0; opacity: 0.8;">Automated notification - Please respond to customer within 24 hours</p>
    </div>
  </div>
</body>
</html>
    `;

    // === SEND EMAILS ===
    console.log(`[Booking ${bookingId}] Sending confirmation emails...`);
    const [custRes, adminRes] = await Promise.allSettled([
      transporter.sendMail({
        from: `"RAYCARZ Tours & Safaris" <${process.env.SMTP_USER}>`,
        to: bookingData.email,
        subject: `Booking Confirmed #${bookingId} – ${bookingData.tourTitle}`,
        html: customerEmailHtml,
      }),
      transporter.sendMail({
        from: `"Booking System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Booking #${bookingId} – ${bookingData.name}`,
        html: adminEmailHtml,
      }),
    ]);

    const customerSent = custRes.status === 'fulfilled';
    const adminSent = adminRes.status === 'fulfilled';

    if (!customerSent) {
      console.error(`[Booking ${bookingId}] Customer email failed:`, (custRes as any).reason?.message);
    }
    if (!adminSent) {
      console.error(`[Booking ${bookingId}] Admin email failed:`, (adminRes as any).reason?.message);
    }

    console.log(`[Booking ${bookingId}] Complete → Customer: ${customerSent ? '✓ SENT' : '✗ FAILED'}, Admin: ${adminSent ? '✓ SENT' : '✗ FAILED'}`);

    return NextResponse.json({
      success: true,
      bookingId,
      message: customerSent ? 'Booking confirmed! Check your email.' : 'Booking saved! We will contact you shortly.',
      customerEmailSent: customerSent,
      adminEmailSent: adminSent,
    });

  } catch (error: any) {
    console.error('[Booking API] ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Booking failed. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Safari Booking API endpoint. Use POST method to submit bookings.' },
    { status: 200 }
  );
}
