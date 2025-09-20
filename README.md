# 🎨 ArtisanConnect - AI-Powered Artisan Marketplace

**Developed by 404 Google Team**

A modern, AI-enhanced marketplace connecting passionate artisans with appreciative customers. Built with React, TypeScript, and powered by Google Gemini AI.

## ✨ Features

### 🏪 **Marketplace**
- Browse handcrafted products across 8 categories
- Advanced search and filtering capabilities
- Detailed product pages with artisan profiles
- Responsive design for all devices

### 🔐 **Authentication**
- Secure user registration and login
- Protected routes for authenticated features
- Demo account for easy testing
- Session management with HTTP-only cookies

### 🤖 **AI-Powered Tools**
- Intelligent pricing suggestions
- Automated product descriptions
- Marketing content generation
- Image analysis and enhancement
- Powered by Google Gemini AI

### 💬 **Communication**
- Contact us modal with form submission
- Direct artisan messaging (coming soon)
- Customer support integration

### 🎨 **Modern UI/UX**
- Bubble-styled design with glass morphism
- Gradient backgrounds and animations
- Mobile-first responsive design
- Accessibility-focused components

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/artisan-connect.git
   cd artisan-connect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3001
   ```

### Demo Account
- **Email:** demo@artisanconnect.com
- **Password:** Any password (demo mode)

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation

### Backend
- **Express.js** serverless functions
- **Netlify Functions** for deployment
- **Cookie-based authentication**
- **CORS enabled** for cross-origin requests

### AI Integration
- **Google Gemini API** for AI features
- **Intelligent content generation**
- **Image analysis capabilities**

## 📁 Project Structure

```
artisan-connect/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express server
├── netlify/functions/      # Serverless functions
├── shared/                 # Shared types and schemas
└── dist/                   # Built application
```

## 🌐 Deployment

The application is configured for easy deployment to Netlify:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist/public`
   - Deploy automatically on git push

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🎯 Demo Data

The application includes comprehensive demo data:
- **6 sample products** across different categories
- **8 product categories** (Pottery, Textiles, Jewelry, etc.)
- **Realistic product information** with images and descriptions
- **Demo user authentication** for testing

## 🔧 Configuration

### Environment Variables (Optional)
```env
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_CONFIG=your_firebase_config_here
```

### Build Configuration
- **Node Version:** 18+
- **Package Manager:** npm
- **Build Tool:** Vite
- **CSS Framework:** Tailwind CSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- **404 Google Team** - Development and design
- **Google Gemini AI** - AI-powered features
- **Unsplash** - Demo product images
- **Tailwind CSS** - Styling framework
- **React Community** - Amazing ecosystem

---

**🎨 Connecting artisans with the world, one handcrafted piece at a time.**
