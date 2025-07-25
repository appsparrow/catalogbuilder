
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Edit, Check, ArrowRight } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  details?: {
    name: string;
    code: string;
    category: string;
    supplier: string;
  };
  status?: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

interface BulkImageUploadProps {
  onImagesProcessed: (images: UploadedImage[]) => void;
  onEditImage: (image: UploadedImage) => void;
}

export const BulkImageUpload = ({ onImagesProcessed, onEditImage }: BulkImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
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
        
        // Mark successful images
        setUploadedImages(prev => prev.map(img => 
          img.details ? { ...img, status: 'success' as const } : img
        ));
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
                : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Upload Product Images</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              {isDragActive
                ? "Drop the images here..."
                : "Drag & drop images here, or click to select files"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Supports: JPEG, PNG, WebP
            </p>
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
                      src={image.preview}
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
      {imagesWithDetails.filter(img => img.status === 'pending').length > 0 && (
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
                      src={image.preview}
                      alt="Product"
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
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
                      src={image.preview}
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
                      src={image.preview}
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
                      src={image.preview}
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

      {uploadedImages.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Upload className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">No images uploaded yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">Start by uploading some product images above</p>
        </div>
      )}
    </div>
  );
};
