
import { ImageUploader } from "./ImageUploader";
import { ProductGrid } from "./ProductGrid";
import { CatalogBuilder } from "./CatalogBuilder";
import { CustomerResponses } from "./CustomerResponses";
import { CatalogManagement } from "./CatalogManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Grid3x3, Palette, MessageSquare, Settings, BarChart3 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { useEffect, useState } from "react";

export const AdminDashboard = () => {
  const { products, addProduct, uploadImage } = useProducts();
  const { catalogs, createCatalog, refetch: refetchCatalogs } = useCatalogs();
  const { responses } = useCustomerResponses();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = (import.meta as any).env?.VITE_ADMIN_API_TOKEN || '';
        const res = await fetch('/api/admin-analytics', {
          headers: token ? { 'x-admin-token': token } : undefined,
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (e) {
        console.error('Failed to load analytics', e);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">ILLUS DECOR Dashboard</h2>
        <p className="text-muted-foreground">Manage your product catalogs and track customer responses</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
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

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {!analytics ? (
                <div className="text-sm text-muted-foreground">Loading analytics…</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Totals</div>
                    <div className="text-sm text-muted-foreground">Products: {analytics.totals?.totalProducts}</div>
                    <div className="text-sm text-muted-foreground">Catalogs: {analytics.totals?.totalCatalogs}</div>
                    <div className="text-sm text-muted-foreground">Subscriptions: {analytics.totals?.totalSubscriptions}</div>
                    <div className="text-sm text-muted-foreground">Active Subscriptions: {analytics.totals?.activeSubscriptions}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Plans</div>
                    {Object.entries(analytics.breakdown || {}).map(([plan, counts]: any) => (
                      <div key={plan} className="text-sm text-muted-foreground">
                        {plan}: active {counts.active}, canceled {counts.canceled}, past_due {counts.past_due}, unpaid {counts.unpaid}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Top users by products</div>
                    {(analytics.topProducts || []).map((r: any) => (
                      <div key={r.user_id} className="text-sm text-muted-foreground">{r.user_id}: {r.count}</div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Top users by catalogs</div>
                    {(analytics.topCatalogs || []).map((r: any) => (
                      <div key={r.user_id} className="text-sm text-muted-foreground">{r.user_id}: {r.count}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UsersTable = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = (import.meta as any).env?.VITE_ADMIN_API_TOKEN || '';
        const res = await fetch('/api/admin-users', {
          headers: token ? { 'x-admin-token': token } : undefined,
        });
        const data = await res.json();
        setRows(data.users || []);
      } catch (e) {
        console.error('Failed to load users', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading users…</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Plan</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Images</th>
            <th className="py-2 pr-4">Catalogs</th>
            <th className="py-2 pr-4">Renews</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.user_id} className="border-b last:border-b-0">
              <td className="py-2 pr-4">{r.email}</td>
              <td className="py-2 pr-4">{r.plan_id}</td>
              <td className="py-2 pr-4">{r.status}</td>
              <td className="py-2 pr-4">{r.images}</td>
              <td className="py-2 pr-4">{r.catalogs}</td>
              <td className="py-2 pr-4">{r.current_period_end ? new Date(r.current_period_end).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
