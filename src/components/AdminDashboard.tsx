
import { ImageUploader } from "./ImageUploader";
import { ProductGrid } from "./ProductGrid";
import { CatalogBuilder } from "./CatalogBuilder";
import { CustomerResponses } from "./CustomerResponses";
import { CatalogManagement } from "./CatalogManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Grid3x3, Palette, MessageSquare, Settings } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";

export const AdminDashboard = () => {
  const { products, addProduct, uploadImage } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { responses } = useCustomerResponses();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">CUZATA Dashboard</h2>
        <p className="text-muted-foreground">Manage your product catalogs and track customer responses</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="products">
            <Grid3x3 className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Palette className="mr-2 h-4 w-4" />
            Catalog Builder
          </TabsTrigger>
          <TabsTrigger value="management">
            <Settings className="mr-2 h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="responses">
            <MessageSquare className="mr-2 h-4 w-4" />
            All Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader onProductAdd={addProduct} uploadImage={uploadImage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Library</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductGrid products={products} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogBuilder 
                products={products} 
                onCatalogCreate={createCatalog}
                catalogs={catalogs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CatalogManagement 
                catalogs={catalogs} 
                onCatalogDeleted={refetchCatalogs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>All Customer Responses</CardTitle>
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
