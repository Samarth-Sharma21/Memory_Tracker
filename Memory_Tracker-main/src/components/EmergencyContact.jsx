import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const EmergencyContact = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Smith', relationship: 'Son', phone: '(555) 123-4567' },
    {
      id: 2,
      name: 'Mary Johnson',
      relationship: 'Daughter',
      phone: '(555) 987-6543',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Open dialog for adding a new contact
  const handleAddContact = () => {
    setEditingContact(null);
    setFormData({ name: '', relationship: '', phone: '' });
    setOpenDialog(true);
  };

  // Open dialog for editing an existing contact
  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    });
    setOpenDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save contact (add new or update existing)
  const handleSaveContact = () => {
    // Validate form
    if (!formData.name || !formData.phone) {
      showNotification('Name and phone number are required', 'error');
      return;
    }

    if (editingContact) {
      // Update existing contact
      setContacts(
        contacts.map((contact) =>
          contact.id === editingContact.id
            ? { ...contact, ...formData }
            : contact
        )
      );
      showNotification('Contact updated successfully', 'success');
    } else {
      // Add new contact
      const newContact = {
        id: Date.now(),
        ...formData,
      };
      setContacts([...contacts, newContact]);
      showNotification('Contact added successfully', 'success');
    }

    setOpenDialog(false);
  };

  // Delete a contact
  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    showNotification('Contact deleted', 'success');
  };

  // Simulate sending an emergency notification
  const handleEmergencyNotify = (contact) => {
    // In a real app, this would trigger an actual notification
    showNotification(`Emergency notification sent to ${contact.name}`, 'info');
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' component='h2' gutterBottom>
        Emergency Contacts
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}>
          <Typography variant='h6'>Your Emergency Contacts</Typography>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleAddContact}>
            Add Contact
          </Button>
        </Box>

        {contacts.length === 0 ? (
          <Alert severity='info'>
            No emergency contacts added yet. Add contacts who should be notified
            in case of emergency.
          </Alert>
        ) : (
          <List>
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                <ListItem
                  sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    <PersonIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant='subtitle1' fontWeight='medium'>
                        {contact.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          component='span'>
                          {contact.relationship}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 0.5,
                          }}>
                          <PhoneIcon
                            fontSize='small'
                            sx={{ mr: 0.5, color: 'text.secondary' }}
                          />
                          <Typography variant='body2' color='text.secondary'>
                            {contact.phone}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      color='secondary'
                      onClick={() => handleEmergencyNotify(contact)}
                      sx={{ mr: 1 }}>
                      <NotificationsActiveIcon />
                    </IconButton>
                    <IconButton
                      edge='end'
                      onClick={() => handleEditContact(contact)}
                      sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge='end'
                      onClick={() => handleDeleteContact(contact.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < contacts.length - 1 && <Divider />}
              </motion.div>
            ))}
          </List>
        )}

        <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }}>
          These contacts will be notified in case of emergency. You can add
          family members, caregivers, or healthcare providers.
        </Typography>
      </Paper>

      {/* Add/Edit Contact Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='sm'
        fullWidth>
        <DialogTitle>
          {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Full Name'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin='dense'
            name='relationship'
            label='Relationship'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.relationship}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='phone'
            label='Phone Number'
            type='tel'
            fullWidth
            variant='outlined'
            value={formData.phone}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveContact}
            variant='contained'
            color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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

export default EmergencyContact;
