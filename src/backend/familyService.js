import { supabase } from '../pages/server';

// Get family members for a patient using patient_mobile
export const getFamilyMembers = async (patientMobile) => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select(`
        id,
        name,
        relationship,
        email,
        mobile,
        created_at,
        updated_at,
        last_active,
        is_active,
        patient_mobile
      `)
      .eq('patient_mobile', patientMobile)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching family members:', error);
    return { success: false, error: error.message };
  }
};

// Add a new family member
export const addFamilyMember = async (familyMemberData) => {
  try {
    // Validate mobile numbers
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(familyMemberData.mobile) || !mobileRegex.test(familyMemberData.patient_mobile)) {
      throw new Error('Invalid mobile number format. Must be 10 digits.');
    }

    const { data, error } = await supabase
      .from('family_members')
      .insert([{
        ...familyMemberData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error adding family member:', error);
    return { success: false, error: error.message };
  }
};

// Update a family member
export const updateFamilyMember = async (id, updates) => {
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
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating family member:', error);
    return { success: false, error: error.message };
  }
};

// Delete a family member (soft delete by setting is_active to false)
export const deleteFamilyMember = async (id) => {
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
    console.error('Error deleting family member:', error);
    return { success: false, error: error.message };
  }
}; 