import { supabase } from '../pages/server';

// Get emergency contacts for a patient using patient_mobile
export const getEmergencyContacts = async (patientMobile) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select(`
        id,
        name,
        mobile
      `)
      .eq('patient_mobile', patientMobile)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return { success: false, error: error.message };
  }
};

// Add a new emergency contact
export const addEmergencyContact = async (contactData) => {
  try {
    // Validate mobile numbers
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(contactData.mobile) || !mobileRegex.test(contactData.patient_mobile)) {
      throw new Error('Invalid mobile number format. Must be 10 digits.');
    }

    const { data, error } = await supabase
      .from('family_members')
      .insert([{
        name: contactData.name,
        mobile: contactData.mobile,
        patient_mobile: contactData.patient_mobile,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    return { success: false, error: error.message };
  }
};

// Update an emergency contact
export const updateEmergencyContact = async (id, updates) => {
  try {
    // Validate mobile number if it's being updated
    if (updates.mobile) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(updates.mobile)) {
        throw new Error('Invalid mobile number format. Must be 10 digits.');
      }
    }

    const { data, error } = await supabase
      .from('family_members')
      .update({
        name: updates.name,
        mobile: updates.mobile,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    return { success: false, error: error.message };
  }
};

// Delete an emergency contact (soft delete by setting is_active to false)
export const deleteEmergencyContact = async (id) => {
  try {
    const { error } = await supabase
      .from('family_members')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    return { success: false, error: error.message };
  }
}; 