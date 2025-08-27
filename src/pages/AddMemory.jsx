import { useState, useEffect } from 'react';
import { supabase } from '../backend/server';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMemory } from '../contexts/MemoryContext';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Alert,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { MemoryForm, UniversalSearch } from '../components';

const AddMemory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { triggerRefresh } = useMemory();
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [memoryData, setMemoryData] = useState({
    title: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    type: 'text',
    people: [],
    filter: 'none',
    location: '',
  });

  // Fetch recent locations
  useEffect(() => {
    const fetchRecentLocations = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) return;

        // Determine user ID - handle both patient and family members
        let userId = authUser.id;

        // If user is a family member, we need to get patient ID
        if (user?.type === 'family') {
          const { data: familyData, error: familyError } = await supabase
            .from('family_members')
            .select('patient_id')
            .eq('id', authUser.id)
            .single();

          if (familyError) throw familyError;
          userId = familyData.patient_id;
        }

        const { data, error } = await supabase
          .from('memories')
          .select('location')
          .eq('user_id', userId)
          .not('location', 'is', null)
          .not('location', 'eq', '')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Get unique locations
        const uniqueLocations = [
          ...new Set(data.map((memory) => memory.location)),
        ];
        setRecentLocations(uniqueLocations);
      } catch (err) {
        console.error('Error fetching recent locations:', err.message);
      }
    };

    fetchRecentLocations();
  }, [user]);

  const handleLocationSelect = (location) => {
    setMemoryData((prev) => ({ ...prev, location }));
  };

  const handleSaveMemory = async () => {
    try {
      // Get authenticated user
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !authUser) {
        throw new Error('User not authenticated! Please log in.');
      }

      // Determine user ID - for patients it's their own ID
      // For family members, we need to get the patient ID
      let userId = authUser.id;

      if (user?.type === 'family') {
        const { data: familyData, error: familyError } = await supabase
          .from('family_members')
          .select('patient_id')
          .eq('id', authUser.id)
          .single();

        if (familyError || !familyData) {
          throw new Error('Could not find connected patient');
        }
        userId = familyData.patient_id;
      }

      // Insert memory into Supabase without the created_by field
      const { error } = await supabase.from('memories').insert([
        {
          user_id: userId, // The patient ID (whose memory it is)
          title: memoryData.title,
          description: memoryData.description,
          content: memoryData.content,
          date: memoryData.date,
          type: memoryData.type,
          location: memoryData.location,
          people: memoryData.people,
          filter: memoryData.filter,
        },
      ]);

      if (error) throw error;

      // Trigger refresh of memories in the MemoryContext
      triggerRefresh();

      setCompleted(true);
      setTimeout(() => {
        // Redirect based on user type
        if (user?.type === 'family') {
          navigate('/family/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          px: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {/* Search Bar Section */}
        <Fade in timeout={400}>
          <Box sx={{ mb: 5 }}>
            <UniversalSearch 
              isFullWidth={true}
              placeholder="Search memories, locations, or people..."
            />
          </Box>
        </Fade>

        {/* Header Section */}
        <Fade in timeout={600}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 5,
              gap: 3,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.5,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AddCircleOutlineIcon 
                sx={{ 
                  fontSize: { xs: 28, sm: 32 }, 
                  color: 'primary.main' 
                }} 
              />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  color: 'text.primary',
                }}
              >
                Add New Memory
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Main Content Card */}
        <Fade in timeout={800}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.shadows[8],
            }}
          >
            {completed ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    py: 2,
                    '& .MuiAlert-message': {
                      width: '100%',
                      textAlign: 'center',
                    }
                  }}
                >
                  Memory saved successfully! Redirecting...
                </Alert>
              </Box>
            ) : (
              <>
                {/* Form Header */}
                <Box 
                  sx={{
                    px: { xs: 4, sm: 5, md: 6 },
                    py: { xs: 4, sm: 5 },
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 4,
                        borderRadius: 2,
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Recent Locations */}
                  {recentLocations.length > 0 && (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ 
                          mb: 3,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <LocationOnIcon sx={{ color: 'primary.main' }} />
                        Recent Locations
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {recentLocations.slice(0, 5).map((location, index) => (
                          <Chip
                            key={index}
                            label={location}
                            onClick={() => handleLocationSelect(location)}
                            variant={memoryData.location === location ? 'filled' : 'outlined'}
                            color={memoryData.location === location ? 'primary' : 'default'}
                            sx={{
                              borderRadius: 3,
                              px: 2,
                              py: 1,
                              height: 'auto',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '& .MuiChip-label': {
                                py: 0.5,
                              },
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: theme.shadows[4],
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Memory Form Section */}
                <Box
                  sx={{
                    px: { xs: 4, sm: 5, md: 6 },
                    py: { xs: 4, sm: 5, md: 6 },
                  }}
                >
                  <MemoryForm
                    memoryData={memoryData}
                    setMemoryData={setMemoryData}
                  />
                </Box>

                {/* Action Buttons Section */}
                <Box
                  sx={{
                    px: { xs: 4, sm: 5, md: 6 },
                    py: { xs: 4, sm: 5 },
                    bgcolor: alpha(theme.palette.background.default, 0.3),
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 3,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      size="large"
                      startIcon={<CancelIcon />}
                      sx={{ 
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        minWidth: { xs: '130px', sm: '150px' },
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderColor: alpha(theme.palette.grey[400], 0.5),
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: theme.palette.grey[400],
                          bgcolor: alpha(theme.palette.grey[400], 0.05),
                        }
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveMemory}
                      size="large"
                      startIcon={<SaveIcon />}
                      sx={{ 
                        borderRadius: 3,
                        px: 5,
                        py: 1.5,
                        minWidth: { xs: '150px', sm: '180px' },
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: theme.shadows[6],
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        '&:hover': {
                          boxShadow: theme.shadows[10],
                          transform: 'translateY(-2px)',
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Save Memory
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Fade>

        {/* Bottom Spacing */}
        <Box sx={{ height: { xs: 60, md: 80 } }} />
      </Container>
    </Box>
  );
};

export default AddMemory;