
import { useState, useRef, useEffect } from "react";
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
  Package,
  Users,
  Globe
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
  const responsesRef = useRef<HTMLDivElement>(null);

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
      
      // Auto-scroll to responses section after a short delay
      setTimeout(() => {
        if (responsesRef.current) {
          responsesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
      
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
      <div className="flex items-center justify-between mt-4">
        <h3 className="text-2xl font-bold text-foreground">Catalog Management</h3>
        <Badge variant="secondary" className="text-sm">
          {catalogs.length} Catalogs
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
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>All Shared Catalogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Catalog Name</TableHead>
                      <TableHead className="min-w-[120px]">Brand</TableHead>
                      <TableHead className="min-w-[80px]">Products</TableHead>
                      <TableHead className="min-w-[100px]">Created</TableHead>
                      <TableHead className="min-w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catalogs.map(catalog => (
                      <TableRow 
                        key={catalog.id} 
                        className={`transition-colors ${
                          selectedCatalogId === catalog.id 
                            ? 'bg-primary/10 border-l-4 border-l-primary' 
                            : ''
                        }`}
                      >
                        <TableCell className="font-medium">{catalog.name}</TableCell>
                        <TableCell>{catalog.brand_name}</TableCell>
                        <TableCell>{catalog.products.length}</TableCell>
                        <TableCell>
                          {new Date(catalog.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyShareLink(catalog.shareable_link)}
                              className="text-xs"
                            >
                              <Share className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCatalog(catalog.shareable_link)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadCatalogResponses(catalog.id)}
                              className={`text-xs ${
                                selectedCatalogId === catalog.id 
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                  : ''
                              }`}
                            >
                              <Users className="h-3 w-3 mr-1" />
                              Responses
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
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
              </div>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <h4 className="text-lg font-semibold">All Shared Catalogs</h4>
            {catalogs.map(catalog => (
              <Card 
                key={catalog.id} 
                className={`p-4 transition-all ${
                  selectedCatalogId === catalog.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{catalog.name}</h3>
                      <p className="text-sm text-muted-foreground">{catalog.brand_name}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {catalog.products.length} products
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(catalog.created_at).toLocaleDateString()}
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex flex-col items-center gap-1 h-auto py-2 px-1"
                      onClick={() => copyShareLink(catalog.shareable_link)}
                    >
                      <Share className="h-4 w-4" />
                      <span className="text-xs">Share</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex flex-col items-center gap-1 h-auto py-2 px-1"
                      onClick={() => openCatalog(catalog.shareable_link)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">View</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                        selectedCatalogId === catalog.id 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : ''
                      }`}
                      onClick={() => loadCatalogResponses(catalog.id)}
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Responses</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs">Delete</span>
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
                </div>
              </Card>
            ))}
          </div>

          {/* Customer Responses for Selected Catalog */}
          {selectedCatalogId && (
            <Card ref={responsesRef}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Customer Responses for "{catalogs.find(c => c.id === selectedCatalogId)?.name}"
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
