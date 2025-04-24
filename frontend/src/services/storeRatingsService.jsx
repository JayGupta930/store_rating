import { supabase } from "./supabaseClient";

export async function addStoreRating(storeId, userId, rating, comment) {
  try {
    if (!storeId) throw new Error('Store ID is required');
    if (!userId) throw new Error('User ID is required');
    if (!rating) throw new Error('Rating is required');
    
    // Ensure storeId is numeric
    const numericStoreId = typeof storeId === 'string' ? parseInt(storeId, 10) : storeId;
    if (isNaN(numericStoreId)) throw new Error('Invalid store ID format');

    const { data, error } = await supabase
      .from('rating')
      .insert([
        {
          store_id: numericStoreId,
          user_id: userId,
          rating: rating,
          comment: comment || '',
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to submit rating');
    }
    
    return { data };
  } catch (error) {
    console.error('Error adding rating:', error);
    return { error: error.message || 'An error occurred while submitting the rating' };
  }
}

export async function getStoreRatings(storeId) {
  try {
    if (!storeId) throw new Error('Store ID is required');

    // Ensure storeId is numeric
    const numericStoreId = typeof storeId === 'string' ? parseInt(storeId, 10) : storeId;
    if (isNaN(numericStoreId)) throw new Error('Invalid store ID format');

    const { data, error } = await supabase
      .from('rating')
      .select(`
        *,
        profiles:user_id (
          name,
          email
        )
      `)
      .eq('store_id', numericStoreId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to fetch ratings');
    }

    return { data };
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return { error: error.message || 'An error occurred while fetching ratings' };
  }
}

export async function updateStoreRating(ratingId, rating, comment) {
  try {
    if (!ratingId) throw new Error('Rating ID is required');
    if (!rating) throw new Error('Rating is required');

    const { data, error } = await supabase
      .from('rating')
      .update({ 
        rating: rating, 
        comment: comment || '',
      })
      .eq('id', ratingId)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to update rating');
    }

    return { data };
  } catch (error) {
    console.error('Error updating rating:', error);
    return { error: error.message || 'An error occurred while updating the rating' };
  }
}

export async function deleteStoreRating(ratingId) {
  try {
    if (!ratingId) throw new Error('Rating ID is required');

    const { error } = await supabase
      .from('rating')
      .delete()
      .eq('id', ratingId);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to delete rating');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting rating:', error);
    return { error: error.message || 'An error occurred while deleting the rating' };
  }
}