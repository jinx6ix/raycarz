# Testing the Email Booking System

This guide walks you through testing the booking email functionality before deployment.

## Prerequisites

1. ✅ Node.js 18+ installed
2. ✅ Environment variables configured (see EMAIL_SETUP.md)
3. ✅ Project running: `npm run dev`

## Testing Checklist

### 1. Verify SMTP Connection
The system automatically tests SMTP on startup. Check terminal output:

```
SMTP READY – Tour booking emails will send!
```

If you see an error, check your EMAIL_SETUP.md configuration.

### 2. Test Direct API Call

Use curl or Postman to test the API directly:

```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "test@example.com",
    "phone": "+1234567890",
    "country": "United States",
    "tourTitle": "Big Five Safari Kenya",
    "numberOfGuests": 2,
    "startDate": "2025-07-15",
    "price": 2499,
    "specialRequests": "Window seat preferred"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "bookingId": "SAFARI1702345678-A1B2C3D4",
  "message": "Booking confirmed! Check your email.",
  "customerEmailSent": true,
  "adminEmailSent": true
}
```

### 3. Test via Booking Form

1. Navigate to: http://localhost:3000/booking
2. Fill out the form:
   - Tour: Select any tour
   - Name: Your test name
   - Email: Your test email (use a real email to receive the confirmation)
   - Phone: Your phone number
   - Country: Your country
   - Guests: 2
   - Date: Any future date
3. Click "Submit Booking"

**What to look for:**
- ✅ Success message appears
- ✅ Booking ID is displayed
- ✅ Email arrives in your inbox within 1-2 minutes
- ✅ Admin email arrives to HOST_EMAIL

### 4. Verify Email Contents

**Customer Email should have:**
- ✅ Booking confirmation header
- ✅ Booking ID (unique identifier)
- ✅ Tour name
- ✅ Start date
- ✅ Number of travelers
- ✅ Total price in bold red
- ✅ WhatsApp support link
- ✅ Important notes about payment
- ✅ Company footer with contact info

**Admin Email should have:**
- ✅ New Booking header (green theme)
- ✅ Customer name, email, phone
- ✅ Customer country
- ✅ Booking details
- ✅ WhatsApp link to contact customer
- ✅ Submission timestamp

### 5. Test Email Scenarios

#### Scenario 1: Multiple Guests
- **Guests**: 5 people
- **Expected**: Email should show "5 persons" (plural)

#### Scenario 2: Special Requests
- **Special Requests**: "Vegetarian meals needed"
- **Expected**: Request appears in both emails

#### Scenario 3: Invalid Email
- **Email**: "notanemail"
- **Expected**: Form validation error (not submitted)

#### Scenario 4: Missing Fields
- **Skip**: First name field
- **Expected**: Form validation error

### 6. Monitor Console Logs

In your terminal where `npm run dev` is running, you'll see logs like:

```
[Booking SAFARI1702345678-A1B2C3D4] Sending confirmation emails...
[Booking SAFARI1702345678-A1B2C3D4] Complete → Customer: ✓ SENT, Admin: ✓ SENT
```

**Error logs to watch for:**
- `SMTP Connection FAILED` - Configuration issue
- `Customer email failed` - Problem reaching customer email server
- `Admin email failed` - Problem reaching admin email server

---

## Troubleshooting Test Issues

### Email not arriving (Customer)
1. Check spam/junk folder
2. Verify customer email address was typed correctly
3. Check console logs for send errors
4. If using Gmail: Add sender to contacts to whitelist

### Email not arriving (Admin)
1. Verify HOST_EMAIL environment variable
2. Check if admin email address is valid
3. Check spam folder in admin email account
4. Verify SMTP credentials haven't changed

### Form won't submit
1. Check browser console for JavaScript errors
2. Verify all required fields are filled
3. Check that `/api/book` endpoint is responding
4. Test API directly with curl to isolate the issue

### Emails have wrong company name
1. Find the email template in `/app/api/book/route.ts`
2. Look for "RAYCARZ Tours & Safaris"
3. Replace with your company name
4. Restart the dev server

### Wrong phone number in WhatsApp link
1. Open `/app/api/book/route.ts`
2. Find `adminWhatsApp = 'https://wa.me/254726485228'`
3. Replace 254726485228 with your WhatsApp number (country code + number, no spaces)
4. Restart server

---

## Email Template Files

The email templates are embedded in `/app/api/book/route.ts`:

- **Lines 74-179**: Customer email template
- **Lines 181-280**: Admin email template

To customize styling, colors, or text, edit these sections directly.

---

## Performance Notes

- Email sending is asynchronous (doesn't block the booking)
- If email fails, booking is still saved and success response is returned
- Response indicates whether emails were sent successfully
- Failed emails are logged to console for debugging

---

## Next Steps

Once testing is complete and working:

1. Update company details in email templates
2. Update WhatsApp phone number
3. Deploy to production
4. Update SMTP credentials in hosting provider's environment variables
5. Monitor booking confirmations in production

For detailed setup instructions, see EMAIL_SETUP.md
