
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { ProductGrid } from "./ProductGrid";
import { CatalogBuilder } from "./CatalogBuilder";
import { CustomerResponses } from "./CustomerResponses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Grid3x3, Palette, MessageSquare } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  imageUrl: string;
  createdAt: Date;
}

export interface CustomCatalog {
  id: string;
  name: string;
  brandName: string;
  logoUrl: string;
  products: Product[];
  customerName: string;
  shareableLink: string;
  createdAt: Date;
}

export interface CustomerResponse {
  catalogId: string;
  customerName: string;
  likedProducts: string[];
  timestamp: Date;
}

export const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogs, setCatalogs] = useState<CustomCatalog[]>([]);
  const [responses, setResponses] = useState<CustomerResponse[]>([]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const addCatalog = (catalog: CustomCatalog) => {
    setCatalogs(prev => [...prev, catalog]);
  };

  const addResponse = (response: CustomerResponse) => {
    setResponses(prev => [...prev, response]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-white/80">Manage your product catalogs and track customer responses</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="upload" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="products" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            <Grid3x3 className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="builder" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            <Palette className="mr-2 h-4 w-4" />
            Catalog Builder
          </TabsTrigger>
          <TabsTrigger value="responses" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            <MessageSquare className="mr-2 h-4 w-4" />
            Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Upload Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader onProductAdd={addProduct} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Product Library</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductGrid products={products} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Catalog Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogBuilder 
                products={products} 
                onCatalogCreate={addCatalog}
                catalogs={catalogs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Customer Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerResponses responses={responses} products={products} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
