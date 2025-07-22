import { useState } from "react";
import { Product, CustomCatalog } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Share, Eye, Trash2 } from "lucide-react";

interface CatalogBuilderProps {
  products: Product[];
  onCatalogCreate: (catalog: CustomCatalog) => void;
  catalogs: CustomCatalog[];
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

  const handleCreateCatalog = () => {
    if (!catalogName || !brandName || !customerName || selectedProducts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one product",
        variant: "destructive"
      });
      return;
    }

    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    const shareableLink = `${window.location.origin}/catalog/${crypto.randomUUID()}`;

    const newCatalog: CustomCatalog = {
      id: crypto.randomUUID(),
      name: catalogName,
      brandName,
      logoUrl,
      products: selectedProductsData,
      customerName,
      shareableLink,
      createdAt: new Date()
    };

    onCatalogCreate(newCatalog);

    // Reset form
    setCatalogName("");
    setBrandName("");
    setCustomerName("");
    setLogoUrl("");
    setSelectedProducts([]);

    toast({
      title: "Catalog Created",
      description: "Custom catalog has been created successfully",
    });
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard",
    });
  };

  return (
    <div className="space-y-8">
      {/* Catalog Creation Form */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Create New Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catalog-name" className="text-white">Catalog Name</Label>
              <Input
                id="catalog-name"
                value={catalogName}
                onChange={(e) => setCatalogName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Enter catalog name"
              />
            </div>
            
            <div>
              <Label htmlFor="brand-name" className="text-white">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Enter your brand name"
              />
            </div>

            <div>
              <Label htmlFor="customer-name" className="text-white">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <Label htmlFor="logo-url" className="text-white">Logo URL (Optional)</Label>
              <Input
                id="logo-url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Enter logo URL"
              />
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <Label className="text-white mb-4 block">Select Products</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {products.map(product => (
                <Card key={product.id} className="bg-white/10 border-white/20">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="text-white text-sm font-medium truncate">{product.name}</h4>
                        <p className="text-white/60 text-xs">{product.code}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
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

          <Button onClick={handleCreateCatalog} className="bg-white text-purple-600 hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Catalog
          </Button>
        </CardContent>
      </Card>

      {/* Existing Catalogs */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Created Catalogs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map(catalog => (
            <Card key={catalog.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">{catalog.name}</h4>
                <p className="text-white/80 text-sm mb-2">Brand: {catalog.brandName}</p>
                <p className="text-white/80 text-sm mb-2">Customer: {catalog.customerName}</p>
                <p className="text-white/60 text-sm mb-4">{catalog.products.length} products</p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyShareLink(catalog.shareableLink)}
                    className="text-white border-white/30 hover:bg-white/20"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
