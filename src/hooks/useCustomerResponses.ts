import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerResponse {
  id: string;
  catalog_id: string;
  customer_name: string;
  customer_email?: string;
  liked_products: string[];
  response_data?: any;
  created_at: string;
}

export const useCustomerResponses = () => {
  const [responses, setResponses] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching customer responses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer responses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResponse = async (responseData: {
    catalog_id: string;
    customer_name: string;
    customer_email?: string;
    liked_products: string[];
    response_data?: any;
  }) => {
    try {
      const { data, error } = await supabase
        .from('customer_responses')
        .insert([responseData])
        .select()
        .single();

      if (error) throw error;
      
      setResponses(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Response saved successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save response",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getResponsesByCatalog = async (catalogId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_responses')
        .select('*')
        .eq('catalog_id', catalogId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching responses for catalog:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return {
    responses,
    loading,
    saveResponse,
    getResponsesByCatalog,
    refetch: fetchResponses,
  };
};