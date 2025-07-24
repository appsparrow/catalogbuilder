
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowLeft } from "lucide-react";
import { Product } from "@/types/catalog";
import { useToast } from "@/hooks/use-toast";

interface CatalogCreatorProps {
  selectedProducts: Product[];
  onBack: () => void;
  onCatalogCreate: (catalogData: {
    name: string;
    brand_name: string;
    customer_name: string;
    product_ids: string[];
  }) => Promise<any>;
}

export const CatalogCreator = ({ selectedProducts, onBack, onCatalogCreate }: CatalogCreatorProps) => {
  const [catalogName, setCatalogName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateCatalog = async () => {
    if (!catalogName || !brandName || !customerName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await onCatalogCreate({
        name: catalogName,
        brand_name: brandName,
        customer_name: customerName,
        product_ids: selectedProducts.map(p => p.id)
      });

      toast({
        title: "Catalog created!",
        description: "Your catalog is ready to share",
      });

      // Show sharing info
      const shareLink = `${window.location.origin}/catalog/${result.shareableLink}`;
      navigator.clipboard.writeText(shareLink);
      
      toast({
        title: "Link copied!",
        description: "Catalog link has been copied to clipboard",
      });

    } catch (error) {
      console.error('Error creating catalog:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create Catalog</h2>
          <p className="text-muted-foreground">
            {selectedProducts.length} products selected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Catalog Details */}
        <Card>
          <CardHeader>
            <CardTitle>Catalog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="catalog-name">Catalog Name *</Label>
              <Input
                id="catalog-name"
                value={catalogName}
                onChange={(e) => setCatalogName(e.target.value)}
                placeholder="e.g., Spring Collection 2024"
              />
            </div>
            
            <div>
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
              />
            </div>
            
            <div>
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer this catalog is for"
              />
            </div>

            <Button 
              onClick={handleCreateCatalog}
              disabled={isCreating || !catalogName || !brandName || !customerName}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {isCreating ? 'Creating...' : 'Create & Share Catalog'}
            </Button>
          </CardContent>
        </Card>

        {/* Selected Products Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Products ({selectedProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {selectedProducts.map(product => (
                <div key={product.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.code}</p>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
