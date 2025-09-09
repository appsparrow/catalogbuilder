
import { useState, useEffect } from "react";
import { CustomerResponse, Product } from "@/types/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerResponses } from "@/hooks/useCustomerResponses";
import { useCatalogs } from "@/hooks/useCatalogs";

interface CustomerResponsesProps {
  catalogId: string;
  catalogName: string;
}

export const CustomerResponses = ({ catalogId, catalogName }: CustomerResponsesProps) => {
  const { getResponsesByCatalog } = useCustomerResponses();
  const { catalogs } = useCatalogs();
  const [responses, setResponses] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const catalogResponses = await getResponsesByCatalog(catalogId);
        setResponses(catalogResponses);
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [catalogId, getResponsesByCatalog]);

  const getProductById = (id: string) => {
    const catalog = catalogs.find(c => c.id === catalogId);
    return catalog?.products?.find(p => p.id === id);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading responses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {responses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No customer responses yet</p>
          <p className="text-gray-400 text-sm mt-2">Customer interactions will appear here</p>
        </div>
      ) : (
        responses.map((response, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center justify-between">
                <span>{response.customer_name}</span>
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  {response.liked_products?.length || 0} likes
                </Badge>
              </CardTitle>
              <p className="text-gray-600 text-sm">
                {new Date(response.created_at).toLocaleDateString()} at {new Date(response.created_at).toLocaleTimeString()}
              </p>
            </CardHeader>
            <CardContent>
              <h4 className="text-gray-900 mb-3">Liked Products:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {response.liked_products?.map(productId => {
                  const product = getProductById(productId);
                  return product ? (
                    <Card key={productId} className="bg-gray-50 border border-gray-200">
                      <CardContent className="p-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h5 className="text-gray-900 text-sm font-medium">{product.name}</h5>
                        <p className="text-gray-600 text-xs">{product.code}</p>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
