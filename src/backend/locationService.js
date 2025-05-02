import { supabase } from '../pages/server';

// Save location to database
export const saveLocationToDB = async (locationData) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .insert([{
        patient_id: locationData.patient_id,
        name: locationData.name,
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
        is_home: locationData.is_home
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

// Get all locations for a patient
export const getPatientLocations = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching patient locations:', error);
    return { success: false, error: error.message };
  }
};

// Delete a location
export const deleteLocation = async (locationId) => {
  try {
    const { error } = await supabase
      .from('patient_location')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting location:', error);
    return { success: false, error: error.message };
  }
};

// Update a location
export const updateLocation = async (locationId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('patient_location')
      .update(updateData)
      .eq('id', locationId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating location:', error);
    return { success: false, error: error.message };
  }
};
