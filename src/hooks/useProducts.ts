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
  archived_at?: string | null;
  delete_at?: string | null;
  archived_reason?: string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async (includeArchived: boolean = false) => {
    try {
      console.log('🔍 fetchProducts called:', { 
        user_id: user?.id, 
        isValidUUID: isValidUUID(user?.id),
        includeArchived 
      });

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Require a valid user id to query. Otherwise return empty.
      if (!isValidUUID(user?.id)) {
        console.log('❌ Invalid user ID, returning empty products');
        setProducts([]);
        return;
      }
      
      query = query.eq('user_id', user.id);
      console.log('🔍 Added user_id filter:', user.id);

      if (!includeArchived) {
        query = query.is('archived_at', null);
        console.log('🔍 Added archived_at IS NULL filter');
      }

      console.log('🔍 Executing query...');
      const { data, error } = await query;

      if (error) throw error;
      
      console.log('🔍 Products query result:', { 
        count: data?.length || 0, 
        user_id: user?.id,
        includeArchived,
        query_filter: includeArchived ? 'all' : 'archived_at IS NULL',
        data: data?.map(p => ({ id: p.id, name: p.name, archived_at: p.archived_at, user_id: p.user_id }))
      });
      
      // Map database response to our interface
      const mappedProducts = (data || []).map(product => ({
        ...product,
        isActive: product.isactive !== undefined ? product.isactive : true,
        archived_at: product.archived_at || null,
        delete_at: product.delete_at || null,
        archived_reason: product.archived_reason || null
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

      if (error) {
        console.error('❌ Error inserting product:', error);
        throw error;
      }
      
      console.log('✅ Product inserted successfully:', { id: data.id, name: data.name, user_id: data.user_id });
      
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
    console.log('🔍 useProducts useEffect triggered, calling fetchProducts');
    fetchProducts();
  }, [user]); // Add user dependency to refetch when user changes

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