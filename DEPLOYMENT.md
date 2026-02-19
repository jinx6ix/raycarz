# Deployment Guide - East Africa Safari Tours

Complete instructions for deploying the safari tours website to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Email sending tested locally
- [ ] All tours/destinations data verified
- [ ] Images optimized and in place
- [ ] Meta tags and SEO verified
- [ ] Test bookings completed
- [ ] Links and navigation tested
- [ ] Mobile responsiveness checked

## 🌐 Hosting Options

### Option 1: Vercel (Recommended - Free with Pro options)

Vercel is the creator of Next.js and provides the best integration.

#### Prerequisites
- Vercel account (sign up at vercel.com)
- GitHub account (recommended for auto-deployment)

#### Step 1: Connect GitHub Repository
```bash
# Push to GitHub
git remote add origin https://github.com/yourusername/east-africa-safari-tours.git
git push -u origin main
```

#### Step 2: Import Project to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Enter your GitHub repository URL
4. Click "Import"

#### Step 3: Configure Environment Variables
1. In Vercel dashboard, go to Settings → Environment Variables
2. Add each variable from your `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=noreply@safaris-eastafrica.com
   ADMIN_EMAIL=admin@safaris-eastafrica.com
   HOST_EMAIL=bookings@safaris-eastafrica.com
   ```
3. Click "Save"

#### Step 4: Deploy
- Click "Deploy" button
- Wait for build to complete (5-10 minutes)
- Your site is live at `your-project.vercel.app`

#### Step 5: Custom Domain
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable auto-renewal

### Option 2: Netlify (Free with limitations)

#### Step 1: Connect Repository
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Select GitHub and authorize
4. Select your repository

#### Step 2: Build Settings
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18 or higher

#### Step 3: Environment Variables
1. Go to Settings → Build & Deploy → Environment
2. Add all variables from `.env.local`
3. Redeploy

#### Step 4: Deploy
- Netlify automatically deploys on each push
- Check the deploy status in the dashboard

### Option 3: Self-Hosted (AWS, DigitalOcean, etc.)

#### Requirements
- VPS or server with Node.js 18+
- Domain name and DNS access
- SSL certificate (Let's Encrypt free)

#### Step 1: Server Setup
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt-get install -y nginx
```

#### Step 2: Clone and Setup Application
```bash
# Clone repository
git clone https://github.com/yourusername/east-africa-safari-tours.git
cd east-africa-safari-tours

# Install dependencies
npm install

# Create .env.local with production variables
nano .env.local
# Add all environment variables

# Build
npm run build
```

#### Step 3: Run with PM2
```bash
# Start application
pm2 start npm --name "safari-tours" -- start

# Configure auto-restart
pm2 startup
pm2 save
```

#### Step 4: Nginx Configuration
```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/safaris-eastafrica.com

# Add:
server {
    listen 80;
    server_name safaris-eastafrica.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/safaris-eastafrica.com /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d safaris-eastafrica.com -d www.safaris-eastafrica.com

# Auto-renew setup (automatic)
sudo systemctl enable certbot.timer
```

## 🔧 Post-Deployment Tasks

### 1. Test Everything
```bash
# Test booking form
# Test contact form
# Test email notifications
# Verify all links work
# Check mobile responsiveness
```

### 2. SEO Setup
1. **Google Search Console**
   - Go to search.google.com/search-console
   - Add property with your domain
   - Submit sitemap at `/sitemap.xml`
   - Monitor indexing

2. **Bing Webmaster Tools**
   - Go to webmaster.microsoft.com
   - Add domain
   - Submit sitemap

3. **Google Analytics** (Optional)
   - Create GA4 property
   - Add tracking code to site

### 3. Email Configuration Verification
```bash
# Test booking email
curl -X POST https://your-domain.com/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "tourId": "test-tour",
    "tourTitle": "Test Tour",
    "name": "Test User",
    "email": "your-email@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "numberOfGuests": 2,
    "startDate": "2024-06-01",
    "price": 1299,
    "currency": "USD"
  }'
```

### 4. Monitor Uptime
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure alerts for downtime

### 5. Error Tracking
- Set up Sentry for error monitoring
- Configure alerts

## 🔒 Security Checklist

- [ ] Environment variables secure (not in git)
- [ ] HTTPS/SSL enabled
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Input validation in place
- [ ] Rate limiting configured (if applicable)
- [ ] Regular backups enabled

## 📊 Performance Optimization

### Image Optimization
- Images already optimized with Next.js Image component
- Use WebP format for best compression

### Caching Strategy
```nginx
# Add to nginx config for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Queries (when added)
- Implement query caching
- Use indexes on frequently searched fields
- Monitor slow queries

## 🚨 Troubleshooting

### Build Fails on Vercel
**Problem**: Build error with dependencies

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Ensure all dependencies in package.json
npm list
```

### Email Not Sending
**Problem**: Bookings submitted but no emails received

**Solution**:
1. Verify SMTP credentials in environment variables
2. Check email logs in your SMTP provider
3. Verify sender email address is authorized
4. Check spam folder
5. Enable "Less Secure Apps" for Gmail

### Slow Page Load
**Problem**: Pages loading slowly

**Solution**:
1. Check Network tab in DevTools
2. Optimize images further
3. Enable Vercel Analytics
4. Check SMTP response times
5. Implement CDN if self-hosted

## 📈 Scaling

### When to Upgrade
- Traffic exceeds 10,000 pageviews/month → Consider Vercel Pro
- Database needed → Add Supabase, MongoDB, etc.
- Payment processing → Add Stripe integration
- Analytics needed → Implement tracking

### Database Setup (Future)
```javascript
// When ready to add database
// 1. Choose provider (Supabase recommended)
// 2. Update tour/booking data to use database
// 3. Implement caching layer
// 4. Set up backups
```

## 📱 Mobile Verification

Before going live:
- [ ] Test on iPhone 12, iPhone SE
- [ ] Test on Samsung Galaxy S21
- [ ] Test on older Android devices
- [ ] Verify touch interactions
- [ ] Check form inputs on mobile

## 🎯 Monitoring & Maintenance

### Daily
- Monitor error logs
- Check email delivery rates
- Verify site is accessible

### Weekly
- Review analytics
- Check for broken links
- Monitor performance metrics

### Monthly
- Update content/tours
- Review customer feedback
- Optimize slow pages
- Check security updates

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Nodemailer Docs**: https://nodemailer.com/
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## Deployment Summary

| Platform | Cost | Setup Time | Auto-Deploy | Best For |
|----------|------|-----------|------------|----------|
| Vercel | Free-$20/mo | 5 min | Yes | Production-ready |
| Netlify | Free-$19/mo | 5 min | Yes | General purpose |
| AWS | Variable | 30 min | Manual | Complex apps |
| DigitalOcean | $5+/mo | 20 min | Manual | Budget-friendly |

**Recommended**: Vercel for easiest deployment and best Next.js integration.

---

Questions? Check README.md or visit safaris-eastafrica.com
