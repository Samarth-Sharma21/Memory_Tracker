import { supabase } from '../pages/server';

// Save location to database
export const saveLocationToDB = async (locationData) => {
  try {
    console.log('Starting saveLocationToDB with data:', locationData);
    console.log('Supabase client configuration:', {
      url: supabase.url,
      key: supabase.key ? 'Key exists' : 'No key'
    });
    
    // Verify Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('patient_location')
      .select('count')
      .limit(1);
    
    console.log('Supabase connection test:', { testData, testError });

    if (testError) {
      console.error('Supabase connection error:', testError);
      throw new Error('Failed to connect to database');
    }

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

    console.log('Supabase insert response:', { data, error });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    if (!data) {
      console.error('No data returned from insert operation');
      throw new Error('No data returned from insert operation');
    }

    console.log('Successfully saved location to database:', data);
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error in saveLocationToDB:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get all locations for a patient
export const getPatientLocations = async (patientId) => {
  try {
    console.log('Starting getPatientLocations for patient:', patientId);
    
    const { data, error } = await supabase
      .from('patient_location')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    console.log('Supabase query response:', { data, error });

    if (error) {
      console.error('Supabase error in getPatientLocations:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Retrieved locations from database:', data);
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error in getPatientLocations:', error);
    return {
      success: false,
      error: error.message
    };
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

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting location:', error.message);
    return {
      success: false,
      error: error.message
    };
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

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error updating location:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};
