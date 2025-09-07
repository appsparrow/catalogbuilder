import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Search, Filter, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CatalogWithProducts } from "@/types/catalog";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { getThumbnailUrl } from "@/utils/imageUtils";

interface CustomerCatalogProps {
  catalog?: CatalogWithProducts;
  onResponseSubmit?: (responseData: {
    customerName: string;
    customerEmail?: string;
    likedProducts: string[];
  }) => Promise<void>;
}

export const CustomerCatalog = ({ catalog, onResponseSubmit }: CustomerCatalogProps) => {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);
  const { toast } = useToast();
  const { saveResponse } = useCustomerResponses();

  // Use mock data if no catalog provided (for demo)
  const displayCatalog = catalog || {
    id: "demo-catalog",
    name: "Spring 2024",
    brand_name: "ILLUS DECOR",
    logo_url: "/logo-IllusDecor.png",
    shareable_link: "demo",
    created_at: new Date().toISOString(),
    products: []
  };

  // Load customer data from localStorage on mount
  useEffect(() => {
    const savedCustomerName = localStorage.getItem('customerName');
    const savedCustomerEmail = localStorage.getItem('customerEmail');
    if (savedCustomerName) setCustomerName(savedCustomerName);
    if (savedCustomerEmail) setCustomerEmail(savedCustomerEmail);

    // Load existing likes
    if (savedCustomerName && catalog) {
      const storageKey = `likes_${catalog.id}_${savedCustomerName}`;
      const savedLikes = localStorage.getItem(storageKey);
      if (savedLikes) {
        try {
          setLikedProducts(JSON.parse(savedLikes));
        } catch (error) {
          console.error('Error parsing saved likes:', error);
        }
      }
    }
  }, [catalog]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(displayCatalog.products.map(p => p.category))];
    return ["all", ...uniqueCategories];
  }, [displayCatalog.products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return displayCatalog.products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [displayCatalog.products, searchTerm, selectedCategory]);

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newLikes = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      if (customerName && catalog) {
        const storageKey = `likes_${catalog.id}_${customerName}`;
        localStorage.setItem(storageKey, JSON.stringify(newLikes));
      }
      
      return newLikes;
    });
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before sharing your preferences",
        variant: "destructive"
      });
      return;
    }

    if (!catalog) {
      toast({
        title: "Error",
        description: "Invalid catalog",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const trimmedName = customerName.trim();
      const trimmedEmail = customerEmail.trim() || undefined;
      
      localStorage.setItem('customerName', trimmedName);
      if (trimmedEmail) localStorage.setItem('customerEmail', trimmedEmail);

      await saveResponse({
        catalog_id: catalog.id,
        customer_name: trimmedName,
        customer_email: trimmedEmail,
        liked_products: likedProducts
      });

      if (onResponseSubmit) {
        await onResponseSubmit({
          customerName: trimmedName,
          customerEmail: trimmedEmail,
          likedProducts,
        });
      }
      
      toast({
        title: "Success",
        description: "Your preferences have been shared",
      });
    } catch (error) {
      console.error("Error sharing response:", error);
      toast({
        title: "Error",
        description: "Failed to share your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo and Title */}
            <div>
              <img 
                src={displayCatalog.logo_url || "/logo-IllusDecor.png"}
                alt={displayCatalog.brand_name}
                className="h-12 object-contain mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900">{displayCatalog.name}</h1>
              <p className="text-orange-600">by {displayCatalog.brand_name}</p>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Click card to like products
                </div>
                {likedProducts.length > 0 && (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !customerName.trim()}
                    className="bg-orange-600 hover:bg-orange-500 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>Share {likedProducts.length} Selection{likedProducts.length > 1 ? 's' : ''}</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, code, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Label className="mb-2 inline-flex items-center gap-2">
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
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="overflow-hidden bg-white cursor-pointer group"
              onClick={() => toggleLike(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={getThumbnailUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent like toggle
                      setSelectedImage({url: product.image_url, name: product.name});
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 ${
                      likedProducts.includes(product.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-gray-600'
                    } transition-transform group-hover:scale-110`}
                  >
                    <Heart 
                      className={`h-6 w-6 ${likedProducts.includes(product.id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">Code: {product.code}</p>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] mx-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 h-10 w-10 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg">
                <p className="text-sm font-medium">{selectedImage.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Share Button */}
        {likedProducts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !customerName.trim()}
              className="bg-orange-600 hover:bg-orange-500 text-white shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>Share {likedProducts.length} Selection{likedProducts.length > 1 ? 's' : ''}</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};