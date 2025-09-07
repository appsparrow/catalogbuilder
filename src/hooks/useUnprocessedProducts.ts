import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UnprocessedProduct {
  id: string;
  image_url: string;
  original_image_url?: string;
  name?: string;
  code?: string;
  category?: string;
  supplier?: string;
  created_at: string;
}

export interface UnprocessedProductInput {
  image_url: string;
  original_image_url?: string;
  name?: string;
  code?: string;
  category?: string;
  supplier?: string;
}

export const useUnprocessedProducts = () => {
  const [unprocessedProducts, setUnprocessedProducts] = useState<UnprocessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUnprocessedProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('unprocessed_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUnprocessedProducts(data || []);
    } catch (error) {
      console.error('Error fetching unprocessed products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch unprocessed products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUnprocessedProduct = async (product: UnprocessedProductInput) => {
    try {
      const { data, error } = await supabase
        .from('unprocessed_products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      
      setUnprocessedProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding unprocessed product:', error);
      toast({
        title: "Error",
        description: "Failed to save unprocessed product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUnprocessedProduct = async (id: string, updates: Partial<UnprocessedProductInput>) => {
    try {
      const { data, error } = await supabase
        .from('unprocessed_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setUnprocessedProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...data } : product
      ));
      
      return data;
    } catch (error) {
      console.error('Error updating unprocessed product:', error);
      toast({
        title: "Error",
        description: "Failed to update unprocessed product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeUnprocessedProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('unprocessed_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setUnprocessedProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error removing unprocessed product:', error);
      toast({
        title: "Error",
        description: "Failed to remove unprocessed product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadUnprocessedImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filename = `unprocessed_${Date.now()}.${fileExt}`;

      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'unprocessed');
      form.append('filename', filename);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const { url } = await response.json();
      return url as string;
    } catch (error) {
      console.error('Error uploading unprocessed image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchUnprocessedProducts();
  }, []);

  return {
    unprocessedProducts,
    loading,
    addUnprocessedProduct,
    updateUnprocessedProduct,
    removeUnprocessedProduct,
    uploadUnprocessedImage,
    refetch: fetchUnprocessedProducts
  };
};
