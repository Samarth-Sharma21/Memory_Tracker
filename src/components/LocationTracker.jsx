import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { saveLocationToDB, getPatientLocations, deleteLocation, updateLocation } from '../backend/locationService';
import { useAuth } from '../contexts/AuthContext';

const LocationTracker = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, we would use a geocoding service to get the address
          // For this demo, we'll use a placeholder address
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current location (coordinates available)',
          });
          setLoading(false);
          showNotification('Location successfully detected', 'success');
        } catch (error) {
          setError('Error getting address from coordinates');
          setLoading(false);
        }
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Save current location
  const saveCurrentLocation = async () => {
    if (!currentLocation || !newLocationName.trim()) {
      showNotification('Please provide a name for this location', 'error');
      return;
    }

    if (!user) {
      showNotification('User not authenticated', 'error');
      return;
    }

    try {
      console.log('User object details:', {
        id: user.id,
        type: user.type,
        email: user.email
      });
      
      console.log('Current location details:', {
        address: currentLocation.address,
        lat: currentLocation.lat,
        lng: currentLocation.lng
      });

      const locationData = {
        patient_id: user.id,
        name: newLocationName,
        address: currentLocation.address,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        is_home: false
      };
      console.log('Prepared location data for database:', locationData);

      const result = await saveLocationToDB(locationData);
      console.log('Database save result:', result);
      
      if (result.success && result.data) {
        console.log('Successfully saved location to database:', result.data);
        setSavedLocations(prevLocations => {
          const newLocations = [...prevLocations, result.data];
          console.log('Updated locations state:', newLocations);
          return newLocations;
        });
        setNewLocationName('');
        setShowAddForm(false);
        showNotification('Location saved successfully', 'success');
      } else {
        console.error('Save operation failed:', result.error);
        throw new Error(result.error || 'Failed to save location');
      }
    } catch (error) {
      console.error('Error in saveCurrentLocation:', error);
      showNotification('Failed to save location: ' + error.message, 'error');
    }
  };

  // Set a location as home
  const setAsHome = (id) => {
    setSavedLocations(
      savedLocations.map((location) => ({
        ...location,
        isHome: location.id === id,
      }))
    );
    showNotification('Home location updated', 'success');
  };

  // Delete a saved location
  const handleDeleteLocation = async (id) => {
    try {
      const result = await deleteLocation(id);
      if (result.success) {
        setSavedLocations(savedLocations.filter((location) => location.id !== id));
        showNotification('Location deleted', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      showNotification('Failed to delete location', 'error');
    }
  };

  // Share a location
  const shareLocation = async (location) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Location: ${location.name}`,
          text: `Here's my location: ${location.address}`,
          url: `https://maps.google.com/?q=${location.address}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${location.name}: ${location.address}`);
      showNotification('Location copied to clipboard', 'success');
    }
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const fetchLocations = async () => {
    if (!user) {
      console.log('No user found, cannot fetch locations');
      showNotification('Please log in to view locations', 'error');
      return;
    }
    try {
      console.log('Starting to fetch locations for user:', user.id);
      const result = await getPatientLocations(user.id);
      console.log('Fetch result:', result);
      
      if (result.success) {
        console.log('Setting saved locations:', result.data);
        setSavedLocations(result.data);
      } else {
        console.error('Failed to fetch locations:', result.error);
        showNotification('Failed to fetch locations', 'error');
      }
    } catch (error) {
      console.error('Error in fetchLocations:', error);
      showNotification('Error fetching locations', 'error');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [user]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' component='h2' gutterBottom>
        Location Tracker
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Current Location
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={loading}
            aria-label="Get current location"
            sx={{ mr: 2 }}>
            {loading ? 'Detecting...' : 'Get My Location'}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 1 }} aria-label="Loading location" />}
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
              <Typography variant='body1'>
                <LocationOnIcon
                  color='primary'
                  sx={{ verticalAlign: 'middle', mr: 1 }}
                />
                {currentLocation.address}
              </Typography>

              {!showAddForm ? (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddForm(true)}
                  sx={{ mt: 2 }}>
                  Save This Location
                </Button>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    label='Location Name'
                    variant='outlined'
                    size='small'
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    sx={{ mr: 2, flexGrow: 1 }}
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={saveCurrentLocation}
                    disabled={!newLocationName.trim()}>
                    Save
                  </Button>
                  <Button
                    variant='text'
                    onClick={() => setShowAddForm(false)}
                    sx={{ ml: 1 }}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Saved Locations
        </Typography>

        {savedLocations.length === 0 ? (
          <Typography variant='body1' color='text.secondary' sx={{ py: 2 }}>
            No saved locations yet. Use the "Get My Location" button above to
            add locations.
          </Typography>
        ) : (
          <List>
            {savedLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}>
                <ListItem
                  sx={{
                    bgcolor: location.isHome
                      ? 'rgba(106, 90, 205, 0.1)'
                      : 'transparent',
                    borderRadius: 1,
                  }}>
                  <ListItemIcon aria-hidden="true">
                    {location.isHome ? (
                      <HomeIcon color='primary' />
                    ) : (
                      <LocationOnIcon color='secondary' />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={location.name}
                    secondary={location.address}
                    primaryTypographyProps={{
                      fontWeight: location.isHome ? 'bold' : 'normal',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title='Share Location'>
                      <IconButton
                        edge='end'
                        onClick={() => shareLocation(location)}
                        aria-label={`Share ${location.name}`}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    {!location.isHome && (
                      <Tooltip title='Set as Home'>
                        <IconButton
                          edge='end'
                          onClick={() => setAsHome(location.id)}
                          aria-label={`Set ${location.name} as home`}>
                          <HomeIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title='Delete Location'>
                      <IconButton
                        edge='end'
                        onClick={() => deleteLocation(location.id)}
                        aria-label={`Delete ${location.name}`}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < savedLocations.length - 1 && (
                  <Divider variant='inset' component='li' />
                )}
              </motion.div>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationTracker;
