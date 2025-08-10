#!/bin/bash

# Build script to handle npm dependency issues
echo "🚀 Starting build process..."

# Clean up any existing build artifacts
echo "🧹 Cleaning up..."
rm -rf dist
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with specific flags
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --ignore-optional

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output in 'dist' directory"
else
    echo "❌ Build failed!"
    exit 1
fi
