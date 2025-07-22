export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  image_url: string;
  original_image_url?: string;
  created_at: string;
}

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

export interface CustomerResponse {
  id: string;
  catalog_id: string;
  customer_name: string;
  customer_email?: string;
  liked_products: string[];
  response_data?: any;
  created_at: string;
}

// Legacy interfaces for compatibility
export interface CustomCatalog {
  id: string;
  name: string;
  brandName: string;
  logoUrl: string;
  products: Product[];
  customerName: string;
  shareableLink: string;
  createdAt: Date;
}