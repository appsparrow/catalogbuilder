
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
import { Upload, Package, FileText, Settings } from "lucide-react";
import React from "react";
import { Product } from "@/types/catalog";

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
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  
  const { products, addProduct, uploadImage, updateProduct, updateProductStatus } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { toast } = useToast();

  // Sync products from hook to local state
  React.useEffect(() => {
    setLocalProducts(products);
  }, [products]);

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
            original_image_url: imageUrl,
            isActive: true
          });
        }
      }
      
      // Navigate to products view
      setCurrentView('products');
      
      // Sync with header menu
      if (onViewChange) {
        onViewChange('products');
      }
      
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
    console.log('🎯 Creating catalog with selected products:', selectedProducts);
    console.log('🎯 getSelectedProductsData():', getSelectedProductsData());
    
    // Navigate to catalog creation - this should not trigger header sync
    setCurrentView('create-catalog');
  };

  const handleCatalogCreate = async (catalogData: any) => {
    try {
      const result = await createCatalog(catalogData);
      
      // After successful catalog creation, go to management view
      setCurrentView('management');
      
      // Sync with header menu
      if (onViewChange) {
        onViewChange('catalogs');
      }
      
      return result;
    } catch (error) {
      console.error('Error creating catalog:', error);
      throw error;
    }
  };

  const handleProductToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      
      // Update the product status in the database
      const result = await updateProductStatus(productId, isActive);
      
      // Don't update local state here - it's already updated in the hook
      // setLocalProducts(prev => prev.map(product => 
      //   product.id === productId 
      //     ? { ...product, isActive }
      //     : product
      // ));
      
    } catch (error) {
      console.error('❌ MainDashboard handleProductToggleStatus ERROR:', error);
      // Error handling is done in the updateProductStatus function
    }
  };

  const getSelectedProductsData = () => {
    return localProducts.filter(p => selectedProducts.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant={currentView === 'upload' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setCurrentView('upload');
                if (onViewChange) {
                  onViewChange('main');
                }
              }}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Upload Images</span>
              <span className="sm:hidden">Upload</span>
            </Button>
            <Button
              variant={currentView === 'products' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setCurrentView('products');
                if (onViewChange) {
                  onViewChange('products');
                }
              }}
              className="w-full sm:w-auto"
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Products Library ({localProducts.length})</span>
              <span className="sm:hidden">Products ({localProducts.length})</span>
            </Button>
            <Button
              variant={currentView === 'management' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setCurrentView('management');
                if (onViewChange) {
                  onViewChange('catalogs');
                }
              }}
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
            products={localProducts}
            selectedProducts={selectedProducts}
            onProductSelect={handleProductSelect}
            onCreateCatalog={handleCreateCatalog}
            onProductToggleStatus={handleProductToggleStatus}
          />
        )}

        {currentView === 'create-catalog' && (
          <CatalogCreator
            selectedProducts={getSelectedProductsData()}
            onBack={() => {
              setCurrentView('products');
              // Sync with header menu
              if (onViewChange) {
                onViewChange('products');
              }
            }}
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
