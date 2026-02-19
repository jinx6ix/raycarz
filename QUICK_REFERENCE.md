# Quick Reference - Safari Booking System

## Fast Setup (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo>
cd <your-project>
npm install

# 2. Configure email
cp .env.example .env.local
# Edit .env.local with your Gmail App Password

# 3. Run
npm run dev

# 4. Test
# Visit http://localhost:3000/booking
```

## API Endpoints

### POST `/api/book` - Submit Booking
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "United States",
  "tourTitle": "Big Five Safari Kenya",
  "numberOfGuests": 2,
  "startDate": "2025-07-15",
  "price": 2499,
  "specialRequests": "Window seat"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "SAFARI1702345678-A1B2C3D4",
  "message": "Booking confirmed! Check your email.",
  "customerEmailSent": true,
  "adminEmailSent": true
}
```

## File Locations

| File | Purpose |
|------|---------|
| `/app/api/book/route.ts` | Booking API + email templates |
| `/app/booking/page.tsx` | Booking form UI |
| `/data/tours.json` | 33 safari tours |
| `/data/destinations.json` | Kenya, Tanzania, Uganda, Rwanda |
| `/.env.local` | Your SMTP credentials |
| `/.env.example` | Credentials template |

## Email Template Variables

In `/app/api/book/route.ts`, customize:

```javascript
const bookingId = `SAFARI${Date.now()}-...`  // Unique ID
const adminEmail = process.env.HOST_EMAIL     // Admin recipient
const adminWhatsApp = 'https://wa.me/...'     // Support number
```

## Common Customizations

### Change Company Name (8 places)
File: `/app/api/book/route.ts`
```
Search: "RAYCARZ Tours & Safaris"
Replace: "Your Company Name"
```

### Change Email Colors
File: `/app/api/book/route.ts`

Customer email:
- `#b45309` = Dark amber (headers)
- `#fcd34d` = Light amber (cards)

Admin email:
- `#10b981` = Dark green (headers)
- `#bbf7d0` = Light green (cards)

### Change WhatsApp Number
File: `/app/api/book/route.ts`, line ~53
```javascript
const adminWhatsApp = 'https://wa.me/254726485228'  // Change this
```

### Change Admin Email Address
File: `.env.local`
```
HOST_EMAIL=your-email@yourdomain.com
```

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `SMTP_HOST` | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | Yes | `587` |
| `SMTP_USER` | Yes | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Yes | `xxxx xxxx xxxx xxxx` |
| `HOST_EMAIL` | Yes | `admin@domain.com` |
| `NEXT_PUBLIC_SITE_URL` | No | `https://domain.com` |

## Gmail Setup (Fastest)

1. Enable 2FA: https://myaccount.google.com
2. Create app password: Security → App passwords
3. Copy 16-digit code (remove spaces)
4. Add to `.env.local`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxxxxxxxxxxxxxx
```

## Testing Email Flow

```bash
# 1. Start server
npm run dev

# 2. Watch console for SMTP status
# Should see: "SMTP READY – Tour booking emails will send!"

# 3. Visit booking form
# http://localhost:3000/booking

# 4. Fill and submit
# Should see: "Booking confirmed! Check your email."

# 5. Check console for logs
# [Booking SAFARI...] Complete → Customer: ✓ SENT, Admin: ✓ SENT

# 6. Verify emails arrived
# Check inbox + spam folder
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SMTP Connection FAILED | Check credentials in .env.local |
| Email in spam | Add sender to contacts |
| Missing email field | Check NEXT_PUBLIC_SITE_URL |
| Wrong company name | Replace in `/app/api/book/route.ts` |
| Forms won't submit | Check `/api/book` endpoint responds |

## Production Checklist

- [ ] Update SMTP credentials in hosting dashboard
- [ ] Set HOST_EMAIL to your business email
- [ ] Update NEXT_PUBLIC_SITE_URL to your domain
- [ ] Customize company name in email templates
- [ ] Update WhatsApp phone number
- [ ] Test full booking flow
- [ ] Monitor first few bookings
- [ ] Set up backup SMTP provider

## Monitoring

**Check console logs:**
```
[Booking SAFARI...] Sending confirmation emails...
[Booking SAFARI...] Complete → Customer: ✓ SENT, Admin: ✓ SENT
```

**Failed email indicators:**
```
[Booking SAFARI...] Customer email failed: [error]
[Booking SAFARI...] Admin email failed: [error]
```

## Website Structure

```
Homepage → Tours Listing → Tour Details → Booking Form → Confirmation Email
                                              ↓
                                         Admin Email
```

## Key Features Included

✅ 33 safari tours across 4 countries
✅ Professional HTML email templates
✅ Automatic SMTP verification
✅ Unique booking IDs
✅ WhatsApp support integration
✅ Form validation
✅ Error handling
✅ Responsive email design
✅ Dual notifications (customer + admin)
✅ Production-ready code

## Contact & Support

**Email**: bookings@safaris-eastafrica.com
**WhatsApp**: +254 726 485 228
**Docs**: See EMAIL_SETUP.md, TESTING_EMAILS.md, EMAIL_IMPLEMENTATION.md

---

**Last Updated**: February 2025
**Status**: ✅ Production Ready
