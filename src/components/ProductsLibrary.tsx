
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Products Library</h2>
          <p className="text-muted-foreground">
            {products.length} products • {selectedProducts.length} selected
          </p>
        </div>
        <Button 
          onClick={onCreateCatalog}
          disabled={selectedProducts.length === 0}
        >
          <Package className="mr-2 h-4 w-4" />
          Create Catalog ({selectedProducts.length})
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {products.length === 0 
                ? "Upload some images to get started" 
                : "Try adjusting your search terms"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => 
                        onProductSelect(product.id, checked as boolean)
                      }
                      className="bg-background border-2"
                    />
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.code}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.supplier}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
