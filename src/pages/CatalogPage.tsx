
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCatalogs } from '@/hooks/useCatalogs';
import { useCustomerResponses } from '@/hooks/useCustomerResponses';
import { CatalogWithProducts } from '@/types/catalog';
import { CustomerCatalog } from '@/components/CustomerCatalog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const CatalogPage = () => {
  const { shareableLink } = useParams<{ shareableLink: string }>();
  const { getCatalogByLink } = useCatalogs();
  const { saveResponse } = useCustomerResponses();
  const [catalog, setCatalog] = useState<CatalogWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!shareableLink) {
        setError('Invalid catalog link');
        setLoading(false);
        return;
      }

      try {
        const catalogData = await getCatalogByLink(shareableLink);
        setCatalog(catalogData);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        setError('Catalog not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [shareableLink, getCatalogByLink]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-foreground">Loading catalog...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Catalog Not Found</h1>
            <p className="text-muted-foreground">The catalog you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mixed">
      <CustomerCatalog 
        catalog={catalog} 
        onResponseSubmit={async (responseData) => {
          await saveResponse({
            catalog_id: catalog.id,
            customer_name: responseData.customerName,
            customer_email: responseData.customerEmail,
            liked_products: responseData.likedProducts,
            response_data: responseData
          });
        }}
      />
    </div>
  );
};

export default CatalogPage;
