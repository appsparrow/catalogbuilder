#!/bin/bash

# Deployment build script specifically for environments with bun/npm conflicts
echo "🚀 Starting deployment build process..."

# Clean everything first
echo "🧹 Cleaning up..."
rm -rf dist
rm -rf node_modules
rm -f package-lock.json
rm -f bun.lockb

# Force npm installation with specific flags
echo "📦 Installing dependencies with npm..."
npm install --legacy-peer-deps --ignore-optional --no-optional --force

# Install specific Rollup version to avoid native module issues
echo "🔧 Installing specific Rollup version..."
npm install rollup@4.9.5 --save-dev --legacy-peer-deps

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output in 'dist' directory"
    ls -la dist/
else
    echo "❌ Build failed!"
    echo "🔍 Attempting alternative build method..."
    
    # Try alternative build approach
    npm run build:deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Alternative build completed successfully!"
    else
        echo "❌ All build methods failed!"
        exit 1
    fi
fi
