
import { useState } from "react";
import { BulkImageUpload } from "./BulkImageUpload";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ProductsLibrary } from "./ProductsLibrary";
import { CatalogCreator } from "./CatalogCreator";
import { CatalogManagement } from "./CatalogManagement";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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

  // Sync with header menu
  React.useEffect(() => {
    if (activeView === 'products') {
      setCurrentView('products');
    } else if (activeView === 'catalogs') {
      setCurrentView('management');
    } else if (activeView === 'main') {
      setCurrentView('upload');
    }
  }, [activeView]);

  // Sync back to header menu
  React.useEffect(() => {
    if (onViewChange) {
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
    setEditingImage(null);
  };

  const handleImagesProcessed = async (images: UploadedImage[]) => {
    try {
      for (const image of images) {
        if (image.details) {
          const imageUrl = await uploadImage(image.file, image.details.code);
          
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
      
      setCurrentView('products');
      
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
    setCurrentView('create-catalog');
  };

  const handleCatalogCreate = async (catalogData: any) => {
    try {
      const result = await createCatalog(catalogData);
      
      setCurrentView('management');
      
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
      await updateProductStatus(productId, isActive);
    } catch (error) {
      console.error('❌ MainDashboard handleProductToggleStatus ERROR:', error);
    }
  };

  const getSelectedProductsData = () => {
    return localProducts.filter(p => selectedProducts.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Process Steps Header - Only show when in upload flow */}
      {currentView === 'upload' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">Product Catalog Builder</h1>
            <p className="text-muted-foreground text-center mb-6">Upload products and create custom catalogs</p>
            
            {/* Process Steps - Mobile Responsive */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-mixed text-white shadow-lg">
                  1
                </div>
                <span className="text-sm font-medium bg-gradient-mixed bg-clip-text text-transparent">Upload</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                  2
                </div>
                <span className="text-sm font-medium text-muted-foreground">Products</span>
                <Badge variant="secondary" className="ml-1">{localProducts.length}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                  3
                </div>
                <span className="text-sm font-medium text-muted-foreground">Catalog</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                  4
                </div>
                <span className="text-sm font-medium text-muted-foreground">Management</span>
                <Badge variant="secondary" className="ml-1">{catalogs.length}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

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
            onEditProduct={updateProduct}
          />
        )}

        {currentView === 'create-catalog' && (
          <CatalogCreator
            selectedProducts={getSelectedProductsData()}
            onBack={() => {
              setCurrentView('products');
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
