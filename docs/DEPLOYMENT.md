# Deployment Guide

## Overview

This guide covers the deployment process for the Hospital Finance Dashboard, including build optimization, environment configuration, and deployment strategies for various platforms.

## 🏗️ Build Process

### Production Build

The application uses Vite for building optimized production bundles:

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Build Configuration

The build process is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'd3'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
```

### Bundle Analysis

Analyze bundle size and dependencies:

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle
npm run build:analyze
```

## 🌍 Environment Configuration

### Environment Variables

Create environment-specific configuration files:

```bash
# Development
.env.development

# Production
.env.production

# Local
.env.local
```

#### Environment Variables Reference

```bash
# API Configuration
VITE_API_BASE_URL=https://api.hospital-dashboard.com
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_SESSION_TIMEOUT=3600000

# Analytics
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_DEBUG_MODE=false

# Hospital Configuration
VITE_DEFAULT_HOSPITAL_ID=hospital-1
VITE_MAX_HOSPITALS_PER_USER=5
```

### Environment-Specific Builds

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    build: {
      rollupOptions: {
        external: mode === 'development' ? [] : ['react-devtools']
      }
    }
  };
});
```

## 🚀 Deployment Strategies

### Static Site Hosting

#### Netlify Deployment

1. **Create `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

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

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Security-Policy = "script-src 'self' 'unsafe-inline'"
```

2. **Deploy**:
```bash
# Connect to Netlify
netlify login
netlify init

# Deploy
netlify deploy --prod
```

#### Vercel Deployment

1. **Create `vercel.json`**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
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

2. **Deploy**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### AWS S3 + CloudFront

1. **Build and upload to S3**:
```bash
# Build application
npm run build

# Install AWS CLI
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

2. **S3 Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### Container Deployment

#### Docker Configuration

1. **Create `Dockerfile`**:
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Nginx Configuration**:
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  }
}
```

3. **Build and run**:
```bash
# Build Docker image
docker build -t hospital-dashboard .

# Run container
docker run -p 80:80 hospital-dashboard
```

#### Kubernetes Deployment

1. **Create `k8s-deployment.yaml`**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hospital-dashboard
  labels:
    app: hospital-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hospital-dashboard
  template:
    metadata:
      labels:
        app: hospital-dashboard
    spec:
      containers:
      - name: hospital-dashboard
        image: hospital-dashboard:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: hospital-dashboard-service
spec:
  selector:
    app: hospital-dashboard
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

2. **Deploy to Kubernetes**:
```bash
# Apply deployment
kubectl apply -f k8s-deployment.yaml

# Check status
kubectl get deployments
kubectl get services
```

## 🔒 Security Configuration

### Content Security Policy

Add CSP headers to prevent XSS attacks:

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.hospital-dashboard.com;
">
```

### HTTPS Configuration

Ensure all deployments use HTTPS:

```nginx
# Nginx HTTPS configuration
server {
  listen 443 ssl http2;
  server_name hospital-dashboard.com;
  
  ssl_certificate /path/to/certificate.crt;
  ssl_certificate_key /path/to/private.key;
  
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
  ssl_prefer_server_ciphers off;
  
  # Redirect HTTP to HTTPS
  if ($scheme != "https") {
    return 301 https://$host$request_uri;
  }
}
```

### Environment Security

```bash
# Secure environment variables
export VITE_API_BASE_URL="https://secure-api.hospital.com"
export VITE_JWT_SECRET="$(openssl rand -base64 32)"

# Use secrets management
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name "hospital-dashboard/secrets" \
  --description "Application secrets" \
  --secret-string '{"jwt_secret":"your-secret","api_key":"your-key"}'
```

## 📊 Monitoring & Analytics

### Performance Monitoring

#### Core Web Vitals

```typescript
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Error Tracking

```typescript
// src/utils/errorReporting.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export const reportError = (error: Error, context?: any) => {
  Sentry.captureException(error, { extra: context });
};
```

### Health Checks

Create health check endpoints:

```typescript
// src/utils/healthCheck.ts
export const healthCheck = {
  checkAppHealth: () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.NODE_ENV
    };
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm run test
  artifacts:
    reports:
      coverage: coverage/lcov.info

build:
  stage: build
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST -F "file=@dist/index.html" $DEPLOY_URL
  only:
    - main
  dependencies:
    - build
```

## 🚀 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts - Optimized build
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts', 'd3-scale', 'd3-shape'],
          ui: ['@headlessui/react', '@heroicons/react'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Caching Strategy

```typescript
// Service Worker for caching
const CACHE_NAME = 'hospital-dashboard-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Verify environment variables
npm run env:check
```

#### Runtime Errors

```typescript
// Error boundary for production
class ProductionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Production Error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### Performance Issues

```bash
# Analyze bundle size
npm run build:analyze

# Check for memory leaks
npm run test:memory

# Profile performance
npm run profile
```

### Rollback Strategy

```bash
# Quick rollback script
#!/bin/bash
echo "Rolling back to previous version..."
git checkout HEAD~1
npm run build
npm run deploy:quick
echo "Rollback complete!"
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests pass
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] Performance optimizations applied
- [ ] Error tracking configured
- [ ] Monitoring setup

### Post-Deployment

- [ ] Health checks passing
- [ ] Performance metrics within limits
- [ ] Error rates normal
- [ ] User feedback collected
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified of deployment

### Emergency Procedures

- [ ] Rollback plan ready
- [ ] Incident response team identified
- [ ] Communication channels established
- [ ] Recovery procedures documented
- [ ] Post-incident review scheduled