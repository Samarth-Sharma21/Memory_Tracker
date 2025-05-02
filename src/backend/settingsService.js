import { supabase } from '../pages/server';

// Get user settings
export const getUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { success: false, error: error.message };
  }
};

// Update user settings
export const updateUserSettings = async (userId, settings) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Update emergency contact
export const updateEmergencyContact = async (userId, contactData) => {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .upsert({
        user_id: userId,
        ...contactData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    return { success: false, error: error.message };
  }
};

// Get emergency contact
export const getEmergencyContact = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching emergency contact:', error);
    return { success: false, error: error.message };
  }
};

// Get patient profile
export const getPatientProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('name, email, mobile')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return { success: false, error: error.message };
  }
};

// Update patient profile
export const updatePatientProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return { success: false, error: error.message };
  }
}; 