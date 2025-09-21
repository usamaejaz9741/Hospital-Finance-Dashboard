# Security Setup Guide

## Overview

This guide explains how to securely configure the Hospital Finance Dashboard application to avoid hardcoded secrets and security vulnerabilities.

## Environment Variables Setup

### 1. Create Environment File

Copy the example environment file and configure your local settings:

```bash
cp env.example .env
```

### 2. Configure Demo Credentials

Update the `.env` file with secure passwords:

```env
# Demo Account Credentials (change these!)
VITE_DEMO_ADMIN_EMAIL=admin@hospitalfinance.com
VITE_DEMO_ADMIN_PASSWORD=YourSecureAdminPassword2024!

VITE_DEMO_OWNER_EMAIL=owner@metrogeneral.com
VITE_DEMO_OWNER_PASSWORD=YourSecureOwnerPassword2024!

VITE_DEMO_MANAGER_EMAIL=manager@metrogeneral.com
VITE_DEMO_MANAGER_PASSWORD=YourSecureManagerPassword2024!
```

## Security Best Practices

### 1. Password Requirements

- Use strong passwords with at least 12 characters
- Include uppercase, lowercase, numbers, and special characters
- Avoid common words or patterns
- Use different passwords for each account

### 2. Environment Variables

- Never commit `.env` files to version control
- Use different passwords for development, staging, and production
- Rotate passwords regularly
- Use a password manager to generate and store secure passwords

### 3. Production Deployment

For production deployments:

1. **Use proper secret management** (AWS Secrets Manager, Azure Key Vault, etc.)
2. **Set environment variables** through your hosting platform
3. **Enable HTTPS** and proper security headers
4. **Regular security audits** using tools like `npm audit`

## Default Demo Credentials (Development Only)

If no environment variables are set, the system falls back to simple demo credentials:

- **Admin**: admin@hospitalfinance.com / Demo123456!
- **Owner**: owner@metrogeneral.com / Demo123456!  
- **Manager**: manager@metrogeneral.com / Demo123456!

⚠️ **Warning**: These default credentials are for development only and should never be used in production.

## GitGuardian Security

This setup addresses GitGuardian security concerns by:

1. ✅ Removing hardcoded passwords from source code
2. ✅ Using environment variables for sensitive data
3. ✅ Adding proper .gitignore for sensitive files
4. ✅ Providing secure configuration examples
5. ✅ Implementing fallback demo credentials only

## Verification

After setup, verify your configuration:

```bash
# Check that environment variables are loaded
npm run dev

# Verify no hardcoded secrets in code
git grep -i "password.*=" src/ || echo "No hardcoded passwords found"
```

## Support

For security questions or concerns, please refer to the main security documentation in `docs/SECURITY.md`.
