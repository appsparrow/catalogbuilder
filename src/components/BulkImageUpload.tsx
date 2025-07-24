
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    toast({
      title: "Images uploaded",
      description: `${acceptedFiles.length} images ready for processing`
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const processImages = () => {
    const incompleteImages = uploadedImages.filter(img => !img.details);
    if (incompleteImages.length > 0) {
      toast({
        title: "Incomplete details",
        description: `Please add details for ${incompleteImages.length} images`,
        variant: "destructive"
      });
      return;
    }
    onImagesProcessed(uploadedImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </h3>
            <p className="text-muted-foreground mb-4">or click to select files</p>
            <p className="text-sm text-muted-foreground">
              Supports: JPG, PNG, WebP (multiple files)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Uploaded Images ({uploadedImages.length})
              </h3>
              <Button 
                onClick={processImages}
                disabled={uploadedImages.some(img => !img.details)}
              >
                Process All Images
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map(image => (
                <div key={image.id} className="relative group">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={image.preview}
                        alt="Upload preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        {image.details ? (
                          <div>
                            <p className="text-sm font-medium truncate">
                              {image.details.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {image.details.code}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Click to add details
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6"
                      onClick={() => onEditImage(image)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`absolute top-2 left-2 w-3 h-3 rounded-full ${
                    image.details ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
