import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile } from '@/utils/imageUtils';
import { useAuth } from './useAuth';

// Helper function to validate UUID
const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid || uuid === '') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  image_url: string;
  original_image_url?: string;
  created_at: string;
  isActive: boolean;
  isactive?: boolean; // Database column name
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Only filter by user_id if user is authenticated and has valid UUID
      if (isValidUUID(user?.id)) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map database response to our interface
      const mappedProducts = (data || []).map(product => ({
        ...product,
        isActive: product.isactive !== undefined ? product.isactive : true
      }));
      
      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // Don't show error toast for missing columns (migration not run yet)
      if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
        console.warn('Products table missing user_id column - migration may not be run yet');
        setProducts([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      // Convert isActive to isactive for database
      const { isActive, ...rest } = product as any;
      const dbProduct: any = {
        ...rest,
        isactive: isActive ?? true
      };

      // Only add user_id if user is authenticated and has valid UUID
      if (isValidUUID(user?.id)) {
        dbProduct.user_id = user.id;
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) throw error;
      
      // Map the response to our interface
      const mappedData = {
        ...data,
        isActive: data.isactive !== undefined ? data.isactive : true
      };
      
      setProducts(prev => [mappedData, ...prev]);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      return mappedData;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadImage = async (file: File, productCode: string) => {
    try {
      // Validate file before upload
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const fileExt = file.name.split('.').pop();
      const filename = `${productCode}_${Date.now()}.${fileExt}`;

      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'products');
      form.append('filename', filename);

      const uploadEndpoint = (import.meta as any).env?.VITE_UPLOAD_ENDPOINT || '/api/upload-image';
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
        throw new Error(message);
      }

      const { url } = await response.json();
      return url as string;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      // Convert isActive to isactive for database (confirmed column name)
      const dbUpdates = { ...updates };
      
      if ('isActive' in dbUpdates) {
        dbUpdates.isactive = dbUpdates.isActive;
        delete dbUpdates.isActive;
      }
      
      // First, perform the update
      const { error: updateError } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', productId);

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
        throw updateError;
      }
      
      // Then, fetch the updated data
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('❌ Supabase error details:', error);
        throw error;
      }
      
      // Map the response to our interface
      const mappedData = {
        ...data,
        isActive: data.isactive !== undefined ? data.isactive : true
      };
      
      // Update state with the actual database response
      setProducts(prev => {
        const updated = prev.map(product => 
          product.id === productId ? mappedData : product
        );
        return updated;
      });
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      return mappedData;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ isactive: isActive })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error in updateProductStatus:', error);
        throw error;
      }
      
      // Map the response to our interface
      const mappedData = {
        ...data,
        isActive: data.isactive !== undefined ? data.isactive : true
      };
      
      setProducts(prev => {
        const updated = prev.map(product => 
          product.id === productId ? { ...product, isActive } : product
        );
        return updated;
      });
      
      toast({
        title: "Success",
        description: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
      
      return mappedData;
    } catch (error) {
      console.error('❌ Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    uploadImage,
    updateProduct,
    updateProductStatus,
    refetch: fetchProducts,
  };
};