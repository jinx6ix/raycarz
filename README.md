# RAYCARZ Tours & Safaris - Complete Website

A production-ready Next.js website for RAYCARZ Tours & Safaris featuring 33+ curated safari experiences, booking system, and comprehensive SEO optimization.

## 🌍 Features

### Core Features
- **33+ Safari Tours** - Big Five safaris, wildebeest migration, gorilla trekking, mountain climbing, and specialized experiences
- **4 Destinations** - Kenya, Tanzania, Uganda, Rwanda with detailed destination pages
- **Dynamic Tour Pages** - Individual pages with itineraries, pricing, galleries, and related tours
- **Booking System** - Complete booking form with email notifications via Nodemailer
- **Contact Form** - Email-based contact system for customer inquiries

### Pages & Sections
- **Homepage** - Hero section, featured tours, destination highlights, why choose us, testimonials
- **Tours Listing** - Filterable by country, difficulty, sort by price/rating/duration with search
- **Tour Details** - Full itinerary, pricing, included/excluded items, booking CTA, related tours
- **Destinations** - Country guides with wildlife highlights, best seasons, featured tours
- **FAQ** - Organized by category with comprehensive safari information
- **Booking** - Complete booking form with tour selection and total price calculation
- **Contact** - Contact form with office information and FAQ section
- **About** - Company story, mission, sustainability initiatives, team info

### SEO Optimization
- **Schema Markup** - JSON-LD for products, FAQs, breadcrumbs, organization data
- **Sitemap** - Dynamic XML sitemap with all tours and pages
- **Robots.txt** - Search engine crawling instructions
- **Meta Tags** - Title, description, keywords, Open Graph, Twitter cards
- **Semantic HTML** - Proper heading hierarchy, semantic elements
- **Image Optimization** - Alt text, next/image for performance

### Email Integration
- **Nodemailer Setup** - SMTP configuration for sending emails
- **Booking Confirmations** - Customer and admin notifications on tour bookings
- **Contact Form Emails** - Automated responses for contact inquiries
- **HTML Email Templates** - Professional email designs with booking details

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- SMTP server credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone/Download the project**
```bash
cd east-africa-safari-tours
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@safaris-eastafrica.com
```

### Email Setup (Nodemailer)

#### Option 1: Gmail
1. Enable 2-factor authentication on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASSWORD`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

#### Option 2: SendGrid
1. Get API key from [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys)
2. Use SendGrid SMTP settings:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxx
```

#### Option 3: Other SMTP Services
Configure with your provider's SMTP settings (Mailgun, AWS SES, etc.)

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── book/               # Booking submission endpoint
│   │   └── contact/            # Contact form endpoint
│   ├── about/                  # About company page
│   ├── booking/                # Booking form page
│   ├── contact/                # Contact page
│   ├── destinations/           # Destination pages
│   │   ├── page.tsx           # Destinations listing
│   │   └── [slug]/page.tsx    # Individual destination pages
│   ├── faq/                    # FAQ page
│   ├── tours/                  # Tour pages
│   │   ├── page.tsx           # Tours listing with filters
│   │   └── [slug]/page.tsx    # Individual tour pages
│   ├── layout.tsx              # Root layout with header/footer
│   ├── page.tsx                # Homepage
│   ├── sitemap.ts              # Dynamic sitemap
│   └── globals.css             # Global styles
├── components/
│   ├── header.tsx              # Navigation header
│   ├── footer.tsx              # Footer with links
│   └── ui/                     # shadcn/ui components
├── data/
│   ├── tours.json              # 33 tour data
│   ├── destinations.json       # 4 destination data
│   └── faqs.json               # FAQ data by category
├── lib/
│   ├── seo.ts                  # SEO schema utilities
│   ├── email.ts                # Email sending setup
│   └── utils.ts                # Utility functions
├── public/
│   ├── images/                 # Tour and destination images
│   ├── robots.txt              # Search engine crawler rules
│   └── sitemap.xml             # Auto-generated sitemap
└── types/
    └── tour.ts                 # TypeScript interfaces
```

## 🎨 Customization

### Adding New Tours
1. Edit `data/tours.json`
2. Add new tour object with all required fields
3. Add images to `public/images/tours/`
4. Pages auto-generate from the JSON data

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built React components
- **Theme Colors** - Customize in `tailwind.config.ts`

### Data Management
All tour/destination data is in JSON files for easy updates:
- `data/tours.json` - Tour listings and details
- `data/destinations.json` - Destination information
- `data/faqs.json` - FAQ content by category

## 📧 Email Configuration

### Testing Email Sending
```bash
# Test endpoint
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "tourId": "big-five-safari-masai-mara",
    "tourTitle": "Big Five Safari",
    "name": "John Doe",
    "email": "test@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "numberOfGuests": 2,
    "startDate": "2024-06-01",
    "price": 1299,
    "currency": "USD"
  }'
```

### Troubleshooting Email Issues
1. **Verify SMTP credentials** - Test connection with telnet/nc
2. **Check firewall** - Ensure port 587/465 is not blocked
3. **Enable Less Secure Apps** - For Gmail accounts
4. **Check email logs** - Monitor SMTP server logs
5. **Test template rendering** - Check HTML email formatting

## 🔍 SEO Features

### Implemented
- Dynamic meta tags (title, description, OG tags)
- JSON-LD schema markup for rich snippets
- XML sitemap with priority/frequency
- robots.txt for crawler instructions
- Semantic HTML structure
- Proper heading hierarchy
- Image optimization with alt text
- Mobile-responsive design
- Fast page load with Next.js optimization

### Testing SEO
1. **Google Search Console** - Submit sitemap, monitor indexing
2. **Lighthouse** - Run Lighthouse audit for SEO score
3. **Schema.org Validator** - Validate JSON-LD markup
4. **Mobile-Friendly Test** - Check mobile responsiveness

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Other Platforms
Works with any Node.js hosting:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean

## 📱 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Touch-friendly interfaces

## 🔒 Security Notes
1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** - For all sensitive data
3. **Validate inputs** - Form validation implemented
4. **Email security** - Use TLS/SSL for SMTP
5. **Rate limiting** - Consider adding for production

## 📊 Performance Optimization
- Next.js image optimization
- CSS/JS minification and bundling
- SEO-friendly URLs
- Responsive design for all devices
- Fast page load times

## 🤝 Maintenance & Updates

### Regular Tasks
- Update tour data in `data/tours.json`
- Monitor email sending logs
- Check analytics (when added)
- Update FAQs based on customer inquiries
- Keep dependencies updated

### Adding Features
- Database integration (Supabase, MongoDB)
- Payment processing (Stripe, PayPal)
- Admin dashboard for tour management
- Customer accounts and booking history
- Real-time chat support
- Reviews and ratings system

## 📞 Support & Contact
- **Website**: https://safaris-eastafrica.com
- **Email**: info@safaris-eastafrica.com
- **Phone**: +1-800-SAFARI-1

## 📄 License
© 2024 RAYCARZ Tours & Safaris. All rights reserved.

## 🎯 Next Steps

1. **Set up email** - Configure SMTP and test
2. **Customize data** - Update tours, destinations, FAQs
3. **Add your branding** - Update colors, fonts, images
4. **Configure analytics** - Add Google Analytics
5. **Deploy** - Push to production
6. **Monitor** - Set up error tracking (Sentry)
7. **Scale** - Add database when needed

---

Built with Next.js 16, React 19, Tailwind CSS, and shadcn/ui.
