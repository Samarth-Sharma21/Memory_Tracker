import { supabase } from '../pages/server';

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

// Get family members for a patient
export const getFamilyMembers = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('id, name, relationship')
      .eq('patient_id', patientId);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching family members:', error);
    return { success: false, error: error.message };
  }
};

// Get family member details
export const getFamilyMemberDetails = async (familyMemberId) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*, patients:patient_id(*)')
      .eq('id', familyMemberId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching family member details:', error);
    return { success: false, error: error.message };
  }
};

// Create family member
export const createFamilyMember = async (familyMemberData) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .insert([familyMemberData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating family member:', error);
    return { success: false, error: error.message };
  }
}; 