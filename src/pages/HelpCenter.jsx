import { useState } from 'react';
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
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { useResponsive, commonResponsiveStyles } from '../styles/responsiveStyles';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import EmergencyIcon from '@mui/icons-material/Emergency';
import {
  SavedLocationsCard,
  EmergencyContact,
  BreathingExercise,
  UniversalSearch,
} from '../components';

const HelpCenter = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isDarkMode = muiTheme.palette.mode === 'dark';
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState(0);
  const [locationShared, setLocationShared] = useState(false);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);

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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container
        maxWidth='xl'
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          maxWidth: "100%",
        }}
      >
        {/* Universal Search Bar */}
        <Fade in timeout={300}>
          <Box sx={{ mb: 4 }}>
            <UniversalSearch 
              isFullWidth={true}
              placeholder="Search memories, locations, people, or need help..."
            />
          </Box>
        </Fade>

        {/* Header with Back Button */}
        <Fade in timeout={500}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 3, sm: 4 },
              gap: 2,
            }}
          >
            <IconButton
              onClick={handleBack}
              edge="start"
              sx={{
                mr: 1,
                bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.2),
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component='h1'
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                flexGrow: 1,
              }}
            >
              <HelpCenterIcon sx={{ mr: 2, color: muiTheme.palette.primary.main, fontSize: "inherit" }} />
              Help Center
            </Typography>
          </Box>
        </Fade>

        {/* Quick Emergency Actions Card */}
        <Fade in timeout={700}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              mb: { xs: 3, sm: 4 },
              borderRadius: 4,
              bgcolor: isDarkMode
                ? alpha(muiTheme.palette.background.paper, 0.9)
                : muiTheme.palette.background.paper,
              border: `2px solid ${alpha(muiTheme.palette.error.main, 0.2)}`,
              boxShadow: `0 8px 32px ${alpha(muiTheme.palette.error.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmergencyIcon 
                sx={{ 
                  fontSize: { xs: 28, sm: 32 },
                  color: muiTheme.palette.error.main,
                  mr: 2,
                }} 
              />
              <Typography
                variant='h5'
                sx={{
                  fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.8rem' },
                  fontWeight: 700,
                  color: muiTheme.palette.error.main,
                }}
              >
                Emergency Quick Actions
              </Typography>
            </Box>
            
            <Typography
              variant='body1'
              paragraph
              sx={{
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                mb: 4,
                color: 'text.secondary',
                lineHeight: 1.6,
              }}
            >
              Use these quick actions to get immediate help or to calm yourself during moments of distress.
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} lg={4}>
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  color='error'
                  startIcon={<ShareIcon />}
                  onClick={handleShareLocation}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    boxShadow: 4,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    '&:hover': {
                      boxShadow: 8,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Share My Location
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} lg={4}>
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  color='warning'
                  startIcon={<NotificationsActiveIcon />}
                  onClick={handleEmergencyAlert}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    boxShadow: 4,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    '&:hover': {
                      boxShadow: 8,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Alert Emergency Contacts
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={12} lg={4}>
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  color='secondary'
                  startIcon={<SpaIcon />}
                  onClick={handleBreathingGame}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    boxShadow: 4,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    '&:hover': {
                      boxShadow: 8,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Breathing Exercise
                </Button>
              </Grid>
            </Grid>

            {/* Emergency Action Alerts */}
            {locationShared && (
              <Alert 
                severity='success' 
                sx={{ 
                  mt: 3, 
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                ✓ Your location has been shared with your emergency contacts.
              </Alert>
            )}

            {emergencyAlertSent && (
              <Alert 
                severity='info' 
                sx={{ 
                  mt: 3, 
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                ✓ Emergency alert sent! Your contacts will reach out to you shortly.
              </Alert>
            )}
          </Paper>
        </Fade>

        {/* Help Features Tabs */}
        <Fade in timeout={900}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: isDarkMode
                ? alpha(muiTheme.palette.background.paper, 0.9)
                : muiTheme.palette.background.paper,
              border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            }}
          >
            {/* Tabs Header */}
            <Box
              sx={{
                bgcolor: alpha(muiTheme.palette.primary.main, 0.03),
                borderBottom: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons={isMobile ? 'auto' : false}
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    minHeight: { xs: '56px', sm: '72px' },
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    fontWeight: 500,
                    minWidth: { xs: 'auto', sm: '160px' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <Tab
                  icon={<LocationOnIcon />}
                  label={isMobile ? 'Locations' : 'Location Sharing'}
                  iconPosition='start'
                  aria-label='Location Sharing'
                />
                <Tab
                  icon={<PeopleIcon />}
                  label={isMobile ? 'Contacts' : 'Emergency Contacts'}
                  iconPosition='start'
                  aria-label='Emergency Contacts'
                />
                <Tab
                  icon={<SpaIcon />}
                  label={isMobile ? 'Breathing' : 'Breathing Exercise'}
                  iconPosition='start'
                  aria-label='Breathing Exercise'
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ minHeight: { xs: '400px', sm: '500px' } }}>
              {/* Location Sharing Tab */}
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant='h5'
                        sx={{
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          fontWeight: 700,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <LocationOnIcon sx={{ color: 'primary.main' }} />
                        Share Your Location
                      </Typography>
                      <Typography
                        variant='body1'
                        color='text.secondary'
                        sx={{
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        Your saved locations can be quickly shared with emergency contacts to help them find you during emergencies.
                      </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        bgcolor: alpha(muiTheme.palette.background.default, 0.3),
                        borderRadius: 3,
                        p: 3,
                        border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
                      }}
                    >
                      <SavedLocationsCard />
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Emergency Contacts Tab */}
              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant='h5'
                        sx={{
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          fontWeight: 700,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <PeopleIcon sx={{ color: 'primary.main' }} />
                        Emergency Contacts
                      </Typography>
                      <Typography
                        variant='body1'
                        color='text.secondary'
                        sx={{
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        Add and manage trusted people who will be notified when you need help. They can receive your location and emergency alerts.
                      </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        bgcolor: alpha(muiTheme.palette.background.default, 0.3),
                        borderRadius: 3,
                        p: 3,
                        border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
                      }}
                    >
                      <EmergencyContact />
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Breathing Exercise Tab */}
              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant='h5'
                        sx={{
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                          fontWeight: 700,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <SpaIcon sx={{ color: 'primary.main' }} />
                        Breathing Exercise
                      </Typography>
                      <Typography
                        variant='body1'
                        color='text.secondary'
                        sx={{
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        Use guided breathing exercises to help calm yourself during moments of anxiety, stress, or confusion.
                      </Typography>
                    </Box>
                    
                    <Box
                      sx={{
                        bgcolor: alpha(muiTheme.palette.background.default, 0.3),
                        borderRadius: 3,
                        p: 3,
                        border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
                        mb: 4,
                      }}
                    >
                      <BreathingExercise />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        startIcon={<SpaIcon />}
                        onClick={handleBreathingGame}
                        sx={{
                          borderRadius: 3,
                          py: { xs: 1.5, sm: 2 },
                          px: { xs: 3, sm: 4 },
                          fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          fontWeight: 600,
                          boxShadow: 4,
                          '&:hover': {
                            boxShadow: 8,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Open Full Breathing Game
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Box>
          </Paper>
        </Fade>

        {/* Bottom spacing */}
        <Box sx={{ height: { xs: 80, md: 100 } }} />
      </Container>
    </Box>
  );
};

export default HelpCenter;