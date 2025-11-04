#!/bin/bash

# Deployment script for Signal Meter Pro
# Usage: ./deploy.sh

echo "🚀 Building Signal Meter Pro for production..."

# Build the application
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo "📦 Production files are in the 'dist' directory"
echo ""
echo "📋 Next steps:"
echo "1. Copy the 'dist' folder to your VPS"
echo "2. Follow the deployment instructions in DEPLOYMENT.md"
