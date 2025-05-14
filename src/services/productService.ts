
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/components/ProductCard';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Fetch products with their primary images
    const { data: productsData, error: productsError } = await supabase
      .from('Products')
      .select(`
        product_id,
        name,
        description,
        price,
        category_id,
        sku,
        Categories(name),
        ProductImages(image_id, url, is_primary)
      `)
      .eq('is_active', true);

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return [];
    }

    // Transform the data into the Product format expected by components
    const transformedProducts: Product[] = productsData.map(item => {
      // Find the primary image or use the first one available
      const primaryImage = item.ProductImages?.find((img: any) => img.is_primary) || 
                          (item.ProductImages?.length ? item.ProductImages[0] : null);
      
      return {
        id: item.product_id,
        name: item.name || 'Unknown Product',
        price: item.price || 0,
        imageUrl: primaryImage?.url || 'https://placehold.co/400?text=No+Image',
        category: item.Categories?.name?.toLowerCase() || 'uncategorized',
        description: item.description || 'No description available',
        barcode: item.sku || undefined
      };
    });

    return transformedProducts;
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
    return [];
  }
}

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('Categories')
      .select('category_id, name, slug, description')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.map(category => ({
      id: category.slug || category.category_id,
      name: category.name
    }));
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
}

export const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  try {
    // First get the category ID from the slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('Categories')
      .select('category_id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !categoryData) {
      console.error("Error finding category by slug:", categoryError);
      return [];
    }

    // Then fetch products for this category
    const { data: productsData, error: productsError } = await supabase
      .from('Products')
      .select(`
        product_id,
        name,
        description,
        price,
        sku,
        ProductImages(image_id, url, is_primary)
      `)
      .eq('category_id', categoryData.category_id)
      .eq('is_active', true);

    if (productsError) {
      console.error("Error fetching products by category:", productsError);
      return [];
    }

    // Transform the data
    return productsData.map(item => {
      const primaryImage = item.ProductImages?.find((img: any) => img.is_primary) || 
                         (item.ProductImages?.length ? item.ProductImages[0] : null);
      
      return {
        id: item.product_id,
        name: item.name || 'Unknown Product',
        price: item.price || 0,
        imageUrl: primaryImage?.url || 'https://placehold.co/400?text=No+Image',
        category: categorySlug,
        description: item.description || 'No description available',
        barcode: item.sku || undefined
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching products by category:", error);
    return [];
  }
}
