import nodemailer from 'nodemailer'

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface BookingDetails {
  tourTitle: string
  tourId: string
  name: string
  email: string
  phone: string
  country: string
  numberOfGuests: number
  startDate: string
  specialRequests?: string
  price: number
  currency: string
}

export async function sendBookingConfirmation(
  booking: BookingDetails
): Promise<boolean> {
  try {
    const hostEmail = process.env.HOST_EMAIL || 'bookings@safaris-eastafrica.com'

    // Email to customer
    const customerMailOptions = {
      from: process.env.SMTP_FROM || 'noreply@safaris-eastafrica.com',
      to: booking.email,
      subject: `Booking Confirmation - ${booking.tourTitle}`,
      html: generateCustomerEmailHTML(booking),
    }

    // Email to host
    const hostMailOptions = {
      from: process.env.SMTP_FROM || 'noreply@safaris-eastafrica.com',
      to: hostEmail,
      subject: `New Booking: ${booking.tourTitle}`,
      html: generateHostEmailHTML(booking),
    }

    // Send both emails
    await transporter.sendMail(customerMailOptions)
    await transporter.sendMail(hostMailOptions)

    return true
  } catch (error) {
    console.error('Error sending booking email:', error)
    return false
  }
}

function generateCustomerEmailHTML(booking: BookingDetails): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #5f4a38;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px -20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .booking-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #8b7355;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #5f4a38;
            width: 40%;
          }
          .detail-value {
            color: #666;
            width: 60%;
            text-align: right;
          }
          .total-row {
            background-color: #5f4a38;
            color: white;
            padding: 12px;
            border-radius: 4px;
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background-color: #8b7355;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          
          <h2>Dear ${booking.name},</h2>
          <p>Thank you for booking your safari tour with RAYCARZ Tours & Safaris! We're excited to welcome you on an unforgettable adventure.</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Tour:</span>
              <span class="detail-value">${booking.tourTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span>
              <span class="detail-value">${booking.numberOfGuests}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">${new Date(booking.startDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${booking.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${booking.phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Country:</span>
              <span class="detail-value">${booking.country}</span>
            </div>
            ${booking.specialRequests ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span>
              <span class="detail-value">${booking.specialRequests}</span>
            </div>
            ` : ''}
            <div class="total-row">
              <span>Total Price:</span>
              <span>${booking.currency} ${booking.price.toFixed(2)}</span>
            </div>
          </div>
          
          <p>Our team will contact you shortly to confirm the final details and payment arrangements.</p>
          
          <p><strong>What to expect next:</strong></p>
          <ul>
            <li>Confirmation of your booking within 24 hours</li>
            <li>Payment instructions will be sent to your email</li>
            <li>Pre-tour information and packing list</li>
            <li>Emergency contact details and travel insurance recommendations</li>
          </ul>
          
          <p>If you have any questions, don't hesitate to reach out to our team.</p>
          
          <p>Best regards,<br><strong>RAYCARZ Tours & Safaris Team</strong></p>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message. Contact us at bookings@safaris-eastafrica.com</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateHostEmailHTML(booking: BookingDetails): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #5f4a38;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px -20px;
          }
          .booking-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #8b7355;
            margin: 20px 0;
          }
          .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: 600;
            color: #5f4a38;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Received</h1>
          </div>
          
          <h2>New Booking Details:</h2>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">Tour:</span> ${booking.tourTitle}
            </div>
            <div class="detail-row">
              <span class="detail-label">Tour ID:</span> ${booking.tourId}
            </div>
            <div class="detail-row">
              <span class="detail-label">Guest Name:</span> ${booking.name}
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span> ${booking.email}
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span> ${booking.phone}
            </div>
            <div class="detail-row">
              <span class="detail-label">Country:</span> ${booking.country}
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span> ${booking.numberOfGuests}
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date:</span> ${new Date(booking.startDate).toLocaleDateString()}
            </div>
            <div class="detail-row">
              <span class="detail-label">Price:</span> ${booking.currency} ${booking.price.toFixed(2)}
            </div>
            ${booking.specialRequests ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span> ${booking.specialRequests}
            </div>
            ` : ''}
          </div>
          
          <p><strong>Action Required:</strong> Please contact the guest at ${booking.email} or ${booking.phone} to confirm the booking and arrange payment.</p>
        </div>
      </body>
    </html>
  `
}
