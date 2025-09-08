
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Edit, Check, ArrowRight, Lock } from "lucide-react";
import { useUnprocessedProducts, UnprocessedProduct } from "@/hooks/useUnprocessedProducts";
import { useSubscription } from "@/hooks/useSubscription";
import { getThumbnailUrl } from "@/utils/imageUtils";

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  details?: {
    name: string;
    code: string;
    category: string;
    supplier: string;
  };
  status?: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  unprocessedId?: string; // Link to database record
}

interface BulkImageUploadProps {
  onImagesProcessed: (images: UploadedImage[]) => void;
  onEditImage: (image: UploadedImage) => void;
}

export const BulkImageUpload = ({ onImagesProcessed, onEditImage }: BulkImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    unprocessedProducts, 
    addUnprocessedProduct, 
    updateUnprocessedProduct, 
    removeUnprocessedProduct, 
    uploadUnprocessedImage,
    loading 
  } = useUnprocessedProducts();
  const { canUploadImage, usage, currentPlan } = useSubscription();
  const isOverLimit = (usage?.imageCount || 0) >= (usage?.maxImages || 0);

  // Debug logging
  useEffect(() => {
    console.log('🔍 BulkImageUpload Debug:', {
      usage: {
        processedImages: usage?.imageCount || 0,
        maxImages: usage?.maxImages || 50,
        catalogs: usage?.catalogCount || 0,
        maxCatalogs: usage?.maxCatalogs || 5
      },
      currentPlan: currentPlan?.name,
      isOverLimit,
      canUpload: canUploadImage(),
      uploadedImagesCount: uploadedImages.length,
      imagesWithDetails: uploadedImages.filter(img => img.details).length,
      unprocessedImages: uploadedImages.filter(img => !img.details).length
    });
  }, [usage, currentPlan, isOverLimit, uploadedImages]);

  // Sync unprocessed products from database to local state
  useEffect(() => {
    const images: UploadedImage[] = unprocessedProducts.map(product => ({
      id: product.id,
      unprocessedId: product.id,
      preview: product.image_url,
      status: 'pending' as const,
      details: (product.name && product.code && product.category && product.supplier) ? {
        name: product.name,
        code: product.code,
        category: product.category,
        supplier: product.supplier
      } : undefined
    }));
    
    // Preserve existing images with details that aren't in the database yet
    setUploadedImages(prevImages => {
      const existingImagesWithDetails = prevImages.filter(img => 
        img.details && !img.unprocessedId
      );
      
      // Combine existing images with details and new unprocessed products
      return [...existingImagesWithDetails, ...images];
    });
  }, [unprocessedProducts]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Check if user can upload more images (only count processed products)
    const processedCount = usage?.imageCount || 0;
    const maxImages = usage?.maxImages || 50;
    
    if (processedCount >= maxImages) {
      alert(`You've reached your processed image limit (${processedCount}/${maxImages}). Upgrade to Starter plan to process more images.`);
      return;
    }

    // Check if adding these files would exceed the limit
    const remainingSlots = maxImages - processedCount;
    
    if (acceptedFiles.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more images. Upgrade to Starter plan for more storage.`);
      return;
    }

    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        // Upload to storage and save to database
        const imageUrl = await uploadUnprocessedImage(file);
        await addUnprocessedProduct({
          image_url: imageUrl,
          original_image_url: imageUrl
        });
        
        // Note: The useEffect above will automatically update the local state
        // when unprocessedProducts changes
      } catch (error) {
        console.error('Error uploading file:', error);
        // Could add error handling here
      }
    });
    
    await Promise.all(uploadPromises);
  }, [uploadUnprocessedImage, addUnprocessedProduct, canUploadImage, usage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeImage = async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image?.unprocessedId) {
      await removeUnprocessedProduct(image.unprocessedId);
    }
    // The useEffect will automatically update local state when unprocessedProducts changes
  };

  const resetProcessedImages = () => {
    setUploadedImages(prev => prev.filter(img => img.status !== 'success' && img.status !== 'error'));
  };

  const processImages = async () => {
    const imagesWithDetails = uploadedImages.filter(img => img.details);
    if (imagesWithDetails.length > 0) {
      setIsProcessing(true);
      
      // Mark images as processing
      setUploadedImages(prev => prev.map(img => 
        img.details ? { ...img, status: 'processing' as const } : img
      ));
      
      try {
        await onImagesProcessed(imagesWithDetails);
        
        // Mark successful images and remove from unprocessed products
        const successfulImages = imagesWithDetails;
        setUploadedImages(prev => prev.map(img => 
          img.details ? { ...img, status: 'success' as const } : img
        ));

        // Remove successfully processed images from unprocessed products table
        for (const image of successfulImages) {
          if (image.unprocessedId) {
            try {
              await removeUnprocessedProduct(image.unprocessedId);
            } catch (error) {
              console.error('Error removing processed image from unprocessed products:', error);
            }
          }
        }
      } catch (error) {
        // Mark failed images
        setUploadedImages(prev => prev.map(img => 
          img.details ? { ...img, status: 'error' as const, error: 'Processing failed' } : img
        ));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const imagesWithDetails = uploadedImages.filter(img => img.details);
  const imagesWithoutDetails = uploadedImages.filter(img => !img.details);
  const processingImages = uploadedImages.filter(img => img.status === 'processing');
  const successImages = uploadedImages.filter(img => img.status === 'success');
  const errorImages = uploadedImages.filter(img => img.status === 'error');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : canUploadImage()
                  ? 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
                  : 'border-red-300 bg-red-50 cursor-not-allowed'
            }`}
          >
            <input {...getInputProps()} disabled={!canUploadImage()} />
            {canUploadImage() ? (
              <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
            ) : (
              <Lock className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-red-500 mb-3 sm:mb-4" />
            )}
            <h3 className="text-base sm:text-lg font-semibold mb-2">Upload Products</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              {(usage?.imageCount || 0) >= (usage?.maxImages || 50)
                ? `Processed image limit reached (${usage?.imageCount || 0}/${usage?.maxImages || 50}). Upgrade to Starter plan to process more images.`
                : isDragActive
                  ? "Drop the images here..."
                  : "Drag & drop images here, or click to select files"
              }
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Supports: JPEG, PNG, WebP
            </p>
            {usage && (
              <div className="mt-4 text-xs text-muted-foreground">
                {usage.imageCount} / {usage.maxImages} processed images
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unprocessed Images */}
      {imagesWithoutDetails.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Unprocessed Images</h3>
            <Badge variant="outline" className="text-xs sm:text-sm">{imagesWithoutDetails.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {imagesWithoutDetails.map(image => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getThumbnailUrl(image.preview)}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 h-5 w-5 sm:h-6 sm:w-6 p-0"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                  <div className="p-2 sm:p-3">
                    <Button
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                      onClick={() => onEditImage(image)}
                    >
                      <Edit className="mr-1 sm:mr-2 h-3 w-3" />
                      Add Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Ready to Process Images */}
      {imagesWithDetails.filter(img => img.status === 'pending').length > 0 && !isOverLimit && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Ready to Process</h3>
              <Badge variant="default" className="text-xs sm:text-sm">{imagesWithDetails.filter(img => img.status === 'pending').length}</Badge>
            </div>
            <Button 
              onClick={processImages} 
              disabled={isProcessing}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isProcessing ? `Processing ${processingImages.length} Products...` : `Process ${imagesWithDetails.filter(img => img.status === 'pending').length} Products`}
              </span>
              <span className="sm:hidden">
                {isProcessing ? 'Processing...' : 'Process Products'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {imagesWithDetails.filter(img => img.status === 'pending').map(image => (
              <Card key={image.id} className="overflow-hidden border-green-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getThumbnailUrl(image.preview)}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 h-5 w-5 sm:h-6 sm:w-6 p-0"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                      <Badge variant="default" className="bg-green-600 text-xs">
                        <Check className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Ready
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h4 className="font-medium truncate text-sm sm:text-base">{image.details?.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{image.details?.code}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">{image.details?.category}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 text-xs sm:text-sm"
                      onClick={() => onEditImage(image)}
                    >
                      <Edit className="mr-1 sm:mr-2 h-3 w-3" />
                      Edit Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Over-limit notice instead of processing controls */}
      {imagesWithDetails.filter(img => img.status === 'pending').length > 0 && isOverLimit && (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center text-red-700">
            <h3 className="text-base sm:text-lg font-semibold mb-1">Processed image limit reached</h3>
            <p className="text-sm sm:text-base">
              You have {usage?.imageCount || 0} processed images (limit: {usage?.maxImages || 50}). 
              Upgrade to Starter plan to process {imagesWithDetails.filter(img => img.status === 'pending').length} more product(s).
            </p>
          </CardContent>
        </Card>
      )}

      {/* Processing Images */}
      {processingImages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Processing</h3>
            <Badge variant="secondary" className="text-xs sm:text-sm">{processingImages.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {processingImages.map(image => (
              <Card key={image.id} className="overflow-hidden border-blue-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getThumbnailUrl(image.preview)}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover opacity-75"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge variant="secondary" className="bg-blue-600 text-xs">
                        <div className="animate-spin h-3 w-3 mr-1">⏳</div>
                        Processing
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h4 className="font-medium truncate text-sm sm:text-base">{image.details?.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{image.details?.code}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">{image.details?.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Successfully Processed Images */}
      {successImages.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Successfully Processed</h3>
              <Badge variant="default" className="bg-green-600 text-xs sm:text-sm">{successImages.length}</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetProcessedImages}
              className="w-full sm:w-auto"
            >
              Clear Processed
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {successImages.map(image => (
              <Card key={image.id} className="overflow-hidden border-green-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getThumbnailUrl(image.preview)}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge variant="default" className="bg-green-600 text-xs">
                        <Check className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Success
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h4 className="font-medium truncate text-sm sm:text-base">{image.details?.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{image.details?.code}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">{image.details?.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Failed Images */}
      {errorImages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Failed to Process</h3>
            <Badge variant="destructive" className="text-xs sm:text-sm">{errorImages.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {errorImages.map(image => (
              <Card key={image.id} className="overflow-hidden border-red-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={getThumbnailUrl(image.preview)}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover opacity-75"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge variant="destructive" className="text-xs">
                        ❌ Failed
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h4 className="font-medium truncate text-sm sm:text-base">{image.details?.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{image.details?.code}</p>
                    <p className="text-xs text-red-600 mt-1">{image.error}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 text-xs sm:text-sm"
                      onClick={() => onEditImage(image)}
                    >
                      <Edit className="mr-1 sm:mr-2 h-3 w-3" />
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && !loading && (
        <div className="text-center py-8 sm:py-12">
          <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">No products uploaded yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">Start by uploading some product images above</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin h-8 w-8 mx-auto mb-4">⏳</div>
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">Loading products...</h3>
        </div>
      )}
    </div>
  );
};
