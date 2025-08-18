import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Shortlist = Database['public']['Tables']['shortlists']['Row'];
type ShortlistItem = Database['public']['Tables']['shortlist_items']['Row'];
type Comment = Database['public']['Tables']['comments']['Row'];

interface ShortlistWithItems extends Shortlist {
  items: (ShortlistItem & {
    product: Database['public']['Tables']['products']['Row'];
    comments: Comment[];
  })[];
}

export function useShortlists(userId?: string) {
  const [shortlists, setShortlists] = useState<ShortlistWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchShortlists();
    }
  }, [userId]);

  const fetchShortlists = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shortlists')
        .select(`
          *,
          shortlist_items (
            *,
            products (*),
            comments (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setShortlists(data as ShortlistWithItems[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createShortlist = async (name: string, description?: string, isPublic = false) => {
    if (!userId) return null;

    try {
      const { data, error: createError } = await supabase
        .from('shortlists')
        .insert({
          user_id: userId,
          name,
          description,
          is_public: isPublic
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchShortlists(); // Refresh the list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const addItemToShortlist = async (shortlistId: string, productId: string) => {
    if (!userId) return null;

    try {
      const { data, error: addError } = await supabase
        .from('shortlist_items')
        .insert({
          shortlist_id: shortlistId,
          product_id: productId,
          added_by: userId
        })
        .select()
        .single();

      if (addError) throw addError;

      await fetchShortlists(); // Refresh the list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const voteOnItem = async (itemId: string, voteType: 'up' | 'down') => {
    try {
      const { error: voteError } = await supabase
        .from('shortlist_items')
        .update({
          [voteType === 'up' ? 'votes_up' : 'votes_down']: 
            supabase.raw(`${voteType === 'up' ? 'votes_up' : 'votes_down'} + 1`)
        })
        .eq('id', itemId);

      if (voteError) throw voteError;

      await fetchShortlists(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addComment = async (shortlistItemId: string, content: string) => {
    if (!userId) return null;

    try {
      const { data, error: commentError } = await supabase
        .from('comments')
        .insert({
          shortlist_item_id: shortlistItemId,
          user_id: userId,
          content
        })
        .select()
        .single();

      if (commentError) throw commentError;

      await fetchShortlists(); // Refresh the list
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  return {
    shortlists,
    loading,
    error,
    refetch: fetchShortlists,
    createShortlist,
    addItemToShortlist,
    voteOnItem,
    addComment
  };
}