import { useState, useEffect } from 'react';
import { supabase } from '../backend/server';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Divider,
  Stack,
  Avatar,
  CardMedia,
  useTheme,
} from '@mui/material';
import {
  useResponsive,
  commonResponsiveStyles,
} from '../styles/responsiveStyles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SpaIcon from '@mui/icons-material/Spa';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import {
  BreathingExercise,
  MemoryCarousel,
  DashboardBentoGrid,
  CalendarAndTasks,
  FamilyManagementCard,
  NotificationsCard,
} from '../components';
import { Link } from 'react-router-dom';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SavedLocationsCard from '../components/SavedLocationsCard';
import UpcomingTasksCard from '../components/UpcomingTasksCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useAuth } from '../contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import catImage from '../assets/cat.jpg';
import Logo from '../components/Logo';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } =
    useResponsive();

  // Create a combined userData object with defaults and auth data
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        // Get the current user's ID
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', user.id) // Filter by current user's ID
          .order('date', { ascending: false });

        if (error) throw error;

        setMemories(data || []);
      } catch (error) {
        console.error('Error fetching memories:', error.message);
      }
    };

    fetchMemories();
  }, []);

  const handleAddMemory = () => {
    navigate('/add-memory');
  };

  const handleViewMemory = (id) => {
    navigate(`/memory/${id}`);
  };

  const toggleBreathingExercise = () => {
    setShowBreathingExercise(!showBreathingExercise);
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours(); // uses user's local time

      if (hour >= 17) {
        setGreeting('Good evening!');
      } else if (hour >= 12) {
        setGreeting('Good afternoon!');
      } else {
        setGreeting('Good morning!');
      }
    };

    updateGreeting(); // set immediately on mount
    const interval = setInterval(updateGreeting, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, []);

  const userData = {
    name: user?.name || 'Guest', // Default name if undefined
    email: user?.email || '',
    familyMembers: user?.familyMembers || [], // Add default empty array for familyMembers
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}>
      <Container
        maxWidth='lg'
        disableGutters={isMobile}
        sx={{
          mt: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 3, sm: 4, md: 5 },
          px: { xs: 1, sm: 2, md: 3 },
          boxSizing: 'border-box',
          width: '100%',
          overflowX: 'hidden',
        }}>
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 4 }}>
          {/* Greeting Card */}
          <Grid xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 2, sm: 3, md: 3 },
                borderRadius: 3,
                background: isDarkMode
                  ? `linear-gradient(90deg, ${alpha(
                      theme.palette.primary.dark,
                      0.8
                    )} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`
                  : `linear-gradient(10deg, ${alpha(
                      theme.palette.primary.light,
                      0.95
                    )} 0%, ${theme.palette.primary.main} 100%)`,
                color: '#fff',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: isDarkMode
                  ? '0 8px 20px rgba(0, 0, 0, 0.3)'
                  : '0 8px 20px rgba(0, 0, 0, 0.15)',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                height: 'auto',
              }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: { xs: '150px', sm: '200px' },
                  height: { xs: '150px', sm: '200px' },
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -40,
                  left: -40,
                  width: { xs: '100px', sm: '150px' },
                  height: { xs: '100px', sm: '150px' },
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  zIndex: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              />
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                alignItems='center'
                sx={{ position: 'relative', zIndex: 1 }}>
                <Grid xs={12} sm={7}>
                  <Typography
                    variant='h4'
                    component='h1'
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      flexDirection: { xs: 'column', sm: 'row' },
                      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    }}>
                    {greeting}{' '}
                    <Box
                      component='span'
                      sx={{
                        pl: { xs: 0, sm: 1 },
                        fontWeight: 400,
                        opacity: 0.9,
                      }}>
                      {userData.name}
                    </Box>
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      mb: 2,
                      opacity: 0.9,
                      fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                    }}>
                    Welcome to your memory dashboard. Ready to capture some new
                    memories today?
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2 }}
                    sx={{ width: '100%' }}>
                    <Button
                      variant='contained'
                      onClick={handleAddMemory}
                      startIcon={<AddPhotoAlternateIcon />}
                      fullWidth={isMobile}
                      sx={{
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        },
                      }}>
                      Add Memory
                    </Button>
                    <Button
                      variant='outlined'
                      color='inherit'
                      startIcon={<SpaIcon />}
                      onClick={toggleBreathingExercise}
                      fullWidth={isMobile}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                      }}>
                      Breathing Exercise
                    </Button>
                  </Stack>
                  {showBreathingExercise && (
                    <Box sx={{ mt: 3, maxWidth: '100%', overflow: 'hidden' }}>
                      <BreathingExercise />
                    </Box>
                  )}
                </Grid>
                <Grid xs={12} sm={5}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', sm: 'flex-end' },
                      alignItems: 'center',
                      mt: { xs: 3, sm: 0 },
                      transform: { xs: 'scale(1)', sm: 'scale(1.1)' },
                      transformOrigin: { xs: 'center', sm: 'right center' },
                    }}>
                    <Logo
                      size={isMobile ? 'medium' : 'large'}
                      withLink={false}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Featured Memories Carousel with Action Buttons */}
          <Grid xs={12}>
            <Box
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  width: '100%',
                  px: 1,
                }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}>
                  Featured Memories
                </Typography>
              </Box>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: isDarkMode
                    ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.15)',
                  // Fixed widths for different screen sizes
                  width: '100%',
                  maxWidth: {
                    xs: '100%',
                    sm: '600px',
                    md: '800px',
                    lg: '900px',
                  },
                  height: { xs: 200, sm: 280, md: 350, lg: 400 },
                  boxSizing: 'border-box',
                }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 },
                  }}>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={handleAddMemory}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 0.5, sm: 1 },
                      borderRadius: 2,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      bgcolor: 'primary.main',
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    }}>
                    Add Memory
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<TimelineIcon />}
                    component={Link}
                    to='/patient/dashboard/timeline'
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 0.5, sm: 1 },
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      color: 'primary.main',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    }}>
                    View Timeline
                  </Button>
                </Box>
                <MemoryCarousel memories={memories} />
              </Paper>
            </Box>
          </Grid>

          {/* Dashboard Tools Heading */}
          <Grid xs={12}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}>
              Dashboard Tools
            </Typography>
          </Grid>

          {/* Three action cards - stacked on mobile, side by side on larger screens */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Dashboard Cards Row - equal height for all cards */}
            <Grid container item spacing={2} xs={12}>
              {/* Saved Locations Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    height: { xs: '350px', sm: '350px', md: '350px' },
                    width: '100%',
                    display: 'flex',
                  }}>
                  <SavedLocationsCard />
                </Box>
              </Grid>

              {/* Tasks Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    height: { xs: '350px', sm: '350px', md: '350px' },
                    width: '100%',
                    display: 'flex',
                  }}>
                  <UpcomingTasksCard isWidget={true} />
                </Box>
              </Grid>

              {/* Family Management Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    height: { xs: '350px', sm: '350px', md: '350px' },
                    width: '100%',
                    display: 'flex',
                  }}>
                  <FamilyManagementCard onSettingsClick={() => {}} />
                </Box>
              </Grid>
            </Grid>

            {/* Calendar and Tasks */}
            <Grid item xs={12} md={12} lg={10}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '100%',
                  minHeight: '400px',
                  width: '100%',
                }}>
                <CalendarAndTasks activeTab={0} showCalendar={true} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                  }}>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    to='/calendar'
                    sx={{
                      borderRadius: 1,
                      py: 0.75,
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}>
                    View More
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6} lg={2}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <Typography variant='h6' gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      to='/add-memory'
                      variant='outlined'
                      color='primary'
                      fullWidth
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{
                        height: '100%',
                        py: 2,
                        '&:hover': {
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}>
                      Add Memory
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={toggleBreathingExercise}
                      variant='outlined'
                      color='secondary'
                      fullWidth
                      startIcon={<SpaIcon />}
                      sx={{
                        height: '100%',
                        py: 2,
                        '&:hover': {
                          color: 'secondary.main',
                          borderColor: 'secondary.main',
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        },
                      }}>
                      Breathing
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      to='/patient/dashboard/timeline'
                      variant='outlined'
                      color='primary'
                      fullWidth
                      startIcon={<TimelineIcon />}
                      sx={{
                        height: '100%',
                        py: 2,
                        '&:hover': {
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}>
                      Timeline
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      to='/saved-locations'
                      variant='outlined'
                      color='secondary'
                      fullWidth
                      startIcon={<LocationOnIcon />}
                      sx={{
                        height: '100%',
                        py: 2,
                        '&:hover': {
                          color: 'secondary.main',
                          borderColor: 'secondary.main',
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        },
                      }}>
                      Locations
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      component={Link}
                      to='/calendar'
                      variant='outlined'
                      color='primary'
                      fullWidth
                      startIcon={<CalendarTodayIcon />}
                      sx={{
                        height: '100%',
                        py: 2,
                        '&:hover': {
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}>
                      Calendar
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Memories */}
          <Grid xs={12} sx={{ mt: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-5px)' },
                  boxShadow: isDarkMode
                    ? '0 12px 20px rgba(0, 0, 0, 0.3)'
                    : '0 12px 20px rgba(0, 0, 0, 0.1)',
                },
                width: '100%',
                maxWidth: '100%',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 },
                }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                  }}>
                  Recent Memories
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to='/patient/dashboard/timeline'
                  sx={{
                    borderRadius: 2,
                    alignSelf: { xs: 'flex-end', sm: 'center' },
                  }}>
                  View All
                </Button>
              </Box>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {memories?.length > 0 ? (
                  memories.slice(0, 3).map((memory) => (
                    <Grid
                      xs={12}
                      sm={6}
                      md={4}
                      key={memory.id}
                      sx={{ display: 'flex' }}>
                      <Card
                        sx={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: (theme) =>
                              `0 8px 16px ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                          },
                        }}
                        onClick={() => handleViewMemory(memory.id)}>
                        {memory.type === 'text' ? (
                          <Box
                            sx={{
                              p: 3,
                              bgcolor: alpha('#9c27b0', 0.05),
                              height: { xs: '120px', sm: '140px' },
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              position: 'relative',
                              overflow: 'hidden',
                            }}>
                            <TextSnippetIcon
                              sx={{
                                fontSize: { xs: 24, sm: 30 },
                                color: alpha('#9c27b0', 0.6),
                                mb: 2,
                              }}
                            />
                            <Typography
                              variant='body1'
                              color='text.primary'
                              sx={{
                                fontStyle: 'italic',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                              }}>
                              "{memory.content}"
                            </Typography>
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '50%',
                                p: 0.5,
                              }}>
                              <TextSnippetIcon
                                color='primary'
                                fontSize='small'
                              />
                            </Box>
                          </Box>
                        ) : (
                          <CardMedia
                            component='img'
                            image={memory.content || catImage}
                            alt={memory.title || 'Memory'}
                            sx={{
                              height: { xs: 120, sm: 140 },
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant='h6'
                            component='div'
                            gutterBottom
                            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {memory.title || 'Untitled Memory'}
                          </Typography>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            }}>
                            <CalendarTodayOutlinedIcon
                              fontSize='inherit'
                              sx={{ mr: 0.5 }}
                            />
                            {memory.date || 'Unknown Date'}
                          </Typography>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            }}>
                            {memory.description || 'No description available.'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid xs={12}>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ m: 2 }}>
                      No memories found.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDashboard;
