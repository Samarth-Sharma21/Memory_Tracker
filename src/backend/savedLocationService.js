import { supabase } from '../pages/server';

// Save a new location
export const saveLocation = async (locationData) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .insert([{
        patient_id: locationData.patient_id,
        name: locationData.name,
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
        is_home: locationData.is_home || false
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving location:', error);
    return { success: false, error: error.message };
  }
};

// Get all saved locations for a patient
export const getSavedLocations = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    return { success: false, error: error.message };
  }
};

// Update a saved location
export const updateSavedLocation = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating location:', error);
    return { success: false, error: error.message };
  }
};

// Delete a saved location
export const deleteSavedLocation = async (id) => {
  try {
    const { error } = await supabase
      .from('patient_location')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting location:', error);
    return { success: false, error: error.message };
  }
}; 