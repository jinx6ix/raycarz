# Email Configuration Guide for Safari Booking System

This guide explains how to set up the Nodemailer email system for your tour booking confirmations.

## Quick Start (Gmail - Easiest)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left menu
3. Scroll down to "2-Step Verification" and enable it
4. Follow Google's prompts

### Step 2: Create App Password
1. Go back to Security settings
2. Look for "App passwords" (only appears if 2FA is enabled)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-digit password
5. Copy this password (remove spaces)

### Step 3: Add to Environment Variables
Create `.env.local` in your project root and add:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
HOST_EMAIL=bookings@safaris-eastafrica.com
NEXT_PUBLIC_SITE_URL=https://safaris-eastafrica.com
```

### Step 4: Test
Run: `npm run dev` and test the booking form

---

## Alternative Email Providers

### Outlook / Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-username
SMTP_PASSWORD=your-ses-password
```

---

## Email Template Customization

### Customer Email Template
Located in: `/app/api/book/route.ts`

The customer email includes:
- Booking confirmation
- Booking ID
- Tour details
- Pricing
- WhatsApp support link
- Next steps information

**To customize:**
- Change company name: Replace "East Africa Safari Tours"
- Change colors: Modify the gradient colors in the header
- Change phone number: Update the WhatsApp link
- Change contact email: Update footer email

### Admin Email Template
The admin receives a different email with:
- Customer contact details
- Complete booking information
- WhatsApp link to contact customer
- Submission timestamp

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `SMTP_HOST` | Email server address | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` (TLS) or `465` (SSL) |
| `SMTP_SECURE` | Use SSL (false for TLS) | `false` |
| `SMTP_USER` | Email address to send from | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Email account password or app key | App password (Gmail) |
| `HOST_EMAIL` | Admin email to receive bookings | `admin@safaris-eastafrica.com` |
| `NEXT_PUBLIC_SITE_URL` | Your website URL | `https://safaris-eastafrica.com` |

---

## Troubleshooting

### "SMTP Connection FAILED"
- **Gmail**: Ensure 2FA is enabled and App Password is correct (16 digits)
- **Other providers**: Double-check SMTP credentials
- **Security**: Some providers block "less secure apps" - check security settings

### "Authentication failed"
- Verify SMTP_USER and SMTP_PASSWORD are correct
- Remove any spaces from the password
- Try copying from provider's documentation directly

### Emails not sending
1. Check server logs: Look for error messages in console
2. Verify email is valid format
3. Check if HOST_EMAIL environment variable is set
4. Test by viewing `/api/book` (should return success message)

### Emails going to spam
- Add your sender email to customer's contacts
- Gmail: Increase sending reputation by sending small volume first
- Add SPF/DKIM records to your domain (for production)

---

## Production Deployment

### Before going live:
1. ✅ Set real SMTP credentials in Vercel/Netlify environment variables
2. ✅ Update HOST_EMAIL to your business email
3. ✅ Update NEXT_PUBLIC_SITE_URL to your domain
4. ✅ Update company name in email templates if needed
5. ✅ Test a full booking flow
6. ✅ Monitor email logs for failures

### Email Rate Limiting
- Gmail: ~500 emails/day
- SendGrid: Depends on plan
- AWS SES: Depends on verified domain

For high volume, consider dedicated email service.

---

## Support

For issues with Nodemailer: https://nodemailer.com
For service-specific help, visit provider's support documentation.
