import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateImageFile } from "@/utils/imageUtils";
import { useAuth } from "./useAuth";

// Helper function to validate UUID
const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid || uuid === '') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
  const { user } = useAuth();

  const fetchUnprocessedProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('unprocessed_products')
        .select('*')
        .order('created_at', { ascending: false });

      // Only filter by user_id if user is authenticated and has valid UUID
      if (isValidUUID(user?.id)) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setUnprocessedProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching unprocessed products:', error);
      
      // Don't show error toast for missing columns (migration not run yet)
      if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
        console.warn('Unprocessed products table missing user_id column - migration may not be run yet');
        setUnprocessedProducts([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch unprocessed products",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addUnprocessedProduct = async (product: UnprocessedProductInput) => {
    try {
      const insertData: any = { ...product };
      
      // Only add user_id if user is authenticated and has valid UUID
      if (isValidUUID(user?.id)) {
        insertData.user_id = user.id;
      }

      const { data, error } = await supabase
        .from('unprocessed_products')
        .insert([insertData])
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
      // Validate file before upload
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const fileExt = file.name.split('.').pop();
      const filename = `unprocessed_${Date.now()}.${fileExt}`;

      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'unprocessed');
      form.append('filename', filename);

      // Resolve upload endpoint for local dev vs production
      const envEndpoint = (import.meta as any).env?.VITE_UPLOAD_ENDPOINT;
      const apiBase = (import.meta as any).env?.VITE_API_BASE_URL;
      const isLocal = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
      const uploadEndpoint = envEndpoint
        || (isLocal && apiBase ? `${apiBase.replace(/\/$/, '')}/api/upload-image` : '/api/upload-image');
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        let message = 'Upload failed';
        try {
          const errJson = await response.json();
          message = errJson?.error || message;
        } catch {
          try {
            const errText = await response.text();
            message = `${message} (${response.status}): ${errText}`;
          } catch {}
        }
        console.error('Upload endpoint error', { uploadEndpoint, status: response.status, statusText: response.statusText });
        throw new Error(message);
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

  const moveToProducts = async (unprocessedUrl: string, productCode: string) => {
    try {
      // Translate public URL to R2 object key robustly
      let key = '';
      try {
        const u = new URL(unprocessedUrl);
        key = u.pathname.replace(/^\//, '');
      } catch {
        // Fallback: strip protocol and domain if any
        key = unprocessedUrl.replace(/^https?:\/\/[^/]+\//, '');
      }
      
      // Additional validation - ensure we have a valid key
      if (!key || key.length < 3) {
        throw new Error(`Invalid R2 key extracted: ${key}`);
      }
      
      const fileExt = unprocessedUrl.split('.').pop() || 'jpg';
      const toKey = `products/${productCode}_${Date.now()}.${fileExt}`;

      console.log('Moving image:', { fromKey: key, toKey, originalUrl: unprocessedUrl });

      const moveEndpoint = (import.meta as any).env?.VITE_MOVE_ENDPOINT || '/api/move-image';
      const res = await fetch(moveEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromKey: key, toKey }),
      });
      
      if (!res.ok) {
        let message = 'Move failed';
        try {
          const errJson = await res.json();
          message = errJson?.error || message;
        } catch {
          try {
            const errText = await res.text();
            message = `${message} (${res.status}): ${errText}`;
          } catch {}
        }
        console.error('Move failed:', { status: res.status, statusText: res.statusText, message });
        throw new Error(message);
      }
      
      const { url } = await res.json();
      console.log('Move successful:', { url, toKey });
      return url as string;
    } catch (error) {
      console.error('Error moving image to products:', error);
      toast({
        title: "Error",
        description: "Failed to move image",
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
    moveToProducts,
    refetch: fetchUnprocessedProducts
  };
};
