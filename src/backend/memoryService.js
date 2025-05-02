import { supabase } from '../pages/server';

// Get memories for a user
export const getMemories = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching memories:', error);
    return { success: false, error: error.message };
  }
};

// Get recent locations for a user
export const getRecentLocations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('location')
      .eq('user_id', userId)
      .not('location', 'is', null)
      .not('location', 'eq', '')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Get unique locations
    const uniqueLocations = [...new Set(data.map((memory) => memory.location))];
    return { success: true, data: uniqueLocations };
  } catch (error) {
    console.error('Error fetching recent locations:', error);
    return { success: false, error: error.message };
  }
};

// Create a new memory
export const createMemory = async (memoryData) => {
  try {
    const { error } = await supabase.from('memories').insert([memoryData]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating memory:', error);
    return { success: false, error: error.message };
  }
};

// Upload memory file (photo/audio)
export const uploadMemoryFile = async (file, fileType) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(filePath, file, {
        contentType: fileType === 'audio' ? 'audio/mpeg' : undefined,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath);

    return { success: true, data: publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
}; 