
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Share2, User, Mail, Search, Filter, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CatalogWithProducts } from "@/types/catalog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Load customer data from localStorage on mount
  useEffect(() => {
    const savedCustomerName = localStorage.getItem('customerName');
    const savedCustomerEmail = localStorage.getItem('customerEmail');
    if (savedCustomerName) {
      setCustomerName(savedCustomerName);
    }
    if (savedCustomerEmail) {
      setCustomerEmail(savedCustomerEmail);
    }

    // Load existing likes for this customer and catalog if they exist
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

  // Use mock data if no catalog provided (for demo)
  const displayCatalog = catalog || {
    id: "demo-catalog",
    name: "Spring Collection 2024",
    brand_name: "ILLUS DECOR",
    logo_url: "/logo-IllusDecor.png",
    shareable_link: "demo",
    created_at: new Date().toISOString(),
    products: [
      {
        id: "1",
        name: "Wireless Headphones",
        code: "WH-001",
        category: "Electronics",
        supplier: "Supplier A",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        name: "Smart Watch",
        code: "SW-002",
        category: "Electronics",
        supplier: "Supplier B",
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        created_at: new Date().toISOString()
      }
    ]
  };

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(displayCatalog.products.map(p => p.category))];
    return ["all", ...uniqueCategories];
  }, [displayCatalog.products]);

  // Filter products by search term and category
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
      
      // Save to localStorage if customer name and catalog exist
      if (customerName && catalog) {
        const storageKey = `likes_${catalog.id}_${customerName}`;
        localStorage.setItem(storageKey, JSON.stringify(newLikes));
      }
      
      return newLikes;
    });
  };

  const shareResponse = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before sharing your preferences",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const trimmedName = customerName.trim();
      const trimmedEmail = customerEmail.trim() || undefined;
      
      // Save customer info to localStorage
      localStorage.setItem('customerName', trimmedName);
      if (trimmedEmail) {
        localStorage.setItem('customerEmail', trimmedEmail);
      }

      const response = {
        customerName: trimmedName,
        customerEmail: trimmedEmail,
        likedProducts,
      };

      if (onResponseSubmit) {
        await onResponseSubmit(response);
      }

      console.log("Customer Response JSON:", JSON.stringify(response, null, 2));
      
      toast({
        title: "Response Shared",
        description: "Your preferences have been shared with the catalog owner",
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header with Logo, Catalog Info, and User Actions */}
      <Card className="bg-white/95 backdrop-blur-md border-border mb-8 sm:mb-12">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Logo and Catalog Info */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <img 
                src="/logo-IllusDecor.png" 
                alt="ILLUS DECOR Logo" 
                className="h-12 sm:h-16 mx-auto lg:mx-0 mb-4 object-contain" 
              />
              <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-2">{displayCatalog.name}</h1>
              <p className="text-base sm:text-lg text-primary">by {displayCatalog.brand_name}</p>
            </div>

            {/* User Information Form */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <Label htmlFor="customer-name" className="text-foreground">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customer-email" className="text-foreground">Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Share Preferences Section */}
            <div className="lg:col-span-3 flex flex-col justify-between h-full">
              {likedProducts.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-foreground text-center lg:text-left">
                    You've liked {likedProducts.length} product{likedProducts.length > 1 ? 's' : ''}
                  </p>
                  <Button 
                    onClick={shareResponse} 
                    disabled={isSubmitting || !customerName.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Sharing...' : 'Share Your Preferences'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-muted-foreground text-center lg:text-left">
                    Select products you like by clicking the heart icon
                  </p>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to like products</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Category Filter */}
      <Card className="mb-6 sm:mb-8 bg-white/95 backdrop-blur-md border-border">
        <CardContent className="p-4 sm:p-6">
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
        <Card className="bg-white/95 backdrop-blur-md border-border mb-8 sm:mb-12">
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {displayCatalog.products.length === 0 ? "No products available" : "No products found"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {displayCatalog.products.length === 0 
                ? "This catalog is empty" 
                : "Try adjusting your search terms or category filter"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="bg-white/95 backdrop-blur-md border-border hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleLike(product.id)}
                    className={`absolute top-2 right-2 sm:top-4 sm:right-4 ${
                      likedProducts.includes(product.id)
                        ? 'text-red-500 bg-white/90 hover:bg-white'
                        : 'text-muted-foreground bg-white/90 hover:bg-white'
                    } transition-all duration-200`}
                  >
                    <Heart 
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        likedProducts.includes(product.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </Button>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3">Code: {product.code}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary text-xs sm:text-sm">
                      {product.category}
                    </Badge>
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
