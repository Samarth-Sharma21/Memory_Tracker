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
  Switch,
  FormControlLabel,
  TextField,
  Avatar,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AccessibilityControls, EmergencyContact } from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getPatientProfile, updatePatientProfile } from '../backend/settingsService';
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../backend/familyService';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get theme from context
  const { mode, toggleTheme } = useTheme();

  // User data from auth context
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
    accessibility: {
      fontSize: 16,
      highContrast: false,
      screenReader: false,
    },
  });

  // Fetch patient profile on component mount
  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (!user) return;

      try {
        const result = await getPatientProfile(user.id);
        if (result.success) {
          setUserData(prev => ({
            ...prev,
            name: result.data.name || prev.name,
            email: result.data.email || prev.email,
            mobile: result.data.mobile || prev.mobile,
          }));
        }
      } catch (error) {
        console.error('Error fetching patient profile:', error);
        showNotification('Failed to load profile', 'error');
      }
    };

    fetchPatientProfile();
  }, [user]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!user || !userData.mobile) return;
      
      try {
        setLoading(true);
        const result = await getFamilyMembers(userData.mobile);
        if (result.success) {
          setFamilyMembers(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch family members',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [user, userData.mobile]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setUserData({ ...userData, [name]: checked });
  };

  const handleFontSizeChange = (event, newValue) => {
    setUserData({ ...userData, accessibility: { ...userData.accessibility, fontSize: newValue } });
  };

  const handleSaveProfile = async () => {
    if (!user) {
      showNotification('User not authenticated', 'error');
      return;
    }

    try {
      const result = await updatePatientProfile(user.id, {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
      });

      if (result.success) {
        showNotification('Profile updated successfully', 'success');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Failed to save profile', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleOpenDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        relationship: member.relationship,
        email: member.email,
        phone: member.phone,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        relationship: '',
        email: '',
        phone: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
    setFormData({
      name: '',
      relationship: '',
      email: '',
      phone: '',
    });
  };

  const handleSubmit = async () => {
    if (!user || !userData.mobile) return;

    try {
      const familyMemberData = {
        ...formData,
        patient_mobile: userData.mobile,
        mobile: formData.phone,
      };

      let result;
      if (editingMember) {
        result = await updateFamilyMember(editingMember.id, familyMemberData);
      } else {
        result = await addFamilyMember(familyMemberData);
      }

      if (result.success) {
        const updatedMembers = editingMember
          ? familyMembers.map((member) =>
              member.id === editingMember.id ? result.data : member
            )
          : [...familyMembers, result.data];
        setFamilyMembers(updatedMembers);
        setSnackbar({
          open: true,
          message: editingMember
            ? 'Family member updated successfully'
            : 'Family member added successfully',
          severity: 'success',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving family member:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save family member',
        severity: 'error',
      });
    }

    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const result = await deleteFamilyMember(id);
      if (result.success) {
        setFamilyMembers(familyMembers.filter((member) => member.id !== id));
        setSnackbar({
          open: true,
          message: 'Family member deleted successfully',
          severity: 'success',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting family member:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete family member',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <div>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4' component='h1'>
            Settings
          </Typography>
        </Box>

        {notification.open && (
          <Alert severity={notification.severity} sx={{ mb: 3 }}>
            {notification.message}
          </Alert>
        )}

        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<PersonIcon />} label='Profile' iconPosition='start' />
            <Tab
              icon={<AccessibilityNewIcon />}
              label='Accessibility'
              iconPosition='start'
            />
            <Tab
              icon={<PeopleIcon />}
              label='Family Connections'
              iconPosition='start'
            />
            <Tab
              icon={<NotificationsIcon />}
              label='Notifications'
              iconPosition='start'
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    alt={userData.name}
                    src='/placeholder-avatar.jpg'>
                    {userData.name.charAt(0)}
                  </Avatar>
                  <Button variant='outlined' color='primary'>
                    Change Photo
                  </Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant='h6' gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Full Name'
                        name='name'
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Email Address'
                        name='email'
                        type='email'
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Mobile Number'
                        name='mobile'
                        value={userData.mobile}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Accessibility Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Display Settings
              </Typography>

              {/* Theme Toggle */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleTheme}
                      color='primary'
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {mode === 'dark' ? (
                        <>
                          <DarkModeIcon color='primary' />
                          <Typography>Dark Mode</Typography>
                        </>
                      ) : (
                        <>
                          <LightModeIcon color='primary' />
                          <Typography>Light Mode</Typography>
                        </>
                      )}
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 4 }}>
                <Typography id='font-size-slider' gutterBottom>
                  Font Size: {userData.accessibility.fontSize}px
                </Typography>
                <Slider
                  value={userData.accessibility.fontSize}
                  onChange={handleFontSizeChange}
                  aria-labelledby='font-size-slider'
                  valueLabelDisplay='auto'
                  step={1}
                  marks
                  min={12}
                  max={24}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.accessibility.highContrast}
                    onChange={handleSwitchChange}
                    name='highContrast'
                    color='primary'
                  />
                }
                label='High Contrast Mode'
              />
              <Divider sx={{ my: 3 }} />
              <AccessibilityControls />
            </Box>
          )}

          {/* Family Connections Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Family Connections</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Family Member
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Typography>Loading...</Typography>
              ) : familyMembers.length === 0 ? (
                <Alert severity="info">No family members added yet.</Alert>
              ) : (
                <List>
                  {familyMembers.map((member) => (
                    <ListItem key={member.id} divider>
                      <ListItemText
                        primary={member.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {member.relationship}
                            </Typography>
                            {member.email && ` — ${member.email}`}
                            {member.phone && ` — ${member.phone}`}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleOpenDialog(member)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleDelete(member.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Notifications Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Notification Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.notifications.email}
                    onChange={handleSwitchChange}
                    name='notifications.email'
                    color='primary'
                  />
                }
                label='Email Notifications'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.notifications.push}
                    onChange={handleSwitchChange}
                    name='notifications.push'
                    color='primary'
                  />
                }
                label='Push Notifications'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userData.notifications.reminders}
                    onChange={handleSwitchChange}
                    name='notifications.reminders'
                    color='primary'
                  />
                }
                label='Reminder Notifications'
              />
              <Box sx={{ mt: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  Notifications help you remember to add new memories and stay
                  connected with your family members.
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper elevation={2} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon color='primary' sx={{ mr: 2 }} />
            <Typography variant='h6'>Account Security</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button variant='outlined' fullWidth>
                Change Password
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant='outlined' color='error' fullWidth>
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMember ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
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
                label="Relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
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
            {editingMember ? 'Update' : 'Add'}
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

export default Settings;
