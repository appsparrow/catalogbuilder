
import { useState } from "react";
import { BulkImageUpload } from "./BulkImageUpload";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ProductsLibrary } from "./ProductsLibrary";
import { CatalogCreator } from "./CatalogCreator";
import { CatalogManagement } from "./CatalogManagement";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useUnprocessedProducts } from "@/hooks/useUnprocessedProducts";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Product } from "@/types/catalog";

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  details?: {
    name: string;
    code: string;
    category: string;
    supplier: string;
  };
  unprocessedId?: string;
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
  
  const { products, addProduct, uploadImage, updateProduct, updateProductStatus, refetch } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { updateUnprocessedProduct, moveToProducts } = useUnprocessedProducts();
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

  const handleSaveImageDetails = async (imageId: string, details: any) => {
    try {
      // If editing image has unprocessedId, update it in the database
      if (editingImage?.unprocessedId) {
        await updateUnprocessedProduct(editingImage.unprocessedId, {
          name: details.name,
          code: details.code,
          category: details.category,
          supplier: details.supplier
        });
      }
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving image details:', error);
      toast({
        title: "Error",
        description: "Failed to save image details",
        variant: "destructive"
      });
    }
  };

  const handleImagesProcessed = async (images: UploadedImage[]) => {
    try {
      for (const image of images) {
        if (image.details) {
          // Prefer moving from unprocessed to products (single object) if we have an unprocessed R2 URL
          // Fallback to uploading from file if available
          let imageUrl = image.preview;
          if (image.unprocessedId && image.preview.includes('http')) {
            try {
              imageUrl = await moveToProducts(image.preview, image.details.code);
            } catch (e) {
              if (image.file) {
                imageUrl = await uploadImage(image.file, image.details.code);
              }
            }
          } else if (image.file) {
            imageUrl = await uploadImage(image.file, image.details.code);
          }
          
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
      
      // Refresh products count
      await refetch();
      
      // Stay on the upload view so unprocessed items remain visible
      setCurrentView('upload');
      if (onViewChange) {
        onViewChange('main');
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
    <div className="min-h-screen bg-app-gradient">
      {/* Simple Header for Upload View */}
      {currentView === 'upload' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-8 mt-4">
            <h1 className="text-2xl font-bold text-center mb-2">Upload Products</h1>
            <p className="text-muted-foreground text-center mb-6">Upload product images and add details to build your catalog</p>
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
