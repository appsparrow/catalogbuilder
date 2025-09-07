
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowLeft, Upload, X, Lock } from "lucide-react";
import { Product } from "@/types/catalog";
import { useToast } from "@/hooks/use-toast";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useSubscription } from "@/hooks/useSubscription";

interface CatalogCreatorProps {
  selectedProducts: Product[];
  onBack: () => void;
  onCatalogCreate: (catalogData: {
    name: string;
    brand_name: string;
    logo_url?: string;
    customer_name: string;
    product_ids: string[];
  }) => Promise<any>;
}

export const CatalogCreator = ({ selectedProducts, onBack, onCatalogCreate }: CatalogCreatorProps) => {
  console.log('📋 CatalogCreator rendered with selectedProducts:', selectedProducts);
  
  const [catalogName, setCatalogName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("/logo-IllusDecor.png");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { uploadLogo } = useLogoUpload();
  const { canCreateCatalog, usage, currentPlan } = useSubscription();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const handleCreateCatalog = async () => {
    if (!catalogName || !brandName || !customerName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check catalog creation limit
    if (!canCreateCatalog()) {
      toast({
        title: "Catalog limit reached",
        description: `You've reached your catalog limit (${usage?.catalogCount || 0}/${usage?.maxCatalogs || 1}). Upgrade to Starter plan to create up to 5 catalogs.`,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      let logoUrl = "/logo-IllusDecor.png"; // Default to ILLUS DECOR logo
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile, brandName);
      }

      const result = await onCatalogCreate({
        name: catalogName,
        brand_name: brandName,
        logo_url: logoUrl,
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

  const handleBack = () => {
    console.log('📋 CatalogCreator: Navigating back to products');
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
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

            <div>
              <Label htmlFor="logo-upload">Company Logo (Optional)</Label>
              <div className="space-y-3">
                {!logoPreview ? (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="w-full"
                      >
                        Upload Custom Logo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended: Square logo, max 2MB
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Or use a preset logo:</p>
                      <div className="flex justify-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogoPreview("/logo-IllusDecor.png");
                            setLogoFile(null);
                          }}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <img
                            src="/logo-IllusDecor.png"
                            alt="ILLUS DECOR Logo"
                            className="w-12 h-12 object-contain mb-2"
                          />
                          <span className="text-xs">ILLUS DECOR</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-24 h-24 object-contain mx-auto border rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleCreateCatalog}
              disabled={isCreating || !catalogName || !brandName || !customerName || !canCreateCatalog()}
              className="w-full"
            >
              {!canCreateCatalog() ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Catalog Limit Reached
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  {isCreating ? 'Creating...' : 'Create & Share Catalog'}
                </>
              )}
            </Button>
            
            {usage && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                {usage.catalogCount} / {usage.maxCatalogs} catalogs used
              </div>
            )}
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
