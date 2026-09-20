import { supabase } from './supabase';

export async function ensureUserSession() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.warn('Session lookup failed:', sessionError.message);
  }

  if (session?.user) {
    return session.user;
  }

  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn('Anonymous sign-in unavailable:', error.message);
      return null;
    }
    return data?.user ?? null;
  } catch (error) {
    console.warn('Anonymous sign-in failed:', error.message || error);
    return null;
  }
}

export async function getUserFeedback(userId) {
  let query = supabase.from('feedback_responses').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getUserFeatures(userId) {
  let query = supabase.from('feature_requests').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getUserFeatureVotes(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('feature_upvotes')
    .select('feature_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map(item => item.feature_id);
}

export async function insertFeedback(payload) {
  const { data, error } = await supabase
    .from('feedback_responses')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFeedback(id, updates, userId) {
  const { data, error } = await supabase
    .from('feedback_responses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFeedback(id, userId) {
  const { error } = await supabase
    .from('feedback_responses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteAllFeedback(userId) {
  const { error } = await supabase
    .from('feedback_responses')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

export async function insertFeature(payload) {
  const { data, error } = await supabase
    .from('feature_requests')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFeature(id, updates, userId) {
  const { data, error } = await supabase
    .from('feature_requests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFeature(id, userId) {
  const { error } = await supabase
    .from('feature_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteAllFeatures(userId) {
  const { error } = await supabase
    .from('feature_requests')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

export async function toggleFeatureUpvote(featureId, userId) {
  const { data: feature, error: featureError } = await supabase
    .from('feature_requests')
    .select('upvotes')
    .eq('id', featureId)
    .single();

  if (featureError) throw featureError;

  if (userId) {
    const { data: currentVote, error: voteCheckError } = await supabase
      .from('feature_upvotes')
      .select('id')
      .eq('feature_id', featureId)
      .eq('user_id', userId)
      .maybeSingle();

    if (voteCheckError) throw voteCheckError;

    if (currentVote) {
      const { error: removeVoteError } = await supabase
        .from('feature_upvotes')
        .delete()
        .eq('id', currentVote.id);

      if (removeVoteError) throw removeVoteError;

      const nextVotes = Math.max(0, Number(feature.upvotes || 0) - 1);
      const { data: updatedFeature, error: updateError } = await supabase
        .from('feature_requests')
        .update({ upvotes: nextVotes })
        .eq('id', featureId)
        .select()
        .single();

      if (updateError) throw updateError;
      return { ...updatedFeature, user_upvoted: false };
    }

    const { error: insertVoteError } = await supabase
      .from('feature_upvotes')
      .insert([{ feature_id: featureId, user_id: userId }]);

    if (insertVoteError) throw insertVoteError;
  }

  const nextVotes = Number(feature.upvotes || 0) + 1;
  const { data: updatedFeature, error: updateError } = await supabase
    .from('feature_requests')
    .update({ upvotes: nextVotes })
    .eq('id', featureId)
    .select()
    .single();

  if (updateError) throw updateError;
  return { ...updatedFeature, user_upvoted: true };
}

