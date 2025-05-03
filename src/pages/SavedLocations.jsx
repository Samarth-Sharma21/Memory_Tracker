import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveLocation, getSavedLocations, updateSavedLocation, deleteSavedLocation } from '../backend/savedLocationService';

const SavedLocations = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme.palette.mode === 'dark';

  // State for saved locations
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for location form
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    lat: null,
    lng: null,
  });

  // UI states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch saved locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await getSavedLocations(user.id);
        if (result.success) {
          setLocations(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setNotification({
          open: true,
          message: 'Failed to fetch locations',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [user]);

  const handleOpenDialog = (location = null) => {
    if (location) {
      setEditingLocation(location);
      setNewLocation({
        name: location.name,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
      });
    } else {
      setEditingLocation(null);
      setNewLocation({
        name: '',
        address: '',
        lat: null,
        lng: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLocation(null);
    setNewLocation({
      name: '',
      address: '',
      lat: null,
      lng: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleSaveLocation = async () => {
    if (!user) {
      setNotification({
        open: true,
        message: 'User not authenticated',
        severity: 'error',
      });
      return;
    }

    try {
      // If lat/lng are not provided, get them from the address
      let locationData = { ...newLocation };
      if (!locationData.lat || !locationData.lng) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationData.address)}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          locationData.lat = parseFloat(data[0].lat);
          locationData.lng = parseFloat(data[0].lon);
        } else {
          throw new Error('Could not find coordinates for this address');
        }
      }

      locationData.patient_id = user.id;

      let result;
      if (editingLocation) {
        result = await updateSavedLocation(editingLocation.id, locationData);
      } else {
        result = await saveLocation(locationData);
      }

      if (result.success) {
        const updatedLocations = editingLocation
          ? locations.map((loc) => (loc.id === editingLocation.id ? result.data : loc))
          : [...locations, result.data];
        setLocations(updatedLocations);
        setNotification({
          open: true,
          message: editingLocation ? 'Location updated successfully' : 'Location saved successfully',
          severity: 'success',
        });
        handleCloseDialog();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to save location',
        severity: 'error',
      });
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      const result = await deleteSavedLocation(id);
      if (result.success) {
        setLocations(locations.filter((loc) => loc.id !== id));
        setNotification({
          open: true,
          message: 'Location deleted successfully',
          severity: 'success',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to delete location',
        severity: 'error',
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get address from coordinates
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || `${latitude}, ${longitude}`;
              setNewLocation({
                ...newLocation,
                address: address,
                lat: latitude,
                lng: longitude,
              });
            })
            .catch((error) => {
              console.error('Error getting address:', error);
              setNewLocation({
                ...newLocation,
                address: `${latitude}, ${longitude}`,
                lat: latitude,
                lng: longitude,
              });
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          setNotification({
            open: true,
            message: 'Unable to get your current location',
            severity: 'error',
          });
        }
      );
    } else {
      setNotification({
        open: true,
        message: 'Geolocation is not supported by your browser',
        severity: 'error',
      });
    }
  };

  const handleNavigate = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      '_blank'
    );
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            color='primary'>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
            Saved Locations
          </Typography>
        </Box>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={5000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Search and Add */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: isDarkMode
              ? alpha(theme.palette.background.paper, 0.6)
              : theme.palette.background.paper,
          }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder='Search locations...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon color='primary' />
                    </InputAdornment>
                  ),
                }}
                variant='outlined'
                sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                startIcon={<AddLocationAltIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}>
                Add New Location
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Locations List */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography>Loading...</Typography>
            </Grid>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Grid item xs={12} md={6} key={location.id}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    },
                    bgcolor: isDarkMode
                      ? alpha(theme.palette.background.paper, 0.6)
                      : theme.palette.background.paper,
                  }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant='h6' gutterBottom>
                      {location.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' paragraph>
                      {location.address}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size='small'
                      startIcon={<NavigationIcon />}
                      onClick={() => handleNavigate(location.address)}>
                      Navigate
                    </Button>
                    <Button
                      size='small'
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(location)}>
                      Edit
                    </Button>
                    <Button
                      size='small'
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteLocation(location.id)}
                      color='error'>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity='info'>No locations found</Alert>
            </Grid>
          )}
        </Grid>

        {/* Add/Edit Location Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
          <DialogTitle>
            {editingLocation ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Name'
                  name='name'
                  value={newLocation.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Address'
                  name='address'
                  value={newLocation.address}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={handleGetCurrentLocation}>
                          <MyLocationIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveLocation} variant='contained' color='primary'>
              {editingLocation ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default SavedLocations;