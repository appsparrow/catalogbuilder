import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Share2, Trash2, Eye, Users } from "lucide-react";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { CustomerResponses } from "./CustomerResponses";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const CatalogManagement = () => {
  const { catalogs, refetch } = useCatalogs();
  const { getResponsesByCatalog } = useCustomerResponses();
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<string | null>(null);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const responsesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResponseCounts = async () => {
      const counts: Record<string, number> = {};
      for (const catalog of catalogs) {
        try {
          const responses = await getResponsesByCatalog(catalog.id);
          counts[catalog.id] = responses.length;
        } catch (error) {
          console.error(`Error fetching responses for catalog ${catalog.id}:`, error);
          counts[catalog.id] = 0;
        }
      }
      setResponseCounts(counts);
    };
    
    if (catalogs.length > 0) {
      fetchResponseCounts();
    }
  }, [catalogs, getResponsesByCatalog]);

  const handleShare = (shareableLink: string) => {
    const url = `${window.location.origin}/catalog/${shareableLink}`;
    navigator.clipboard.writeText(url);
  };

  const handleDelete = async (catalogId: string) => {
    setCatalogToDelete(catalogId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!catalogToDelete) return;

    try {
      const { error } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', catalogToDelete);

      if (error) throw error;
      
      await refetch();
      setDeleteDialogOpen(false);
      setCatalogToDelete(null);
    } catch (error) {
      console.error('Error deleting catalog:', error);
    }
  };

  const handleViewResponses = (catalogId: string) => {
    setSelectedCatalogId(catalogId);
    setTimeout(() => {
      responsesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Shared Catalogs</h2>
      
      <div className="space-y-4">
        {catalogs.map(catalog => (
          <Card 
            key={catalog.id} 
            className={`overflow-hidden hover:shadow-md transition-shadow ${
              selectedCatalogId === catalog.id ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{catalog.name}</h3>
                      <p className="text-gray-500">{catalog.brand_name}</p>
                      <p className="text-gray-500 text-sm">Created: {formatDate(catalog.created_at)}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                      {catalog.products?.length || 0} products
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 flex flex-col items-center justify-center py-3 h-auto"
                    onClick={() => handleShare(catalog.shareable_link)}
                  >
                    <Share2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">Share</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 flex flex-col items-center justify-center py-3 h-auto"
                    onClick={() => window.open(`/catalog/${catalog.shareable_link}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mb-1" />
                    <span className="text-xs">View</span>
                  </Button>

                  <Button
                    variant={selectedCatalogId === catalog.id ? "default" : "outline"}
                    className={`flex-1 flex flex-col items-center justify-center py-3 h-auto relative ${
                      selectedCatalogId === catalog.id ? 'bg-orange-500 hover:bg-orange-600' : ''
                    }`}
                    onClick={() => handleViewResponses(catalog.id)}
                  >
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs">Responses</span>
                    {responseCounts[catalog.id] > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-5 min-w-[20px] bg-orange-500 text-white"
                      >
                        {responseCounts[catalog.id]}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 flex flex-col items-center justify-center py-3 h-auto text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(catalog.id)}
                  >
                    <Trash2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Responses Section */}
      <div ref={responsesRef} className="mt-8">
        {selectedCatalogId && (
          <CustomerResponses 
            catalogId={selectedCatalogId} 
            catalogName={catalogs.find(c => c.id === selectedCatalogId)?.name || ''}
          />
        )}
      </div>

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