export interface StoreProduct {
  id: string;
  source: "local";
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  regularPrice?: string;
  onSale: boolean;
  image: string;
  gallery: string[];
  category: string;
  material?: string;
  dimensions?: string;
  capacity?: string;
  features: string[];
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  stockQuantity: number | null;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}
