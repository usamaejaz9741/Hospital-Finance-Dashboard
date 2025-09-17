# Deployment Guide

This guide provides comprehensive instructions for deploying the Hospital Finance Dashboard to various hosting platforms, including configuration, optimization, and monitoring.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Security Configuration](#security-configuration)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher (or yarn equivalent)
- **Git**: For version control and deployment
- **Modern Browser Support**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+

### Development Environment

```bash
# Verify Node.js version
node --version  # Should be 16.x or higher

# Verify npm version
npm --version   # Should be 7.x or higher

# Check project dependencies
npm audit       # Should show no high-severity vulnerabilities
```

## Build Process

### Production Build

```bash
# 1. Install dependencies
npm ci --production=false

# 2. Run tests (optional but recommended)
npm run test

# 3. Type checking
npm run type-check

# 4. Linting
npm run lint

# 5. Build for production
npm run build

# 6. Preview build locally (optional)
npm run preview
```

### Build Output

The build process generates optimized static files in the `dist/` directory:

```
dist/
├── assets/
│   ├── main-[hash].js          # Main application bundle
│   ├── vendor-[hash].js        # Third-party dependencies
│   ├── [component]-[hash].js   # Lazy-loaded components
│   └── main-[hash].css         # Compiled styles
├── favicon/                    # Favicon files
├── index.html                  # Main HTML file
└── stats.html                  # Bundle analysis (if generated)
```

### Build Optimization Features

- **Code Splitting**: Automatic vendor and component splitting
- **Tree Shaking**: Unused code elimination
- **Minification**: JavaScript and CSS compression
- **Asset Optimization**: Image and font optimization
- **Source Maps**: Generated for production debugging
- **Bundle Analysis**: Size tracking and optimization insights

## Deployment Platforms

### Vercel (Recommended)

**Automatic Deployment**:

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm ci"
   }
   ```
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push

**Manual Deployment**:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### Netlify

**Automatic Deployment**:

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 16 or higher

**Manual Deployment**:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### AWS S3 + CloudFront

**S3 Setup**:

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-hospital-dashboard-bucket

# Enable static website hosting
aws s3 website s3://your-hospital-dashboard-bucket \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync dist/ s3://your-hospital-dashboard-bucket \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.map"

# Upload index.html with different caching
aws s3 cp dist/index.html s3://your-hospital-dashboard-bucket/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

**CloudFront Configuration**:
```json
{
  "Origins": [{
    "DomainName": "your-hospital-dashboard-bucket.s3.amazonaws.com",
    "OriginPath": "",
    "CustomOriginConfig": {
      "HTTPPort": 80,
      "HTTPSPort": 443,
      "OriginProtocolPolicy": "https-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-hospital-dashboard-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "managed-caching-optimized"
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponseCode": 200,
    "ResponsePagePath": "/index.html"
  }]
}
```

---

### Docker Deployment

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

**Build and Deploy**:
```bash
# Build Docker image
docker build -t hospital-dashboard .

# Run container
docker run -p 80:80 hospital-dashboard

# Deploy to registry
docker tag hospital-dashboard your-registry/hospital-dashboard:latest
docker push your-registry/hospital-dashboard:latest
```

## Environment Configuration

### Environment Variables

Create environment-specific configuration files:

**.env.production**:
```bash
VITE_NODE_ENV=production
VITE_API_URL=https://api.hospitalfinance.com
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=SENTRY_DSN_URL
```

**.env.staging**:
```bash
VITE_NODE_ENV=staging
VITE_API_URL=https://staging-api.hospitalfinance.com
VITE_APP_VERSION=1.0.0-staging
VITE_ANALYTICS_ID=GA_STAGING_ID
```

### Build-time Configuration

**vite.config.ts** (Production optimizations):
```typescript
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'production' ? [
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      })
    ] : [])
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
}));
```

## Performance Optimization

### Build Optimization

**Bundle Analysis**:
```bash
# Generate bundle analysis
npm run build
npm run analyze

# Open dist/stats.html to review bundle composition
```

**Optimization Checklist**:
- ✅ Code splitting implemented
- ✅ Vendor chunks separated
- ✅ Tree shaking enabled
- ✅ Minification enabled
- ✅ Source maps generated
- ✅ Asset optimization enabled

### Runtime Optimization

**Preloading Critical Resources**:
```html
<!-- In index.html -->
<link rel="preload" href="/assets/main-[hash].js" as="script">
<link rel="preload" href="/assets/main-[hash].css" as="style">
```

**Service Worker** (Optional):
```javascript
// public/sw.js
const CACHE_NAME = 'hospital-dashboard-v1';
const urlsToCache = [
  '/',
  '/assets/main-[hash].js',
  '/assets/main-[hash].css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### CDN Configuration

**Cloudflare Settings**:
- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours for HTML, 1 year for assets
- **Minification**: HTML, CSS, JS enabled
- **Brotli Compression**: Enabled
- **HTTP/2**: Enabled

## Security Configuration

### HTTP Security Headers

```nginx
# Security headers for nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
```

### HTTPS Configuration

**SSL/TLS Best Practices**:
- Use TLS 1.2 or higher
- Implement HSTS headers
- Use strong cipher suites
- Regular certificate renewal

**Certbot (Let's Encrypt)**:
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Analytics

### Performance Monitoring

**Web Vitals Tracking**:
```typescript
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  // Send to your analytics service
  console.log(metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Error Tracking with Sentry**:
```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NODE_ENV,
  tracesSampleRate: 1.0
});
```

### Health Checks

**Health Check Endpoint**:
```typescript
// Create a health check endpoint
export const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_NODE_ENV
};
```

### Log Aggregation

**Structured Logging**:
```typescript
// Enhanced logger for production
export const logger = {
  info: (message: string, context?: any) => {
    if (import.meta.env.PROD) {
      // Send to log aggregation service
      sendToLogService('info', message, context);
    } else {
      console.log(message, context);
    }
  },
  error: (message: string, error?: Error) => {
    if (import.meta.env.PROD) {
      sendToLogService('error', message, { error: error?.stack });
    } else {
      console.error(message, error);
    }
  }
};
```

## Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

**Memory Issues During Build**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Route Handling Issues**:
- Ensure proper redirect configuration for SPA routing
- Check server configuration for fallback to index.html
- Verify base URL configuration in vite.config.ts

**Performance Issues**:
```bash
# Analyze bundle size
npm run analyze

# Check for unnecessary dependencies
npx depcheck

# Audit performance
npm audit
```

### Debugging Tools

**Build Analysis**:
```bash
# Bundle analyzer
npm run analyze

# Dependency analysis
npx madge --circular --extensions ts,tsx src/

# Performance audit
npx lighthouse-ci autorun
```

**Runtime Debugging**:
- Browser DevTools Performance tab
- React Developer Tools Profiler
- Network tab for resource loading
- Console for error tracking

### Support Resources

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues for bug reports
- **Performance**: Bundle analysis reports
- **Security**: Regular dependency audits
- **Monitoring**: Application performance metrics

---

This deployment guide provides comprehensive instructions for deploying the Hospital Finance Dashboard across various platforms while maintaining security, performance, and reliability standards.
