
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo - in real app this would come from props or API
const mockCatalog = {
  id: "demo-catalog",
  name: "Spring Collection 2024",
  brandName: "Your Brand Here",
  logoUrl: "",
  customerName: "Demo Customer",
  products: [
    {
      id: "1",
      name: "Wireless Headphones",
      code: "WH-001",
      category: "Electronics",
      supplier: "Supplier A",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      createdAt: new Date()
    },
    {
      id: "2",
      name: "Smart Watch",
      code: "SW-002",
      category: "Electronics",
      supplier: "Supplier B",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      createdAt: new Date()
    },
    {
      id: "3",
      name: "Designer Jacket",
      code: "DJ-003",
      category: "Fashion",
      supplier: "Supplier A",
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      createdAt: new Date()
    },
    {
      id: "4",
      name: "Running Shoes",
      code: "RS-004",
      category: "Sports & Outdoors",
      supplier: "Supplier B",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      createdAt: new Date()
    }
  ]
};

export const CustomerCatalog = () => {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const shareResponse = () => {
    const response = {
      catalogId: mockCatalog.id,
      customerName: mockCatalog.customerName,
      likedProducts,
      timestamp: new Date()
    };

    console.log("Customer Response JSON:", JSON.stringify(response, null, 2));
    
    toast({
      title: "Response Shared",
      description: "Your preferences have been shared with the catalog owner",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {mockCatalog.logoUrl && (
            <img src={mockCatalog.logoUrl} alt="Brand Logo" className="h-16 mx-auto mb-4" />
          )}
          <h1 className="text-4xl font-bold text-white mb-2">{mockCatalog.name}</h1>
          <p className="text-xl text-white/80 mb-4">by {mockCatalog.brandName}</p>
          <p className="text-white/60">Curated specially for {mockCatalog.customerName}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {mockCatalog.products.map(product => (
          <Card 
            key={product.id} 
            className="bg-white/10 backdrop-blur-md border-white/20 hover:scale-105 transition-all duration-300 overflow-hidden group"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleLike(product.id)}
                  className={`absolute top-4 right-4 ${
                    likedProducts.includes(product.id)
                      ? 'text-red-500 bg-white/90 hover:bg-white'
                      : 'text-white bg-black/50 hover:bg-black/70'
                  } transition-all duration-200`}
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      likedProducts.includes(product.id) ? 'fill-current' : ''
                    }`} 
                  />
                </Button>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-white/70 mb-3">Code: {product.code}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {product.supplier}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Share Response */}
      {likedProducts.length > 0 && (
        <div className="text-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 inline-block">
            <CardContent className="p-6">
              <p className="text-white mb-4">
                You've liked {likedProducts.length} product{likedProducts.length > 1 ? 's' : ''}
              </p>
              <Button onClick={shareResponse} className="bg-white text-purple-600 hover:bg-white/90">
                <Share2 className="mr-2 h-4 w-4" />
                Share Your Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
