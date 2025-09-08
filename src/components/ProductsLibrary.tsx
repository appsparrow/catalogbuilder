
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Package, 
  FileText, 
  ArrowRight, 
  Grid3X3, 
  List, 
  Edit, 
  Eye, 
  EyeOff,
  MoreVertical,
  Upload,
  X,
  Check
} from "lucide-react";
import { Product } from "@/types/catalog";
import { EditProductModal } from "./EditProductModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductsLibraryProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string, selected: boolean) => void;
  onCreateCatalog: () => void;
  onProductToggleStatus?: (productId: string, isActive: boolean) => void;
  onEditProduct?: (productId: string, updates: Partial<Product>) => Promise<Product>;
}

type ViewMode = 'grid' | 'list';

export const ProductsLibrary = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onCreateCatalog,
  onProductToggleStatus,
  onEditProduct
}: ProductsLibraryProps) => {
  // Debug logging
  console.log('🔍 ProductsLibrary received products:', {
    count: products.length,
    products: products.map(p => ({ id: p.id, name: p.name, archived_at: p.archived_at }))
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);

  // Filter products by status
  const processedProducts = products.filter(product => 
    product.isActive !== false && 
    (!product.archived_at || showArchived) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inactiveProducts = products.filter(product => 
    product.isActive === false &&
    (!product.archived_at || showArchived) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    if (onProductToggleStatus) {
      try {
        await onProductToggleStatus(productId, !currentStatus);
      } catch (error) {
        console.error('❌ ProductsLibrary handleToggleStatus ERROR:', error);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async (productId: string, updates: Partial<Product>) => {
    if (onEditProduct) {
      try {
        await onEditProduct(productId, updates);
        setEditingProduct(null);
      } catch (error) {
        console.error('❌ ProductsLibrary handleSaveEdit ERROR:', error);
        throw error;
      }
    }
  };

  const renderProductCard = (product: Product) => {
    const isSelected = selectedProducts.includes(product.id);
    const isActive = product.isActive !== false;

    return (
      <Card 
        key={product.id} 
        className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
          isSelected ? 'ring-2 ring-orange-500 shadow-lg' : ''
        } ${!isActive ? 'opacity-60' : ''}`}
        onClick={() => { if (isActive) onProductSelect(product.id, !isSelected); }}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({url: product.image_url, name: product.name});
              }}
            />
            {isSelected && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <Badge variant="default" className="bg-orange-500 text-white text-xs sm:text-sm">
                  Selected
                </Badge>
              </div>
            )}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleEditProduct(product);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(product.id, isActive);
                  }}>
                    {isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Make Inactive
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Active
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 space-y-2">
            <h3 className="font-semibold truncate text-sm sm:text-base">{product.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{product.code}</p>
            <div className="space-y-2">
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{product.supplier}</Badge>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <div 
                className={`w-full h-10 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${
                  isSelected 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'bg-white border-gray-300 hover:border-orange-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) onProductSelect(product.id, !isSelected);
                }}
              >
                {isSelected ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">Click to Select</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProductListItem = (product: Product) => {
    const isSelected = selectedProducts.includes(product.id);
    const isActive = product.isActive !== false;

    return (
      <Card 
        key={product.id} 
        className={`hover:shadow-lg transition-all cursor-pointer ${
          isSelected ? 'ring-2 ring-orange-500 shadow-lg' : ''
        } ${!isActive ? 'opacity-60' : ''}`}
        onClick={() => { if (isActive) onProductSelect(product.id, !isSelected); }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({url: product.image_url, name: product.name});
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm sm:text-base truncate">{product.name}</h3>
                {!isActive && (
                  <Badge variant="secondary" className="text-xs">Inactive</Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{product.code}</p>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs truncate max-w-40">{product.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs truncate max-w-20">{product.supplier}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-24 h-8 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${
                  isSelected 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'bg-white border-gray-300 hover:border-orange-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) onProductSelect(product.id, !isSelected);
                }}
              >
                {isSelected ? (
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">Select</span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleEditProduct(product);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(product.id, isActive);
                  }}>
                    {isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Make Inactive
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Active
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8 mt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products Library</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {processedProducts.length} processed products available • {selectedProducts.length} selected for catalog
          </p>
        </div>
      </div>

      {/* Sticky Create Catalog Button */}
      {selectedProducts.length > 0 && (
        <div className="sticky top-4 z-10 mb-6 mt-4">
          <div className="flex justify-end">
            <Button onClick={onCreateCatalog} className="flex items-center gap-2 shadow-lg">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Create Catalog ({selectedProducts.length})</span>
              <span className="sm:hidden">Create Catalog ({selectedProducts.length})</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Options */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant={showInactive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
              className="text-xs sm:text-sm"
            >
              Show Inactive
            </Button>
            <Button
              variant={showArchived ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="text-xs sm:text-sm"
            >
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {processedProducts.length === 0 && inactiveProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {products.length === 0 ? "No products yet" : "No products found"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {products.length === 0 
                ? "Upload some images first to get started" 
                : "Try adjusting your search terms or category filter"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Processed Products Section */}
      {processedProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Processed Products (Ready for Catalog)</h2>
            <Badge variant="default" className="bg-green-600">{processedProducts.length}</Badge>
          </div>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
              : "space-y-3"
          }>
            {processedProducts.map(product => 
              viewMode === 'grid' ? renderProductCard(product) : renderProductListItem(product)
            )}
          </div>
        </div>
      )}

      {/* Inactive Products Section */}
      {showInactive && inactiveProducts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Inactive Products</h2>
            <Badge variant="secondary">{inactiveProducts.length}</Badge>
          </div>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
              : "space-y-3"
          }>
            {inactiveProducts.map(product => 
              viewMode === 'grid' ? renderProductCard(product) : renderProductListItem(product)
            )}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedProducts.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <Badge variant="default">{selectedProducts.length}</Badge>
                <span className="text-xs sm:text-sm font-medium">
                  {selectedProducts.length === 1 ? 'product' : 'products'} selected for catalog
                </span>
              </div>
              <Button onClick={onCreateCatalog} className="flex items-center gap-2 w-full sm:w-auto">
                <FileText className="h-4 w-4" />
                Create Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveEdit}
      />

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 bg-white/20 hover:bg-white/30 text-white z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={() => setSelectedImage(null)}
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
