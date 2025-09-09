import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts';
import { useAuth } from './useAuth';

// Helper function to validate UUID
const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid || uuid === '') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export interface Catalog {
  id: string;
  name: string;
  brand_name: string;
  logo_url?: string;
  shareable_link: string;
  created_at: string;
  archived_at?: string | null;
  delete_at?: string | null;
  archived_reason?: string | null;
}

export interface CatalogWithProducts extends Catalog {
  products: Product[];
}

export const useCatalogs = () => {
  const [catalogs, setCatalogs] = useState<CatalogWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCatalogs = async (includeArchived: boolean = false) => {
    try {
      console.log('🔍 fetchCatalogs called:', { 
        user_id: user?.id, 
        isValidUUID: isValidUUID(user?.id),
        includeArchived 
      });

      let query = supabase
        .from('catalogs')
        .select(`
          *,
          catalog_products (
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      // Require valid user id; otherwise show none
      if (!isValidUUID(user?.id)) {
        console.log('❌ Invalid user ID for catalogs, returning empty');
        setCatalogs([]);
        return;
      }
      
      query = query.eq('user_id', user.id);
      console.log('🔍 Added user_id filter for catalogs:', user.id);

      if (!includeArchived) {
        query = query.is('archived_at', null);
        console.log('🔍 Added archived_at IS NULL filter for catalogs');
      }

      console.log('🔍 Executing catalogs query...');
      const { data: catalogsData, error } = await query;

      if (error) {
        console.error('❌ Catalogs query error:', error);
        throw error;
      }

      console.log('🔍 Catalogs query result:', { 
        count: catalogsData?.length || 0, 
        catalogs: catalogsData?.map(c => ({ id: c.id, name: c.name, archived_at: c.archived_at, user_id: c.user_id }))
      });

      const catalogsWithProducts = catalogsData?.map(catalog => ({
        ...catalog,
        products: catalog.catalog_products?.map((cp: any) => cp.products) || []
      })) || [];

      console.log('🔍 Processed catalogs with products:', catalogsWithProducts.length);
      setCatalogs(catalogsWithProducts);
    } catch (error: any) {
      console.error('Error fetching catalogs:', error);
      
      // Don't show error toast for missing columns (migration not run yet)
      if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
        console.warn('Catalogs table missing user_id column - migration may not be run yet');
        setCatalogs([]);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch catalogs",
          variant: "destructive",
        });
      }
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
      const catalogInsertData: any = {
        name: catalogData.name,
        brand_name: catalogData.brand_name,
        logo_url: catalogData.logo_url,
        shareable_link: shareableLink,
      };

      // Only add user_id if user is authenticated and has valid UUID
      if (isValidUUID(user?.id)) {
        catalogInsertData.user_id = user.id;
      }

      const { data: catalog, error: catalogError } = await supabase
        .from('catalogs')
        .insert([catalogInsertData])
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
    console.log('🔍 useCatalogs useEffect triggered, calling fetchCatalogs');
    fetchCatalogs();
  }, [user]); // Add user dependency to refetch when user changes

  return {
    catalogs,
    loading,
    createCatalog,
    getCatalogByLink,
    refetch: fetchCatalogs,
  };
};