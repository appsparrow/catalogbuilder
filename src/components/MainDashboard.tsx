
import { useState } from "react";
import { BulkImageUpload } from "./BulkImageUpload";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { ProductsLibrary } from "./ProductsLibrary";
import { CatalogCreator } from "./CatalogCreator";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useToast } from "@/hooks/use-toast";

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

type ViewState = 'upload' | 'products' | 'create-catalog';

export const MainDashboard = () => {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { products, addProduct, uploadImage } = useProducts();
  const { createCatalog } = useCatalogs();
  const { toast } = useToast();

  const handleImageEdit = (image: UploadedImage) => {
    setEditingImage(image);
  };

  const handleSaveImageDetails = (imageId: string, details: any) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, details } : img
      )
    );
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
      
      // Clear uploaded images and go to products view
      setUploadedImages([]);
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="mb-8">
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setCurrentView('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'upload' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upload Images
          </button>
          <button
            onClick={() => setCurrentView('products')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'products' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Products Library ({products.length})
          </button>
        </div>
      </div>

      {/* Content */}
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
