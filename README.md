# 🛍️ Dev Lab - Modern E-commerce Platform

A premium, mobile-responsive e-commerce platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features a complete shopping experience with Laravel API integration, authentication, cart management, and order processing.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Key Features

### 🛒 E-commerce Functionality
- **Product Catalog**: Dynamic product browsing with advanced filtering and sorting
- **Shopping Cart**: Real-time cart management with persistent storage
- **User Authentication**: Secure login/registration with Laravel Sanctum
- **Order Management**: Complete checkout process and order tracking
- **Payment Integration**: Ready for Stripe integration
- **Product Reviews**: Rating and review system

### 🎨 User Experience
- **Mobile-First Design**: Fully responsive across all devices
- **Dark Mode Support**: Automatic theme switching
- **Fast Navigation**: Optimized routing and loading states
- **Search & Filter**: Advanced product discovery
- **Wishlist**: Save favorite items
- **Quick View**: Product preview without page navigation

### 🔧 Technical Features
- **Laravel API Integration**: Complete backend connectivity
- **Data Transformation**: Seamless API data handling
- **TypeScript**: Full type safety
- **SEO Optimized**: Next.js App Router with metadata
- **Performance**: Image optimization and lazy loading
- **Accessibility**: WCAG compliant components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Laravel backend running on port 8000

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HadiDevLabx/devlab-nextjs-frontend.git
cd devlab-nextjs-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Shop pages (products, cart, checkout)
│   ├── (auth)/            # Authentication pages
│   ├── (accounts)/        # User account pages
│   └── api/               # API route handlers
├── components/            # Reusable UI components
│   ├── ProductCard.tsx    # Product display component
│   ├── Header.tsx         # Site navigation
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── api.ts            # Laravel API client
│   ├── transformers.ts   # Data transformation
│   └── types.ts          # TypeScript definitions
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── CartContext.tsx   # Shopping cart state
├── hooks/                # Custom React hooks
├── styles/              # Global styles and Tailwind config
└── data/               # Data management and fallbacks
```

## 🔌 API Integration

### Laravel Backend Integration
The platform integrates with a Laravel API for complete e-commerce functionality:

**Products API**
- `GET /api/products` - Product catalog with pagination
- `GET /api/products/{handle}` - Individual product details
- `GET /api/categories` - Product categories

**Authentication API**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get authenticated user

**Cart & Orders API**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item
- `POST /api/orders` - Create new order

### Data Transformation
Automatic conversion between Laravel and frontend data formats:
```typescript
// Laravel API Response
{
  "id": 1,
  "name": "Product Name",
  "price": "29.99",
  "review_count": 15
}

// Transformed Frontend Data
{
  "id": "gid://1",
  "title": "Product Name", 
  "price": 29.99,
  "reviewNumber": 15
}
```

## 🎨 Theming & Styling

### Custom Color Scheme
The platform features a beautiful purple/magenta theme:
- **Primary**: Purple variants (violet-500 to violet-900)
- **Secondary**: Magenta variants (fuchsia-300 to fuchsia-700)
- **Neutral**: Carefully balanced grays for content

### Mobile Responsiveness
- **Breakpoints**: Mobile-first design with sm, md, lg, xl breakpoints
- **Touch Targets**: Minimum 44px tap targets for mobile usability
- **Typography**: Responsive text scaling
- **Navigation**: Collapsible mobile menu

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit linting (optional)

### Environment Variables
```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

## 📱 Mobile Features

### Progressive Web App Ready
- **Service Worker**: Offline capability
- **App Manifest**: Install as native app
- **Push Notifications**: Customer engagement

### Mobile Optimizations
- **Touch Gestures**: Swipe navigation
- **Responsive Images**: Optimized loading
- **Fast Loading**: < 3s first contentful paint
- **Offline Support**: Basic offline functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
NEXT_PUBLIC_API_URL=https://your-laravel-api.com/api
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Repositories

- **Backend API**: [devlab-laravel-backend](https://github.com/HadiDevLabx/devlab-laravel-backend)
- **Documentation**: [Coming Soon]

## 📞 Support

For support and questions:
- 📧 Email: [your-email@domain.com]
- 🐛 Issues: [GitHub Issues](https://github.com/HadiDevLabx/devlab-nextjs-frontend/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/HadiDevLabx/devlab-nextjs-frontend/discussions)

---

<div align="center">
  <strong>Built with ❤️ by the Dev Lab Team</strong>
</div>