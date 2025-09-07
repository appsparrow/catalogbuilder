// Image utility functions for consistent sizing and optimization

export const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than 500KB. Current size: ${(file.size / 1024).toFixed(1)}KB`
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }

  return { valid: true };
};

// Cloudflare Image Optimizer URL generator
export const getOptimizedImageUrl = (originalUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
} = {}): string => {
  const {
    width = 400,
    height = 400,
    quality = 85,
    format = 'auto'
  } = options;

  // Extract the base URL and path
  const url = new URL(originalUrl);
  const baseUrl = `${url.protocol}//${url.host}`;
  const imagePath = url.pathname;

  // Build Cloudflare Image Resizing URL
  // Format: /cdn-cgi/image/{options}/{image-path}
  const resizeOptions = [
    `width=${width}`,
    `height=${height}`,
    `quality=${quality}`,
    `format=${format}`,
    'fit=cover', // Crop to fill dimensions
    'gravity=auto' // Smart cropping
  ].join(',');

  return `${baseUrl}/cdn-cgi/image/${resizeOptions}${imagePath}`;
};

// Standard image sizes for different use cases
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 400, height: 400 }, // For product cards, catalogs
  MEDIUM: { width: 600, height: 600 },    // For product details
  LARGE: { width: 800, height: 800 },     // For full-size viewing
} as const;

// Helper to get thumbnail URL
export const getThumbnailUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, IMAGE_SIZES.THUMBNAIL);
};

// Helper to get medium URL
export const getMediumUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, IMAGE_SIZES.MEDIUM);
};

// Helper to get large URL
export const getLargeUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, IMAGE_SIZES.LARGE);
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

