# Local Development Setup

## The Problem
When developing locally with Vite, the Cloudflare Pages Functions (`/api/*`) are not available, causing:
- 404 errors when uploading/processing images
- Products disappearing after refresh
- Incorrect usage counts

## Solution: Point to Deployed Functions

### 1. Get Your Cloudflare Pages Domain
- Go to your Cloudflare Pages dashboard
- Find your project's domain (e.g., `catalogbuilder-abc123.pages.dev`)

### 2. Create `.env.local` File
Create `.env.local` in your project root:

```ini
# Replace with your actual Cloudflare Pages domain
VITE_API_BASE_URL=https://your-project-name.pages.dev
VITE_UPLOAD_ENDPOINT=https://your-project-name.pages.dev/api/upload-image
VITE_MOVE_ENDPOINT=https://your-project-name.pages.dev/api/move-image
```

### 3. Restart Development Server
```bash
npm run dev
```

## What This Fixes
✅ **Image uploads work** - Points to deployed Cloudflare Functions  
✅ **Image processing works** - Move operations succeed  
✅ **Products persist** - Database operations complete  
✅ **Correct usage counts** - Real data from database  
✅ **Limit enforcement** - Proper checks against actual usage  

## Alternative: Use Deployed App
For testing, you can also just use the deployed app directly instead of local development.

## Debugging
If you still see issues:
1. Check browser console for API errors
2. Verify your `.env.local` has the correct domain
3. Make sure the deployed functions are working
4. Check Supabase for actual data counts
