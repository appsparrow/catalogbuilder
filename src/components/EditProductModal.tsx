import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/catalog";

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
  const portalRef = useRef<HTMLDivElement | null>(null);

  // Prepare portal root on first mount
  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('id', 'edit-product-modal-root');
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.zIndex = '9999';
    el.style.display = 'none';
    document.body.appendChild(el);
    portalRef.current = el;
    return () => {
      document.body.removeChild(el);
      portalRef.current = null;
    };
  }, []);

  // Sync open/close and lock scroll
  useEffect(() => {
    const root = portalRef.current;
    if (!root) return;
    if (isOpen && product) {
      root.style.display = 'block';
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
        root.style.display = 'none';
      };
    } else {
      root.style.display = 'none';
    }
  }, [isOpen, product]);

  // Initialize form when opened with product
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        code: product.code || "",
        category: product.category || "",
        supplier: product.supplier || "",
      });
    }
  }, [isOpen, product]);

  const closeSafely = () => {
    if (isSaving) return;
    setIsSaving(false);
    onClose();
  };

  const handleSave = async () => {
    if (!product || !formData.name.trim() || !formData.code.trim() || !formData.category || !formData.supplier) return;
    setIsSaving(true);
    try {
      await onSave(product.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        category: formData.category,
        supplier: formData.supplier,
      });
      closeSafely();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !product || !portalRef.current) return null;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999]"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeSafely();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeSafely}
      />

      {/* Sheet */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-semibold">Edit Product</h2>
            <p className="text-sm text-muted-foreground mt-1">Update the product details below. All fields are required.</p>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 sm:gap-6">
            {/* Product Image */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Product Image</Label>
              <div className="border rounded-lg overflow-hidden">
                <img src={product.image_url} alt={product.name} className="w-full h-48 sm:h-64 object-cover" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="edit-code">Product Code *</Label>
                <Input id="edit-code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="Enter product code" />
              </div>
              <div>
                <Label htmlFor="edit-supplier">Supplier *</Label>
                <Select value={formData.supplier} onValueChange={(v) => setFormData({ ...formData, supplier: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]">
                    {suppliers.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
                      {formData.supplier && (<Badge variant="outline" className="text-xs">{formData.supplier}</Badge>)}
                      {formData.category && (<Badge variant="secondary" className="text-xs">{formData.category}</Badge>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button variant="outline" onClick={closeSafely} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name.trim() || !formData.code.trim() || !formData.category || !formData.supplier} className="w-full sm:w-auto">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalRef.current);
};