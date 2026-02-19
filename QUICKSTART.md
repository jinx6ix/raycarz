# Quick Start Guide - RAYCARZ Tours & Safaris

Get your safari website up and running in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
npm install
# or
pnpm install
```

## Step 2: Configure Email (2 minutes)

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Get your SMTP credentials:
   - **Gmail**: [Create App Password](https://myaccount.google.com/apppasswords)
   - **SendGrid**: [Get API Key](https://app.sendgrid.com/settings/api_keys)
   - **Other**: Use your email provider's SMTP settings

3. Edit `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@safaris-eastafrica.com
```

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test Everything (1 minute)

- Browse tours at `/tours`
- Try the booking form at `/booking`
- Submit test booking with your email
- Check your email for confirmation

## Done! 🎉

Your safari tour website is running! Here's what you have:

✅ **33 Safari Tours** - Kenya, Tanzania, Uganda, Rwanda
✅ **Complete Booking System** - Email notifications with Nodemailer
✅ **Contact Form** - Automated email responses
✅ **SEO Optimized** - Sitemap, schema markup, meta tags
✅ **Mobile Responsive** - Works on all devices
✅ **Professional Design** - Modern UI with Tailwind CSS

## Next Steps

### 1. Customize Your Data
Edit `data/tours.json` to update tour details, prices, and images.

### 2. Update Contact Info
Change email addresses in `.env.local` and throughout the site.

### 3. Add Your Images
Replace placeholder images in `public/images/tours/` and `public/images/destinations/`.

### 4. Deploy to Production
```bash
# Option A: Deploy to Vercel (easiest)
npm install -g vercel
vercel

# Option B: Deploy to Netlify (2 clicks on netlify.com)

# Option C: Deploy to your own server
npm run build
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Key Files to Edit

| File | Purpose |
|------|---------|
| `data/tours.json` | Your 33 safari tours |
| `data/destinations.json` | Kenya, Tanzania, Uganda, Rwanda info |
| `data/faqs.json` | FAQ content by category |
| `.env.local` | Email and site configuration |
| `components/header.tsx` | Navigation menu |
| `components/footer.tsx` | Footer links |

## Common Customizations

### Change Brand Name
```bash
# Search for "RAYCARZ Tours & Safaris" and replace
grep -r "RAYCARZ Tours & Safaris" .
```

### Add New Tour
1. Open `data/tours.json`
2. Add new tour object before closing bracket `]`
3. Add images to `public/images/tours/`
4. Publish!

### Update Email Settings
Edit `.env.local`:
```env
SMTP_HOST=your-host
SMTP_USER=your-email
SMTP_PASSWORD=your-password
ADMIN_EMAIL=where@to.send
```

### Change Colors
Edit `tailwind.config.ts`:
```javascript
theme: {
  colors: {
    'amber': { /* change to your color */ }
  }
}
```

## Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- -p 3001
```

### Email not working?
1. Check `.env.local` has correct SMTP settings
2. Verify email is not in spam
3. Check SMTP provider logs

### Build errors?
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## File Structure Quick Reference

```
root/
├── app/               # Website pages & API routes
├── components/        # Reusable components (header, footer)
├── data/              # Tour & destination data (JSON)
├── public/            # Images and static files
├── lib/               # Email & SEO utilities
└── types/             # TypeScript definitions
```

## Support & Docs

- **Full README**: Read [README.md](./README.md) for complete documentation
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- **Email Setup**: Check README.md section "Email Configuration"

## Next After Quick Start

1. ✅ Configure email
2. ✅ Run locally and test
3. → Update tour data with your information
4. → Add your photos/images
5. → Deploy to production
6. → Set up Google Search Console
7. → Monitor and improve

## Pro Tips

- Tour data is in JSON for easy updates
- All images are auto-optimized with Next.js
- Email templates are in `lib/email.ts`
- SEO is fully implemented - no extra setup needed
- Pages auto-generate from JSON data

## Deploy in 30 Seconds

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts, done!
```

### Netlify
1. Push to GitHub
2. Go to netlify.com
3. Click "New site from Git"
4. Select your repo
5. Add environment variables
6. Done!

---

Questions? Full documentation in [README.md](./README.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)

Happy organizing safaris! 🦁
