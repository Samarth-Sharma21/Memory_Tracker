import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  LocationTracker,
  EmergencyContact,
  BreathingExercise,
} from '../components';
import { useAuth } from '../contexts/AuthContext';
import { getEmergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } from '../backend/emergencyService';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [locationShared, setLocationShared] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShareLocation = () => {
    // In a real app, this would share the location with emergency contacts
    setLocationShared(true);
    setTimeout(() => {
      setLocationShared(false);
    }, 5000);
  };

  const handleEmergencyAlert = () => {
    // In a real app, this would send an alert to emergency contacts
    setEmergencyAlertSent(true);
    setTimeout(() => {
      setEmergencyAlertSent(false);
    }, 5000);
  };

  const handleBreathingGame = () => {
    navigate('/breathing-game');
  };

  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      if (!user || !user.mobile) return;
      
      try {
        setLoading(true);
        const result = await getEmergencyContacts(user.mobile);
        if (result.success) {
          setEmergencyContacts(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch emergency contacts',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyContacts();
  }, [user]);

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        phone: contact.mobile,
      });
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        phone: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user || !user.mobile) return;

    try {
      const contactData = {
        ...formData,
        patient_mobile: user.mobile,
        mobile: formData.phone,
      };

      let result;
      if (editingContact) {
        result = await updateEmergencyContact(editingContact.id, contactData);
      } else {
        result = await addEmergencyContact(contactData);
      }

      if (result.success) {
        const updatedContacts = editingContact
          ? emergencyContacts.map((contact) =>
              contact.id === editingContact.id ? result.data : contact
            )
          : [...emergencyContacts, result.data];
        setEmergencyContacts(updatedContacts);
        setSnackbar({
          open: true,
          message: editingContact
            ? 'Emergency contact updated successfully'
            : 'Emergency contact added successfully',
          severity: 'success',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save emergency contact',
        severity: 'error',
      });
    }

    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const result = await deleteEmergencyContact(id);
      if (result.success) {
        setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== id));
        setSnackbar({
          open: true,
          message: 'Emergency contact deleted successfully',
          severity: 'success',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete emergency contact',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4' component='h1'>
            Help Center
          </Typography>
        </Box>

        {/* Quick Action Buttons */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(90deg, #f8bbd0 0%, #e91e63 100%)`,
            color: 'white',
          }}>
          <Typography variant='h5' gutterBottom>
            Need Immediate Help?
          </Typography>
          <Typography variant='body1' paragraph>
            Use these quick actions to get help right away or to calm yourself
            during a moment of anxiety.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='secondary'
                startIcon={<ShareIcon />}
                onClick={handleShareLocation}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Share My Location
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='error'
                startIcon={<NotificationsActiveIcon />}
                onClick={handleEmergencyAlert}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Alert Emergency Contacts
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant='contained'
                fullWidth
                size='large'
                color='info'
                startIcon={<SpaIcon />}
                onClick={handleBreathingGame}
                sx={{ py: 1.5, borderRadius: 2 }}>
                Breathing Exercise
              </Button>
            </Grid>
          </Grid>

          {locationShared && (
            <Alert severity='success' sx={{ mt: 2 }}>
              Your location has been shared with your emergency contacts.
            </Alert>
          )}

          {emergencyAlertSent && (
            <Alert severity='info' sx={{ mt: 2 }}>
              Emergency alert has been sent to your contacts. They will contact
              you shortly.
            </Alert>
          )}
        </Paper>

        {/* Tabs for different help features */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab
              icon={<LocationOnIcon />}
              label='Location Sharing'
              iconPosition='start'
            />
            <Tab
              icon={<PeopleIcon />}
              label='Emergency Contacts'
              iconPosition='start'
            />
            <Tab
              icon={<SpaIcon />}
              label='Breathing Exercise'
              iconPosition='start'
            />
          </Tabs>

          {/* Location Sharing Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Share Your Location
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Your location can be shared with your emergency contacts to help
                them find you in case of an emergency.
              </Typography>
              <LocationTracker />
            </Box>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Emergency Contacts
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Add and manage your emergency contacts who will be notified when
                you need help.
              </Typography>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">Emergency Contacts</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Emergency Contact
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                  <Typography>Loading...</Typography>
                ) : emergencyContacts.length === 0 ? (
                  <Alert severity="info">No emergency contacts added yet.</Alert>
                ) : (
                  <List>
                    {emergencyContacts.map((contact) => (
                      <ListItem key={contact.id} divider>
                        <ListItemText
                          primary={contact.name}
                          secondary={contact.mobile}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleOpenDialog(contact)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDelete(contact.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          )}

          {/* Breathing Exercise Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Breathing Exercise
              </Typography>
              <Typography variant='body2' paragraph color='text.secondary'>
                Follow this guided breathing exercise to help calm yourself
                during moments of anxiety.
              </Typography>
              <BreathingExercise />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant='outlined'
                  color='primary'
                  startIcon={<SpaIcon />}
                  onClick={handleBreathingGame}>
                  Open Full Breathing Game
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </motion.div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                helperText="Must be 10 digits"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingContact ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HelpCenter;
