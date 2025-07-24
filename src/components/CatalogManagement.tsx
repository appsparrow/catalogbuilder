
import { useState } from "react";
import { CatalogWithProducts, CustomerResponse } from "@/types/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { supabase } from "@/integrations/supabase/client";
import { 
  Share, 
  Eye, 
  ExternalLink, 
  Trash2, 
  Heart, 
  Calendar,
  User,
  Mail,
  Package
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CatalogManagementProps {
  catalogs: CatalogWithProducts[];
  onCatalogDeleted: () => void;
}

export const CatalogManagement = ({ catalogs, onCatalogDeleted }: CatalogManagementProps) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [catalogResponses, setCatalogResponses] = useState<CustomerResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const { toast } = useToast();
  const { getResponsesByCatalog } = useCustomerResponses();

  const copyShareLink = (link: string) => {
    const fullLink = `${window.location.origin}/catalog/${link}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link Copied",
      description: "Shareable catalog link has been copied to clipboard",
    });
  };

  const openCatalog = (link: string) => {
    const fullLink = `${window.location.origin}/catalog/${link}`;
    window.open(fullLink, '_blank');
  };

  const deleteCatalog = async (catalogId: string) => {
    try {
      // Delete catalog products first
      await supabase
        .from('catalog_products')
        .delete()
        .eq('catalog_id', catalogId);

      // Delete customer responses
      await supabase
        .from('customer_responses')
        .delete()
        .eq('catalog_id', catalogId);

      // Delete catalog
      const { error } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', catalogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Catalog deleted successfully",
      });

      onCatalogDeleted();
    } catch (error) {
      console.error('Error deleting catalog:', error);
      toast({
        title: "Error",
        description: "Failed to delete catalog",
        variant: "destructive",
      });
    }
  };

  const loadCatalogResponses = async (catalogId: string) => {
    setLoadingResponses(true);
    setSelectedCatalogId(catalogId);
    try {
      const responses = await getResponsesByCatalog(catalogId);
      setCatalogResponses(responses);
    } catch (error) {
      console.error('Error loading responses:', error);
      toast({
        title: "Error",
        description: "Failed to load customer responses",
        variant: "destructive",
      });
    } finally {
      setLoadingResponses(false);
    }
  };

  const getProductById = (catalogId: string, productId: string) => {
    const catalog = catalogs.find(c => c.id === catalogId);
    return catalog?.products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Catalog Management</h3>
        <Badge variant="secondary" className="text-sm">
          {catalogs.length} Total Catalogs
        </Badge>
      </div>

      {catalogs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No catalogs created yet. Create your first catalog in the Catalog Builder!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Catalogs Overview Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Shared Catalogs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catalog Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogs.map(catalog => (
                    <TableRow key={catalog.id}>
                      <TableCell className="font-medium">{catalog.name}</TableCell>
                      <TableCell>{catalog.brand_name}</TableCell>
                      <TableCell>{catalog.products.length}</TableCell>
                      <TableCell>
                        {new Date(catalog.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyShareLink(catalog.shareable_link)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openCatalog(catalog.shareable_link)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadCatalogResponses(catalog.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Catalog</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{catalog.name}"? This will also delete all customer responses. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCatalog(catalog.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Responses for Selected Catalog */}
          {selectedCatalogId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Customer Responses 
                  {catalogResponses.length > 0 && (
                    <Badge variant="secondary">{catalogResponses.length} responses</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingResponses ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading responses...</p>
                  </div>
                ) : catalogResponses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No customer responses yet for this catalog</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {catalogResponses.map((response, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{response.customer_name}</span>
                              </div>
                              {response.customer_email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  <span>{response.customer_email}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(response.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              Liked Products ({response.liked_products.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {response.liked_products.map(productId => {
                                const product = getProductById(selectedCatalogId, productId);
                                return product ? (
                                  <Card key={productId} className="bg-muted/50">
                                    <CardContent className="p-3">
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-20 object-cover rounded mb-2"
                                      />
                                      <h5 className="font-medium text-sm">{product.name}</h5>
                                      <p className="text-xs text-muted-foreground">{product.code}</p>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <div key={productId} className="text-sm text-muted-foreground">
                                    Product not found
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
