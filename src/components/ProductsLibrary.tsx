
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
  Filter, 
  Grid3X3, 
  List, 
  Edit, 
  Eye, 
  EyeOff,
  MoreVertical,
  Trash2,
  Upload
} from "lucide-react";
import { Product } from "@/types/catalog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsLibraryProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string, selected: boolean) => void;
  onCreateCatalog: () => void;
  onProductToggleStatus?: (productId: string, isActive: boolean) => void;
}

type ViewMode = 'grid' | 'list';

export const ProductsLibrary = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onCreateCatalog,
  onProductToggleStatus
}: ProductsLibraryProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products by status
  const processedProducts = products.filter(product => 
    product.isActive !== false && 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inactiveProducts = products.filter(product => 
    product.isActive === false &&
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

  const renderProductCard = (product: Product) => {
    const isSelected = selectedProducts.includes(product.id);
    const isActive = product.isActive !== false; // Default to active if not specified

    return (
      <Card 
        key={product.id} 
        className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        } ${!isActive ? 'opacity-60' : ''}`}
        onClick={() => onProductSelect(product.id, !isSelected)}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => 
                  onProductSelect(product.id, checked as boolean)
                }
                className="bg-background border-2 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <Badge variant="default" className="bg-primary text-xs sm:text-sm">
                  Selected
                </Badge>
              </div>
            )}
            {!isActive && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Inactive
                </Badge>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleToggleStatus(product.id, isActive)}>
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
          
          <div className="p-3 sm:p-4 space-y-2">
            <h3 className="font-semibold truncate text-sm sm:text-base">{product.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{product.code}</p>
            <div className="flex gap-1 sm:gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              <Badge variant="outline" className="text-xs">{product.supplier}</Badge>
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
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        } ${!isActive ? 'opacity-60' : ''}`}
        onClick={() => onProductSelect(product.id, !isSelected)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
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
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                <Badge variant="outline" className="text-xs">{product.supplier}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => 
                  onProductSelect(product.id, checked as boolean)
                }
                className="bg-background border-2 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              />
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
                  <DropdownMenuItem onClick={() => handleToggleStatus(product.id, isActive)}>
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products Library</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {processedProducts.length} processed products available • {selectedProducts.length} selected for catalog
          </p>
        </div>
        {selectedProducts.length > 0 && (
          <Button onClick={onCreateCatalog} className="flex items-center gap-2 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Create Catalog ({selectedProducts.length})</span>
            <span className="sm:hidden">Create Catalog ({selectedProducts.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

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

        {/* Filters and View Options */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Filter by Category:</Label>
            <div className="flex flex-wrap gap-2">
              {/* Categories are not managed in this component, so this list is static */}
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                All Categories
              </Button>
            </div>
          </div>
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
          </div>
        </div>
      </div>

      {/* Unprocessed Images Note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>Unprocessed Images:</strong> Go to "Upload Images" to add details to your uploaded images before they can be used in catalogs.
            </p>
          </div>
        </CardContent>
      </Card>

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
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
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
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
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
    </div>
  );
};
