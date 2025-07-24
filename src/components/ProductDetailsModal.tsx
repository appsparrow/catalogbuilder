
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface ProductDetailsModalProps {
  image: UploadedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageId: string, details: {
    name: string;
    code: string;
    category: string;
    supplier: string;
  }) => void;
}

const categories = [
  "Chair", "Table", "Dining Table", "Sofa", "Center Table", 
  "Bed", "Wardrobe", "Desk", "Bookshelf", "Cabinet"
];

const suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];

export const ProductDetailsModal = ({ image, isOpen, onClose, onSave }: ProductDetailsModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    supplier: ""
  });

  useEffect(() => {
    if (image?.details) {
      setFormData(image.details);
    } else {
      setFormData({
        name: "",
        code: `PRD-${Date.now()}`,
        category: "",
        supplier: ""
      });
    }
  }, [image]);

  const handleSave = () => {
    if (!image || !formData.name || !formData.category || !formData.supplier) {
      return;
    }
    
    // Update the image details in the parent component
    if (image.details) {
      image.details = formData;
    } else {
      (image as any).details = formData;
    }
    
    onSave(image.id, formData);
    onClose();
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add Product Details
            {image.details && (
              <Badge variant="outline" className="text-xs">
                Editing
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below to add this item to your catalog.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={image.preview}
                alt="Product"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <Label htmlFor="code">Product Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter product code"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">Preview:</div>
              {formData.name && (
                <div className="space-y-1">
                  <div className="font-medium">{formData.name}</div>
                  <div className="text-sm text-muted-foreground">{formData.code}</div>
                  <div className="flex gap-2">
                    {formData.category && (
                      <Badge variant="secondary">{formData.category}</Badge>
                    )}
                    {formData.supplier && (
                      <Badge variant="outline">{formData.supplier}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.category || !formData.supplier}
          >
            {image.details ? 'Update Details' : 'Save Details'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
