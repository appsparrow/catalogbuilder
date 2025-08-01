
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/catalog";
import { X } from "lucide-react";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, updates: Partial<Product>) => Promise<void>;
}

const categories = [
  "Sofa", "Dining Chairs", "Dining Table", "Beds", "Bed Side Table", 
  "Corner Table", "Lounge Chair", "Bedroom Couch"
];

const suppliers = ["UTD", "BKS", "BOB"];

export const EditProductModal = ({ product, isOpen, onClose, onSave }: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    supplier: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        code: product.code || "",
        category: product.category || "",
        supplier: product.supplier || ""
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!product || !formData.name.trim() || !formData.code.trim() || !formData.category || !formData.supplier) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(product.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category,
        supplier: formData.supplier
      });
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">Edit Product</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Product Image */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Product Image</Label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 sm:h-64 object-cover"
              />
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                disabled={isSaving}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-code">Product Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Enter product code"
                disabled={isSaving}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isSaving}
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
              <Label htmlFor="edit-supplier">Supplier *</Label>
              <Select 
                value={formData.supplier} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}
                disabled={isSaving}
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

            {/* Preview */}
            <div className="pt-3 sm:pt-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">Preview:</div>
              {formData.name && (
                <div className="space-y-1">
                  <div className="font-medium text-sm sm:text-base">{formData.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{formData.code}</div>
                  <div className="flex gap-1 sm:gap-2">
                    {formData.category && (
                      <Badge variant="secondary" className="text-xs">{formData.category}</Badge>
                    )}
                    {formData.supplier && (
                      <Badge variant="outline" className="text-xs">{formData.supplier}</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !formData.name.trim() || !formData.code.trim() || !formData.category || !formData.supplier}
            className="w-full sm:w-auto"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
