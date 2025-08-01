import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database response to our interface
      const mappedProducts = (data || []).map(product => ({
        ...product,
        isActive: product.isactive !== undefined ? product.isactive : true
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      // Convert isActive to isactive for database
      const dbProduct = {
        ...product,
        isactive: product.isActive
      };
      
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${productCode}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
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