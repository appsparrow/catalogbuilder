
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
}

interface BulkImageUploadProps {
  onImagesProcessed: (images: UploadedImage[]) => void;
  onEditImage: (image: UploadedImage) => void;
}

export const BulkImageUpload = ({ onImagesProcessed, onEditImage }: BulkImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file)
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

  const processImages = () => {
    const imagesWithDetails = uploadedImages.filter(img => img.details);
    if (imagesWithDetails.length > 0) {
      onImagesProcessed(imagesWithDetails);
    }
  };

  const imagesWithDetails = uploadedImages.filter(img => img.details);
  const imagesWithoutDetails = uploadedImages.filter(img => !img.details);

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

      {/* Processed Images Ready to Upload */}
      {imagesWithDetails.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Ready to Process</h3>
              <Badge variant="default" className="text-xs sm:text-sm">{imagesWithDetails.length}</Badge>
            </div>
            <Button onClick={processImages} className="flex items-center gap-2 w-full sm:w-auto">
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Process {imagesWithDetails.length} Products</span>
              <span className="sm:hidden">Process Products</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {imagesWithDetails.map(image => (
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
