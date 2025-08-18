import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface UseProductsOptions {
  category?: string;
  search?: string;
  priceRange?: [number, number];
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.search, options.priceRange, options.limit]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options.priceRange) {
        query = query
          .gte('price', options.priceRange[0])
          .lte('price', options.priceRange[1]);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPersonalizedRecommendations = async (userId: string, limit = 10) => {
    try {
      setLoading(true);
      const { data, error: rpcError } = await supabase
        .rpc('get_personalized_recommendations', {
          user_id: userId,
          limit_count: limit
        });

      if (rpcError) throw rpcError;

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchQuery: string, filters: any = {}) => {
    try {
      setLoading(true);
      const { data, error: rpcError } = await supabase
        .rpc('search_products', {
          search_query: searchQuery,
          category_filter: filters.category,
          price_min: filters.priceMin,
          price_max: filters.priceMax,
          limit_count: filters.limit || 20
        });

      if (rpcError) throw rpcError;

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getPersonalizedRecommendations,
    searchProducts
  };
}