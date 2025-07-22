
import { CustomerResponse, Product } from "@/types/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerResponsesProps {
  responses: CustomerResponse[];
  products: Product[];
}

export const CustomerResponses = ({ responses, products }: CustomerResponsesProps) => {
  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <div className="space-y-6">
      {responses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No customer responses yet</p>
          <p className="text-white/40 text-sm mt-2">Customer interactions will appear here</p>
        </div>
      ) : (
        responses.map((response, index) => (
          <Card key={index} className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{response.customer_name}</span>
                <Badge variant="outline" className="border-white/30 text-white">
                  {response.liked_products.length} likes
                </Badge>
              </CardTitle>
              <p className="text-white/60 text-sm">
                {new Date(response.created_at).toLocaleDateString()} at {new Date(response.created_at).toLocaleTimeString()}
              </p>
            </CardHeader>
            <CardContent>
              <h4 className="text-white mb-3">Liked Products:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {response.liked_products.map(productId => {
                  const product = getProductById(productId);
                  return product ? (
                    <Card key={productId} className="bg-white/10 border-white/20">
                      <CardContent className="p-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h5 className="text-white text-sm font-medium">{product.name}</h5>
                        <p className="text-white/60 text-xs">{product.code}</p>
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
