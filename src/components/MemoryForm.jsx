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
  Card,
  CardContent,
  useTheme,
  alpha,
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
  const theme = useTheme();
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
      {/* Memory Type Selection */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Memory Type
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel id='memory-type-label'>Choose Memory Type</InputLabel>
            <Select
              labelId='memory-type-label'
              id='memory-type'
              value={memoryType}
              label='Choose Memory Type'
              onChange={handleTypeChange}
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  py: 2
                }
              }}
            >
              <MenuItem value='photo'>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <PhotoIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Photo Memory
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upload and share photos
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value='voice'>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <MicIcon sx={{ color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Voice Memory
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Record audio messages
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value='text'>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <TextSnippetIcon sx={{ color: 'info.main' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Text Memory
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Write your thoughts
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Basic Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                required
                fullWidth
                label='Memory Title'
                name='title'
                value={memoryData.title}
                onChange={handleInputChange}
                placeholder="Give your memory a meaningful title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
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
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Location'
                name='location'
                value={memoryData.location || ''}
                onChange={handleInputChange}
                placeholder='Where did this memory take place?'
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* People Section */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <PeopleIcon sx={{ color: 'primary.main' }} />
            People in this Memory
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  placeholder="Add people to this memory"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={handleAddPerson}
                  disabled={!newPerson.trim()}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 500,
                  }}
                >
                  Add Person
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box 
            sx={{ 
              minHeight: '60px',
              p: 3,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderRadius: 2,
              border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {memoryData.people?.length > 0 ? (
              memoryData.people.map((person) => (
                <Chip
                  key={person}
                  label={person}
                  onDelete={() => handleRemovePerson(person)}
                  color='primary'
                  variant='filled'
                  sx={{
                    borderRadius: 3,
                    fontWeight: 500,
                  }}
                />
              ))
            ) : (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                No people added yet. Add someone who was part of this memory.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Memory Content Section */}
      <Card 
        elevation={0} 
        sx={{ 
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {memoryType === 'photo' && <PhotoIcon sx={{ color: 'primary.main' }} />}
            {memoryType === 'voice' && <MicIcon sx={{ color: 'secondary.main' }} />}
            {memoryType === 'text' && <TextSnippetIcon sx={{ color: 'info.main' }} />}
            Memory Content
          </Typography>

          <Box 
            sx={{ 
              p: { xs: 3, sm: 4 },
              bgcolor: alpha(theme.palette.background.default, 0.3),
              borderRadius: 2,
              border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {memoryType === 'photo' && (
              <Box sx={{ width: '100%' }}>
                <PhotoUploader
                  onPhotoSelected={handlePhotoUpload}
                  defaultImage={photoPreview}
                />
                
                {photoPreview && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 500,
                        mb: 2,
                      }}
                    >
                      Photo Filter
                    </Typography>
                    
                    <FormControl 
                      fullWidth 
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
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

                    <Box 
                      sx={{ 
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2,
                        bgcolor: 'background.paper',
                        maxWidth: '400px',
                        mx: 'auto',
                      }}
                    >
                      <img
                        src={photoPreview}
                        alt='Memory Preview'
                        style={{
                          width: '100%',
                          height: '300px',
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
                  </>
                )}
              </Box>
            )}

            {memoryType === 'voice' && (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <VoiceRecorder onRecordingComplete={handleVoiceRecorded} />
              </Box>
            )}

            {memoryType === 'text' && (
              <TextField
                fullWidth
                multiline
                rows={8}
                name='content'
                value={memoryData.content}
                onChange={handleInputChange}
                placeholder='Share your thoughts, stories, or memories here... What made this moment special? How did you feel? What details do you want to remember?'
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

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
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemoryForm;