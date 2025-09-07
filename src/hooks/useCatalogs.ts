import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts';
import { useAuth } from './useAuth';

export interface Catalog {
  id: string;
  name: string;
  brand_name: string;
  logo_url?: string;
  shareable_link: string;
  created_at: string;
}

export interface CatalogWithProducts extends Catalog {
  products: Product[];
}

export const useCatalogs = () => {
  const [catalogs, setCatalogs] = useState<CatalogWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCatalogs = async () => {
    try {
      const { data: catalogsData, error } = await supabase
        .from('catalogs')
        .select(`
          *,
          catalog_products (
            products (*)
          )
        `)
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const catalogsWithProducts = catalogsData?.map(catalog => ({
        ...catalog,
        products: catalog.catalog_products?.map((cp: any) => cp.products) || []
      })) || [];

      setCatalogs(catalogsWithProducts);
    } catch (error) {
      console.error('Error fetching catalogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch catalogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCatalog = async (catalogData: {
    name: string;
    brand_name: string;
    logo_url?: string;
    customer_name: string;
    product_ids: string[];
  }) => {
    try {
      // Generate unique shareable link
      const shareableLink = `catalog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create catalog
      const { data: catalog, error: catalogError } = await supabase
        .from('catalogs')
        .insert([{
          name: catalogData.name,
          brand_name: catalogData.brand_name,
          logo_url: catalogData.logo_url,
          shareable_link: shareableLink,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (catalogError) throw catalogError;

      // Add products to catalog
      if (catalogData.product_ids.length > 0) {
        const catalogProducts = catalogData.product_ids.map(productId => ({
          catalog_id: catalog.id,
          product_id: productId,
        }));

        const { error: productsError } = await supabase
          .from('catalog_products')
          .insert(catalogProducts);

        if (productsError) throw productsError;
      }

      toast({
        title: "Success",
        description: "Catalog created successfully",
      });

      await fetchCatalogs();
      return { ...catalog, shareableLink };
    } catch (error) {
      console.error('Error creating catalog:', error);
      toast({
        title: "Error",
        description: "Failed to create catalog",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getCatalogByLink = async (shareableLink: string) => {
    try {
      const { data, error } = await supabase
        .from('catalogs')
        .select(`
          *,
          catalog_products (
            products (*)
          )
        `)
        .eq('shareable_link', shareableLink)
        .single();

      if (error) throw error;

      return {
        ...data,
        products: data.catalog_products?.map((cp: any) => cp.products) || []
      };
    } catch (error) {
      console.error('Error fetching catalog by link:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return {
    catalogs,
    loading,
    createCatalog,
    getCatalogByLink,
    refetch: fetchCatalogs,
  };
};