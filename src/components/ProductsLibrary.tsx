
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Package, FileText, ArrowRight, Filter } from "lucide-react";
import { Product } from "@/types/catalog";

interface ProductsLibraryProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string, selected: boolean) => void;
  onCreateCatalog: () => void;
}

export const ProductsLibrary = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onCreateCatalog 
}: ProductsLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return ["all", ...uniqueCategories];
  }, [products]);

  // Filter products by search term and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Products Library</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {products.length} products available • {selectedProducts.length} selected for catalog
          </p>
        </div>
        <Button 
          onClick={onCreateCatalog}
          disabled={selectedProducts.length === 0}
          size="lg"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Create Catalog ({selectedProducts.length})</span>
          <span className="sm:hidden">Create Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, code, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs sm:text-sm"
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <Card 
                key={product.id} 
                className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
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
          })}
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
