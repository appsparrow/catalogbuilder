
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
import React from "react";

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

interface MainDashboardProps {
  activeView?: 'main' | 'products' | 'catalogs';
  onViewChange?: (view: 'main' | 'products' | 'catalogs') => void;
}

export const MainDashboard = ({ activeView, onViewChange }: MainDashboardProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { products, addProduct, uploadImage } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { toast } = useToast();

  // Sync with header menu - only sync when activeView changes from parent
  React.useEffect(() => {
    if (activeView === 'products' && currentView !== 'create-catalog') {
      setCurrentView('products');
    } else if (activeView === 'catalogs') {
      setCurrentView('management');
    } else if (activeView === 'main' && currentView !== 'create-catalog') {
      setCurrentView('upload');
    }
  }, [activeView]);

  // Sync back to header menu - but don't interfere with catalog creation flow
  React.useEffect(() => {
    if (onViewChange && currentView !== 'create-catalog') {
      if (currentView === 'products') {
        onViewChange('products');
      } else if (currentView === 'management') {
        onViewChange('catalogs');
      } else if (currentView === 'upload') {
        onViewChange('main');
      }
    }
  }, [currentView, onViewChange]);

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
    console.log('Creating catalog with selected products:', selectedProducts);
    setCurrentView('create-catalog');
  };

  const handleCatalogCreate = async (catalogData: any) => {
    const result = await createCatalog(catalogData);
    // After successful catalog creation, go to management view
    setCurrentView('management');
    return result;
  };

  const getSelectedProductsData = () => {
    return products.filter(p => selectedProducts.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Product Catalog Builder
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Upload products and create custom catalogs</p>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-1 sm:gap-2 min-w-max">
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentView === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium hidden sm:inline">1. Upload</span>
                  <span className="font-medium sm:hidden">Upload</span>
                </div>
                <div className="w-4 sm:w-8 h-px bg-border" />
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentView === 'products' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium hidden sm:inline">2. Products</span>
                  <span className="font-medium sm:hidden">Products</span>
                  {products.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">{products.length}</Badge>
                  )}
                </div>
                <div className="w-4 sm:w-8 h-px bg-border" />
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentView === 'create-catalog' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium hidden sm:inline">3. Catalog</span>
                  <span className="font-medium sm:hidden">Catalog</span>
                </div>
                <div className="w-4 sm:w-8 h-px bg-border" />
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentView === 'management' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-medium hidden sm:inline">4. Management</span>
                  <span className="font-medium sm:hidden">Manage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant={currentView === 'upload' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('upload')}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Upload Images</span>
              <span className="sm:hidden">Upload</span>
            </Button>
            <Button
              variant={currentView === 'products' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('products')}
              disabled={products.length === 0}
              className="w-full sm:w-auto"
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Products Library ({products.length})</span>
              <span className="sm:hidden">Products ({products.length})</span>
            </Button>
            <Button
              variant={currentView === 'management' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('management')}
              disabled={catalogs.length === 0}
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Catalog Management ({catalogs.length})</span>
              <span className="sm:hidden">Manage ({catalogs.length})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
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
