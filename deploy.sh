#!/bin/bash

# Nari AI - Quick Deployment Script
# Make sure to run: chmod +x deploy.sh

echo "🚀 Starting Nari AI Deployment..."
echo "========================================"
echo "🏥 Nari AI - Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run linting
echo "🔍 Running linter..."
pnpm run lint

# Build the project
echo "🏗️  Building project..."
pnpm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Vercel (recommended): npx vercel"
    echo "2. Netlify: npx netlify deploy --prod --dir=dist"
    echo "3. Or drag & drop the 'dist' folder to vercel.com or netlify.com"
    echo ""
    echo "📄 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 