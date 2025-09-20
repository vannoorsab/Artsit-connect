# ArtisanConnect - Netlify Deployment Guide

## 🚀 Deploy to Netlify

This guide will help you deploy the ArtisanConnect marketplace to Netlify for public access.

### Prerequisites
- A GitHub account
- A Netlify account (free tier available)
- Git installed on your system

### Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `artisan-connect` or any name you prefer
   - Don't initialize with README, .gitignore, or license (we already have these)

2. **Add GitHub as remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Netlify

1. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify to access your repositories
   - Select your `artisan-connect` repository

2. **Configure Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public`
   - **Node version:** `18` (already configured in netlify.toml)

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site
   - You'll get a random URL like `https://amazing-name-123456.netlify.app`

### Step 3: Custom Domain (Optional)

1. **Change site name:**
   - In Netlify dashboard, go to Site settings > General
   - Click "Change site name"
   - Choose a custom name like `artisan-connect-404team`
   - Your URL will become `https://artisan-connect-404team.netlify.app`

2. **Custom domain:**
   - Go to Domain settings
   - Add your custom domain if you have one

### Step 4: Environment Variables (If needed)

If you plan to add real API integrations later:
1. Go to Site settings > Environment variables
2. Add any required environment variables like:
   - `GEMINI_API_KEY` (for AI features)
   - `FIREBASE_CONFIG` (for database)

### Features Included in Deployment

✅ **Frontend Features:**
- Landing page with product showcase
- Marketplace with search and filtering
- Product detail pages with purchase flow
- User authentication (login/signup)
- Contact us modal
- Responsive design with modern UI

✅ **Backend Features:**
- Serverless API functions via Netlify Functions
- Demo data for products and categories
- Authentication endpoints
- CORS enabled for cross-origin requests

✅ **Demo Data:**
- 6 sample products across 8 categories
- Demo user authentication
- Realistic product information and images

### Live Site Features

Once deployed, your site will have:
- **Public URL** accessible from anywhere
- **HTTPS** automatically enabled
- **CDN** for fast global access
- **Automatic deployments** when you push to GitHub
- **Form handling** for contact submissions
- **Serverless functions** for API endpoints

### Troubleshooting

**Build fails:**
- Check that all dependencies are in package.json
- Ensure Node version is 18 in netlify.toml

**API not working:**
- Verify netlify/functions/api.js is present
- Check redirects in netlify.toml

**Site not loading:**
- Ensure publish directory is set to `dist/public`
- Check that build command is `npm run build`

### Next Steps

After deployment, you can:
1. **Share the public URL** with users
2. **Add real database** (Firebase/Supabase)
3. **Integrate payment** (Stripe/PayPal)
4. **Add real authentication** (Firebase Auth)
5. **Connect AI services** (Google Gemini API)

### Support

The site is developed by **404 Google Team** and includes:
- Modern React frontend with TypeScript
- Express.js serverless backend
- Tailwind CSS for styling
- Demo authentication system
- Contact form functionality

---

**🎉 Your ArtisanConnect marketplace is now live and accessible to the world!**
