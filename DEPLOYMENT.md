# Vercel Deployment Guide

This guide will help you deploy the Dev Lab Next.js frontend to Vercel.

## Prerequisites

1. **GitHub Repository**: Your code is already pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Laravel API**: Deploy your Laravel backend first (or use local for testing)

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your repository: `HadiDevLabx/devlab-nextjs-frontend`

### 2. Configure Project Settings

**Framework Preset**: Next.js (should be auto-detected)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`

### 3. Environment Variables

Add these environment variables in Vercel project settings:

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-laravel-api-url.com/api
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app

# Optional (add when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GA_TRACKING_ID=G-...
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at: `https://your-app-name.vercel.app`

## Laravel API Deployment

For the Laravel backend, you can deploy to:

1. **Railway**: [railway.app](https://railway.app)
2. **DigitalOcean**: App Platform
3. **Heroku**: [heroku.com](https://heroku.com)
4. **AWS**: Elastic Beanstalk

### Example Railway Deployment (Recommended)

1. Connect your Laravel repo to Railway
2. Add environment variables:
   ```
   APP_KEY=base64:your-app-key
   DB_CONNECTION=mysql
   DB_HOST=railway-mysql-host
   DB_DATABASE=railway
   DB_USERNAME=root
   DB_PASSWORD=railway-password
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Deploy automatically

## Domain Configuration

### Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_FRONTEND_URL` environment variable

### Update API CORS

Make sure your Laravel API allows your Vercel domain:

```php
// In Laravel config/cors.php
'allowed_origins' => [
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com',
    'http://localhost:3000', // for development
],
```

## Troubleshooting

### Build Issues

1. **TypeScript Errors**: Fix all TypeScript errors before deploying
2. **Missing Dependencies**: Ensure all packages are in `package.json`
3. **Environment Variables**: Double-check all required variables are set

### Runtime Issues

1. **API Connection**: Verify `NEXT_PUBLIC_API_URL` is correct
2. **CORS Errors**: Update Laravel CORS configuration
3. **404 Errors**: Check Next.js routing and file structure

### Performance

1. **Images**: Optimize images using Next.js Image component
2. **Fonts**: Use next/font for font optimization
3. **Bundle Size**: Analyze bundle with `npm run analyze`

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry
3. **Performance**: Monitor Core Web Vitals

## Updates

To update your deployment:

1. Push changes to GitHub
2. Vercel will automatically rebuild and deploy
3. Check deployment logs for any issues

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Project Issues: [GitHub Issues](https://github.com/HadiDevLabx/devlab-nextjs-frontend/issues)
