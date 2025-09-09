import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Share2, Trash2, Eye, Users, Search, ArrowLeft, X, Copy, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { CustomerResponses } from "./CustomerResponses";
import { Badge } from "./ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export const CatalogManagementSplit = () => {
  const { catalogs, refetch } = useCatalogs();
  const { getResponsesByCatalog } = useCustomerResponses();
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<string | null>(null);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    product: any;
    catalog: any;
  }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");
  const [loadingResponses, setLoadingResponses] = useState(false);
  const { usage } = useSubscription();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const fetchResponseCounts = async () => {
      const counts: Record<string, number> = {};
      for (const catalog of catalogs) {
        try {
          const responses = await getResponsesByCatalog(catalog.id);
          counts[catalog.id] = responses.length;
        } catch (error) {
          counts[catalog.id] = 0;
        }
      }
      setResponseCounts(counts);
    };
    
    if (catalogs.length > 0) {
      fetchResponseCounts();
    }
  }, [catalogs, getResponsesByCatalog]);

  const handleShare = (shareableLink: string, catalogName: string) => {
    const url = `${window.location.origin}/catalog/${shareableLink}`;
    setShareUrl(url);
    setShareTitle(catalogName);
    setShareDialogOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Catalog link copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = `Check out this catalog: ${shareTitle}`;
    const body = `Hi! I wanted to share this product catalog with you: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this product catalog: ${shareTitle} - ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const shareViaSMS = () => {
    const text = `Check out this product catalog: ${shareTitle} - ${shareUrl}`;
    window.open(`sms:?body=${encodeURIComponent(text)}`);
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  const handleDelete = async (catalogId: string) => {
    setCatalogToDelete(catalogId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!catalogToDelete) return;

    try {
      // Delete catalog products
      const { error: catalogProductsError } = await supabase
        .from('catalog_products')
        .delete()
        .eq('catalog_id', catalogToDelete);

      if (catalogProductsError) {
        console.warn('Error deleting catalog products:', catalogProductsError);
      }

      // Delete customer responses
      const { error: responsesError } = await supabase
        .from('customer_responses')
        .delete()
        .eq('catalog_id', catalogToDelete);

      if (responsesError) {
        console.warn('Error deleting customer responses:', responsesError);
      }

      // Delete the catalog itself
      const { error } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', catalogToDelete);

      if (error) throw error;
      
      await refetch();
      setDeleteDialogOpen(false);
      setCatalogToDelete(null);
      
      // Clear selection if deleted catalog was selected
      if (selectedCatalogId === catalogToDelete) {
        setSelectedCatalogId(null);
      }
    } catch (error) {
      console.error('Error deleting catalog:', error);
      alert('Failed to delete catalog. Please try again or contact support if the issue persists.');
    }
  };

  const handleViewResponses = async (catalogId: string) => {
    setLoadingResponses(true);
    setSelectedCatalogId(catalogId);
    setShowSearchResults(false);
    
    // Add a small delay to prevent flickering
    setTimeout(() => {
      setLoadingResponses(false);
    }, 100);
  };

  const handleProductSearch = async () => {
    console.log('🔍 Search triggered:', { productSearchTerm, catalogsCount: catalogs.length });
    
    if (!productSearchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results: Array<{ product: any; catalog: any }> = [];
      
      for (const catalog of catalogs) {
        for (const product of catalog.products || []) {
          if (
            product.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
            product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
          ) {
            results.push({ product, catalog });
          }
        }
      }
      
      console.log('🔍 Search results:', { resultsCount: results.length, results });
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectedCatalog = catalogs.find(c => c.id === selectedCatalogId);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-center mb-2">All Shared Catalogs</h1>
        <p className="text-muted-foreground text-center mb-6">Manage and share your product catalogs with customers</p>
        
        {/* Product Search */}
        <div className="max-w-md mx-auto mb-4 px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name or code..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
              className="pl-10 pr-10 w-full"
            />
            {productSearchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => {
                  setProductSearchTerm("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleProductSearch} 
            className="w-full mt-2"
            disabled={!productSearchTerm.trim()}
          >
            Search Products
          </Button>
        </div>
      </div>

      {/* Upgrade Banner */}
      {catalogs.length > (usage?.maxCatalogs ?? catalogs.length) && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-foreground">
            Showing first {usage?.maxCatalogs} of {catalogs.length} catalogs. Upgrade to view all.
          </div>
          <Button onClick={() => window.location.assign('/billing')} className="w-full sm:w-auto">
            Upgrade to Starter
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Panel - Catalogs List */}
        <div className={`${isMobile ? 'w-full' : 'lg:w-1/4'} ${isMobile && selectedCatalogId ? 'hidden' : 'block'}`}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Catalogs ({catalogs.slice(0, usage?.maxCatalogs ?? catalogs.length).length})</span>
                {isMobile && selectedCatalogId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCatalogId(null)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {(catalogs.slice(0, usage?.maxCatalogs ?? catalogs.length)).map(catalog => (
                  <div
                    key={catalog.id}
                    className={`p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                      selectedCatalogId === catalog.id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    {/* First line: Catalog name */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{catalog.name}</h3>
                    </div>
                    
                    {/* Second line: Action buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(catalog.shareable_link, catalog.name);
                          }}
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/catalog/${catalog.shareable_link}`, '_blank');
                          }}
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(catalog.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant={selectedCatalogId === catalog.id ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewResponses(catalog.id);
                        }}
                        className={`px-3 py-1 h-8 ${
                          selectedCatalogId === catalog.id ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'hover:bg-orange-50'
                        }`}
                      >
                        {responseCounts[catalog.id] || 0} Responses
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Responses or Search Results */}
        <div className={`${isMobile ? 'w-full' : 'lg:w-3/4'} ${isMobile && !selectedCatalogId && !showSearchResults ? 'hidden' : 'block'}`}>
          {showSearchResults ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Search Results ({searchResults.length})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearchResults(false)}
                  >
                    {isMobile ? (
                      <>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Close
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div>
                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No products found matching "{productSearchTerm}"
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map(({ product, catalog }, index) => (
                        <div
                          key={`${product.id}-${catalog.id}`}
                          className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewResponses(catalog.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">Code: {product.code}</p>
                              <p className="text-xs text-gray-400">In catalog: {catalog.name}</p>
                            </div>
                            <Badge variant="outline">{catalog.brand_name}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : selectedCatalog ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Responses for "{selectedCatalog.name}"</span>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCatalogId(null)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div>
                  {loadingResponses ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading responses...</p>
                    </div>
                  ) : (
                    <CustomerResponses 
                      catalogId={selectedCatalog.id} 
                      catalogName={selectedCatalog.name}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a catalog to view responses</p>
                  <p className="text-sm">Choose a catalog from the list to see customer feedback</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <AlertDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share "{shareTitle}"</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you'd like to share this catalog with your customers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {/* URL Display */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Catalog URL:</p>
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={shareViaWhatsApp}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={shareViaSMS}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
              <Button
                variant="outline"
                onClick={openInNewTab}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this catalog and all its responses.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
