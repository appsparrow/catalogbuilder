
import { useState } from "react";
import { BulkImageUpload } from "./BulkImageUpload";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ProductsLibrary } from "./ProductsLibrary";
import { CatalogCreator } from "./CatalogCreator";
import { CatalogManagement } from "./CatalogManagement";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Package, FileText, ArrowLeft, Settings } from "lucide-react";

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

type ViewState = 'upload' | 'products' | 'create-catalog' | 'management';

export const MainDashboard = () => {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { products, addProduct, uploadImage } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { toast } = useToast();

  const handleImageEdit = (image: UploadedImage) => {
    setEditingImage(image);
  };

  const handleSaveImageDetails = (imageId: string, details: any) => {
    // This is handled in BulkImageUpload component
    setEditingImage(null);
  };

  const handleImagesProcessed = async (images: UploadedImage[]) => {
    try {
      for (const image of images) {
        if (image.details) {
          // Upload image to Supabase
          const imageUrl = await uploadImage(image.file, image.details.code);
          
          // Create product in database
          await addProduct({
            name: image.details.name,
            code: image.details.code,
            category: image.details.category,
            supplier: image.details.supplier,
            image_url: imageUrl,
            original_image_url: imageUrl
          });
        }
      }
      
      setCurrentView('products');
      
      toast({
        title: "Products created!",
        description: `${images.length} products added to your library`
      });
      
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Error",
        description: "Failed to process some images",
        variant: "destructive"
      });
    }
  };

  const handleProductSelect = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleCreateCatalog = () => {
    setCurrentView('create-catalog');
  };

  const handleCatalogCreate = async (catalogData: any) => {
    return await createCatalog(catalogData);
  };

  const getSelectedProductsData = () => {
    return products.filter(p => selectedProducts.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-mixed bg-clip-text text-transparent">
                Product Catalog Builder
              </h1>
              <p className="text-muted-foreground">Upload products and create custom catalogs</p>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  currentView === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">1. Upload</span>
                </div>
                <div className="w-8 h-px bg-border" />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  currentView === 'products' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">2. Products</span>
                  {products.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{products.length}</Badge>
                  )}
                </div>
                <div className="w-8 h-px bg-border" />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  currentView === 'create-catalog' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">3. Catalog</span>
                </div>
                <div className="w-8 h-px bg-border" />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  currentView === 'management' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">4. Management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {currentView !== 'upload' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentView === 'management') {
                  setCurrentView('products');
                } else if (currentView === 'create-catalog') {
                  setCurrentView('products');
                } else {
                  setCurrentView('upload');
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button
              variant={currentView === 'upload' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
            <Button
              variant={currentView === 'products' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('products')}
              disabled={products.length === 0}
            >
              <Package className="h-4 w-4 mr-2" />
              Products Library ({products.length})
            </Button>
            <Button
              variant={currentView === 'management' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('management')}
              disabled={catalogs.length === 0}
            >
              <Settings className="h-4 w-4 mr-2" />
              Catalog Management ({catalogs.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {currentView === 'upload' && (
          <BulkImageUpload
            onImagesProcessed={handleImagesProcessed}
            onEditImage={handleImageEdit}
          />
        )}

        {currentView === 'products' && (
          <ProductsLibrary
            products={products}
            selectedProducts={selectedProducts}
            onProductSelect={handleProductSelect}
            onCreateCatalog={handleCreateCatalog}
          />
        )}

        {currentView === 'create-catalog' && (
          <CatalogCreator
            selectedProducts={getSelectedProductsData()}
            onBack={() => setCurrentView('products')}
            onCatalogCreate={handleCatalogCreate}
          />
        )}

        {currentView === 'management' && (
          <CatalogManagement 
            catalogs={catalogs} 
            onCatalogDeleted={refetchCatalogs}
          />
        )}
      </main>

      {/* Modal */}
      <ProductDetailsModal
        image={editingImage}
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        onSave={handleSaveImageDetails}
      />
    </div>
  );
};
