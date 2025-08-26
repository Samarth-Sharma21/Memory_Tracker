import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import PhotoIcon from '@mui/icons-material/Photo';
import MicIcon from '@mui/icons-material/Mic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { PhotoUploader, VoiceRecorder } from './';
import { supabase } from '../backend/server';

const MemoryForm = ({ memoryData, setMemoryData }) => {
  const [memoryType, setMemoryType] = useState('photo');
  const [newPerson, setNewPerson] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemoryData({ ...memoryData, [name]: value });
  };

  // Handle memory type change
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setMemoryType(newType);
    setMemoryData({ ...memoryData, type: newType });
    if (newType === 'photo') {
      setPhotoPreview('');
    }
  };

  // Handle adding a person
  const handleAddPerson = () => {
    if (newPerson.trim() && !memoryData.people?.includes(newPerson.trim())) {
      setMemoryData({
        ...memoryData,
        people: [...(memoryData.people || []), newPerson.trim()],
      });
      setNewPerson('');
    }
  };

  // Handle removing a person
  const handleRemovePerson = (personToRemove) => {
    setMemoryData({
      ...memoryData,
      people: (memoryData.people || []).filter(
        (person) => person !== personToRemove
      ),
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (file) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('memories').getPublicUrl(filePath);

      // Store the full URL in memoryData
      setPhotoPreview(URL.createObjectURL(file));
      setMemoryData({
        ...memoryData,
        content: publicUrl,
        type: 'photo', // Ensure type is set to photo
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      showNotification('Error uploading file. Please try again.', 'error');
    }
  };

  // Handle voice recording
  const handleVoiceRecorded = async (audioBlob) => {
    try {
      // Convert the audio blob to a file with proper MIME type
      const audioFile = new File([audioBlob], 'voice-recording.mp3', {
        type: 'audio/mpeg',
      });

      // Upload audio file to Supabase Storage
      const fileName = `${Math.random()}.mp3`;
      const filePath = `public/${fileName}`;

      // First, try to delete any existing file with the same name
      await supabase.storage.from('memories').remove([filePath]);

      // Upload the new file with proper options
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, audioFile, {
          contentType: 'audio/mpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('memories').getPublicUrl(filePath);

      console.log('Uploaded audio URL:', publicUrl);

      // Test if the audio file is accessible
      try {
        const response = await fetch(publicUrl);
        if (!response.ok) {
          throw new Error('Audio file not accessible');
        }
      } catch (error) {
        console.error('Error testing audio URL:', error);
        throw new Error('Audio file not accessible');
      }

      // Update memory data with the public URL
      setMemoryData({
        ...memoryData,
        content: publicUrl,
        type: 'voice', // Ensure type is set to voice
      });

      // Show success notification
      showNotification('Voice recording saved successfully!', 'success');
    } catch (error) {
      console.error('Error uploading audio:', error.message);
      showNotification('Error uploading audio. Please try again.', 'error');
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

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant='h5' 
        component='h2' 
        sx={{ 
          mb: 3,
          px: 2.5,
          fontWeight: 500,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          color: 'text.primary'
        }}
      >
        Memory Details
      </Typography>

      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
          {/* Memory Type Selection */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <FormControl fullWidth>
                <InputLabel id='memory-type-label'>Memory Type</InputLabel>
                <Select
                  labelId='memory-type-label'
                  id='memory-type'
                  value={memoryType}
                  label='Memory Type'
                  onChange={handleTypeChange}
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5
                    }
                  }}
                >
                  <MenuItem value='photo'>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5
                    }}>
                      <PhotoIcon sx={{ color: 'primary.main' }} />
                      Photo Memory
                    </Box>
                  </MenuItem>
                  <MenuItem value='voice'>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5
                    }}>
                      <MicIcon sx={{ color: 'secondary.main' }} />
                      Voice Memory
                    </Box>
                  </MenuItem>
                  <MenuItem value='text'>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5
                    }}>
                      <TextSnippetIcon sx={{ color: 'info.main' }} />
                      Text Memory
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Title and Date Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    required
                    fullWidth
                    label='Memory Title'
                    name='title'
                    value={memoryData.title}
                    onChange={handleInputChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        bgcolor: 'background.paper'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label='Date'
                    type='date'
                    name='date'
                    value={memoryData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        bgcolor: 'background.paper'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <TextField
                fullWidth
                label='Location'
                name='location'
                value={memoryData.location || ''}
                onChange={handleInputChange}
                placeholder='Enter or select a location'
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon color='primary' sx={{ mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    bgcolor: 'background.paper'
                  }
                }}
              />
            </Paper>
          </Grid>

          {/* People Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <PeopleIcon color="primary" />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 500,
                  }}
                >
                  People in this Memory
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                }}>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Add people to this memory"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: 'background.paper'
                    }
                  }}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleAddPerson}
                  disabled={!newPerson.trim()}
                  sx={{
                    borderRadius: 1.5,
                    height: 56,
                    px: 3,
                    minWidth: '100px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 1
                    }
                  }}>
                  <AddIcon sx={{ mr: 1 }} />
                  Add
                </Button>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  minHeight: '56px',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                {memoryData.people?.map((person) => (
                  <Chip
                    key={person}
                    label={person}
                    onDelete={() => handleRemovePerson(person)}
                    color='primary'
                    variant='outlined'
                    sx={{
                      borderRadius: '12px',
                      height: '32px',
                      '&:hover': {
                        bgcolor: 'primary.soft',
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Memory Content Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                width: '100%'
              }}
            >
              <Box 
                sx={{
                  p: 2.5,
                  pb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%'
                }}
              >
                {memoryType === 'photo' && <PhotoIcon color="primary" />}
                {memoryType === 'voice' && <MicIcon color="secondary" />}
                {memoryType === 'text' && <TextSnippetIcon color="info" />}
                <Typography 
                  variant='h6' 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary'
                  }}
                >
                  Memory Content
                </Typography>
              </Box>

              {memoryType === 'photo' && (
                <Box
                  sx={{
                    width: '100%',
                    px: 2.5,
                    pb: 2.5
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%',
                      bgcolor: 'background.paper',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                    }}
                  >
                    <PhotoUploader
                      onPhotoSelected={handlePhotoUpload}
                      defaultImage={photoPreview}
                    />
                  </Box>

                  {/* Photo filters */}
                  <Box 
                    sx={{ 
                      mt: 3,
                      width: '100%'
                    }}
                  >
                    <Typography 
                      variant='subtitle1' 
                      sx={{ 
                        fontWeight: 500,
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      Photo Filter
                    </Typography>
                    
                    <FormControl 
                      fullWidth 
                      sx={{ 
                        mb: 2.5,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }}
                    >
                      <InputLabel id='filter-label'>Apply Filter</InputLabel>
                      <Select
                        labelId='filter-label'
                        id='filter'
                        name='filter'
                        value={memoryData.filter || 'none'}
                        label='Apply Filter'
                        onChange={handleInputChange}
                      >
                        <MenuItem value='none'>No Filter</MenuItem>
                        <MenuItem value='polaroid'>Polaroid Frame</MenuItem>
                        <MenuItem value='sepia'>Sepia Tone</MenuItem>
                        <MenuItem value='vintage'>Vintage</MenuItem>
                      </Select>
                    </FormControl>

                    {photoPreview && (
                      <Box 
                        sx={{ 
                          width: '100%',
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          boxShadow: 1,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <img
                          src={photoPreview}
                          alt='Memory Preview'
                          style={{
                            width: '100%',
                            height: '350px',
                            objectFit: 'cover',
                            borderRadius: memoryData.filter === 'none' ? '8px' : '0',
                            border:
                              memoryData.filter === 'polaroid'
                                ? '12px solid white'
                                : memoryData.filter === 'sepia'
                                ? '4px solid #d4b483'
                                : memoryData.filter === 'vintage'
                                ? '6px solid #f5f5f5'
                                : 'none',
                            transform:
                              memoryData.filter === 'polaroid'
                                ? 'rotate(-2deg)'
                                : 'none',
                            filter:
                              memoryData.filter === 'sepia'
                                ? 'sepia(100%)'
                                : memoryData.filter === 'vintage'
                                ? 'grayscale(50%)'
                                : 'none',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {memoryType === 'voice' && (
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1.5,
                    p: 2.5,
                    border: 1,
                    borderColor: 'divider',
                    width: '100%'
                  }}
                >
                  <VoiceRecorder onRecordingComplete={handleVoiceRecorded} />
                </Box>
              )}

              {memoryType === 'text' && (
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    name='content'
                    value={memoryData.content}
                    onChange={handleInputChange}
                    placeholder='Share your thoughts, stories, or memories here...'
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        width: '100%'
                      }
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            '& .MuiAlert-message': { 
              fontSize: '0.95rem' 
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemoryForm;
