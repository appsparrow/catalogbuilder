
import { useState } from "react";
import { Product, CatalogWithProducts } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Share, Eye, ExternalLink } from "lucide-react";

interface CatalogBuilderProps {
  products: Product[];
  onCatalogCreate: (catalogData: {
    name: string;
    brand_name: string;
    logo_url?: string;
    customer_name: string;
    product_ids: string[];
  }) => Promise<any>;
  catalogs: CatalogWithProducts[];
}

export const CatalogBuilder = ({ products, onCatalogCreate, catalogs }: CatalogBuilderProps) => {
  const [catalogName, setCatalogName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleCreateCatalog = async () => {
    if (!catalogName || !brandName || !customerName || selectedProducts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one product",
        variant: "destructive"
      });
      return;
    }

    try {
      await onCatalogCreate({
        name: catalogName,
        brand_name: brandName,
        logo_url: logoUrl,
        customer_name: customerName,
        product_ids: selectedProducts
      });

      // Reset form
      setCatalogName("");
      setBrandName("");
      setCustomerName("");
      setLogoUrl("");
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error creating catalog:', error);
    }
  };

  const copyShareLink = (link: string) => {
    const fullLink = `${window.location.origin}/catalog/${link}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link Copied",
      description: "Shareable catalog link has been copied to clipboard",
    });
  };

  const openCatalog = (link: string) => {
    const fullLink = `${window.location.origin}/catalog/${link}`;
    window.open(fullLink, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Catalog Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Create New Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catalog-name" className="text-foreground">Catalog Name</Label>
              <Input
                id="catalog-name"
                value={catalogName}
                onChange={(e) => setCatalogName(e.target.value)}
                placeholder="Enter catalog name"
              />
            </div>
            
            <div>
              <Label htmlFor="brand-name" className="text-foreground">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
              />
            </div>

            <div>
              <Label htmlFor="customer-name" className="text-foreground">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <Label htmlFor="logo-url" className="text-foreground">Logo URL (Optional)</Label>
              <Input
                id="logo-url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter logo URL"
              />
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <Label className="text-foreground mb-4 block">Select Products ({selectedProducts.length} selected)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {products.map(product => (
                <Card key={product.id} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                         <img
                           src={product.image_url}
                           alt={product.name}
                           className="w-full h-24 object-cover rounded mb-2"
                         />
                        <h4 className="text-foreground text-sm font-medium truncate">{product.name}</h4>
                        <p className="text-muted-foreground text-xs">{product.code}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleCreateCatalog} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Catalog
          </Button>
        </CardContent>
      </Card>

      {/* Existing Catalogs */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Created Catalogs ({catalogs.length})</h3>
        {catalogs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No catalogs created yet. Create your first catalog above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {catalogs.map(catalog => (
               <Card key={catalog.id} className="border-border hover:shadow-lg transition-shadow">
                 <CardContent className="p-4">
                   <h4 className="text-foreground font-semibold mb-2">{catalog.name}</h4>
                   <p className="text-muted-foreground text-sm mb-2">Brand: {catalog.brand_name}</p>
                   <p className="text-muted-foreground text-sm mb-4">{catalog.products.length} products</p>
                   
                   <div className="flex gap-2 flex-wrap">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => copyShareLink(catalog.shareable_link)}
                       className="flex-1"
                     >
                       <Share className="mr-1 h-4 w-4" />
                       Copy Link
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => openCatalog(catalog.shareable_link)}
                       className="flex-1"
                     >
                       <ExternalLink className="mr-1 h-4 w-4" />
                       Preview
                     </Button>
                   </div>
                   
                   <div className="mt-2 text-xs text-muted-foreground break-all">
                     Link: /catalog/{catalog.shareable_link}
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
