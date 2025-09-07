# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4e30c8a0-7596-4c36-8be5-16728e048ebb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4e30c8a0-7596-4c36-8be5-16728e048ebb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4e30c8a0-7596-4c36-8be5-16728e048ebb) and click on Share -> Publish.

## 🚀 Build & Deployment

### Quick Build
```bash
npm run build
```

### Clean Build (Recommended for deployment)
```bash
npm run build:clean
```

### Deployment Build (Handles dependency issues)
```bash
npm run build:deploy
```

### Using Build Script
```bash
./build.sh
```

### Cloudflare R2 image storage

Images are uploaded to Cloudflare R2 via a Cloudflare Pages Function and served through Cloudflare CDN (zero egress from Supabase):
x
- Function: `functions/api/upload-image.ts`
- Binding: `R2_BUCKET` (R2 bucket binding)
- Env var: `R2_PUBLIC_BASE_URL` (public base URL to your bucket; no trailing slash)

Configure in Cloudflare Pages → Project → Settings:
1. Bindings → R2 → Add binding named `R2_BUCKET` pointing to your bucket
2. Environment variables → add `R2_PUBLIC_BASE_URL` with your public bucket URL or CDN hostname

The app posts multipart/form-data to `/api/upload-image` and stores returned URLs in Supabase tables.

### Step-by-step: Set up Cloudflare R2 with this app

1) Create an R2 bucket
   - Cloudflare Dashboard → R2 → Create bucket
   - Name example: `catalogbuilder`

2) Make objects publicly readable
   - Option A (simple): Enable Public Bucket or add an R2 Custom Domain for the bucket
   - Copy your public base URL (no trailing slash), e.g. `https://<bucket>.<accountid>.r2.cloudflarestorage.com` or `https://cdn.example.com`

3) Bind R2 to your Cloudflare Pages project
   - Cloudflare Dashboard → Pages → your project → Settings → Environment variables and Bindings
   - R2 bindings → Add binding
     - Variable name: `R2_BUCKET`
     - Bucket: select your bucket from step 1

4) Add environment variable for public URL
   - Same page → Environment variables → Add variable
     - Name: `R2_PUBLIC_BASE_URL`
     - Value: the public base URL from step 2 (no trailing slash)

5) Deploy the app
   - Push these repo changes or trigger a new build to ensure the Pages Function is deployed
   - The function lives at `functions/api/upload-image.ts`

6) Verify uploads work
   - Open your deployed preview URL
   - Test image upload in the UI (products, bulk, logo)
   - In Supabase, new rows should reference `image_url` pointing to your R2 domain

7) (Optional) Migrate existing images from Supabase to R2
   - Export `products.image_url` and any other image fields from Supabase
   - For each URL: download the file and re-upload via `/api/upload-image` (prefix `products/`), or upload directly using the R2 S3-compatible API
   - Update the corresponding DB rows with the new R2 URLs

Notes
- Local dev via `npm run dev` does not run Cloudflare Functions. To test the `/api/upload-image` endpoint locally, use a Cloudflare preview deployment or run a local Pages dev environment with Wrangler.

## 🔧 Troubleshooting Build Issues

If you encounter Rollup/npm dependency errors during build:

1. **Use the deployment build script:**
   ```bash
   npm run build:deploy
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps --ignore-optional
   npm run build
   ```

3. **Platform-specific issues:**
   - Uses `@vitejs/plugin-react` instead of `@vitejs/plugin-react-swc` to avoid native binding issues
   - Standard Vite configuration without complex overrides
   - Simple `.npmrc` with only essential flags

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
