import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './server';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Container,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Divider,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoodIcon from '@mui/icons-material/Mood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../contexts/AuthContext';
import { MemoryCarousel } from '../components';
import { alpha } from '@mui/material/styles';
import catImage from '../assets/cat.jpg';
import Logo from '../components/Logo';

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

        // Get the connected patient's ID from the family_members table
        const { data: familyData, error: familyError } = await supabase
          .from('family_members')
          .select('patient_id')
          .eq('id', user.id)
          .single();

        if (familyError || !familyData) {
          throw new Error('Could not find connected patient');
        }

        // Fetch memories for the connected patient
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', familyData.patient_id)
          .order('date', { ascending: false });

        if (error) throw error;

        setMemories(data || []);
      } catch (error) {
        console.error('Error fetching memories:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // Create a combined userData object with defaults and auth data
  const userData = {
    name: user?.name || 'Family Member',
    email: user?.email || 'family@example.com',
    patientName: user?.patientName || 'John Doe',
    relation: user?.relation || 'Caretaker',
    lastActive: user?.lastActive || '2 days ago',
    recentActivities: [
      {
        id: 1,
        type: 'memory_added',
        title: 'Added a new photo',
        date: '2 hours ago',
      },
      {
        id: 2,
        type: 'routine_completed',
        title: 'Completed morning routine',
        date: 'Yesterday',
      },
      {
        id: 3,
        type: 'event_scheduled',
        title: 'Doctor appointment scheduled',
        date: '3 days ago',
      },
    ],
    ...user,
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: `linear-gradient(120deg, ${(theme) =>
                theme.palette.secondary.light} 0%, ${(theme) =>
                theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0,
              }}
            />
            <Grid
              container
              spacing={3}
              alignItems='center'
              sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={8}>
                <Typography variant='h4' component='h1' gutterBottom>
                  Welcome back, {userData.name}
                </Typography>
                <Typography variant='subtitle1' sx={{ mb: 3, opacity: 0.9 }}>
                  You're managing memories for {userData.patientName}. Last
                  activity was {userData.lastActive}.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant='contained'
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => navigate('/add-memory')}
                    sx={{
                      bgcolor: 'white',
                      color: 'secondary.main',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                    }}>
                    Add Memory
                  </Button>
                  <Button
                    variant='outlined'
                    color='inherit'
                    startIcon={<CalendarTodayOutlinedIcon />}
                    component={Link}
                    to='/family/dashboard/timeline'
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                    }}>
                    View Timeline
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    alignItems: 'center',
                    mt: { xs: 3, md: 0 },
                    transform: 'scale(1.1)',
                    transformOrigin: 'right center',
                  }}>
                  <Logo size='large' withLink={false} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Memory Carousel - New Feature */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                gutterBottom
                sx={{ ml: 1, fontWeight: 600 }}>
                {userData.patientName}'s Memories
              </Typography>
              <MemoryCarousel memories={memories} loading={loading} />
            </Box>
          </motion.div>
        </Grid>

        {/* Recent Memories */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              },
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' component='h2'>
                Recent Memories
              </Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to='/family/dashboard/timeline'
                sx={{ borderRadius: 2 }}>
                View All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {memories.slice(0, 3).map((memory) => (
                <Grid item xs={12} sm={6} md={4} key={memory.id}>
                  <Card
                    component={motion.div}
                    whileHover={{
                      y: -10,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      transition: { duration: 0.3 },
                    }}
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => navigate(`/memory/${memory.id}`)}>
                    {memory.type === 'photo' && (
                      <Box sx={{ height: 140, overflow: 'hidden' }}>
                        <img
                          src={memory.content}
                          alt={memory.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    )}
                    {memory.type === 'text' && (
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: alpha('#9c27b0', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ p: 2, fontStyle: 'italic' }}>
                          "{memory.content.substring(0, 100)}..."
                        </Typography>
                      </Box>
                    )}
                    {memory.type === 'voice' && (
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: alpha('#2196f3', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}>
                        <IconButton
                          sx={{
                            bgcolor: alpha('#2196f3', 0.2),
                            '&:hover': { bgcolor: alpha('#2196f3', 0.3) },
                          }}>
                          <svg width='24' height='24' viewBox='0 0 24 24'>
                            <path
                              fill='currentColor'
                              d='M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2Z'
                            />
                            <path
                              fill='currentColor'
                              d='M19,10C19,15 15.36,19 12,19C8.64,19 5,15 5,10H7A5,5 0 0,0 12,15A5,5 0 0,0 17,10H19Z'
                            />
                            <path
                              fill='currentColor'
                              d='M12,19V22H10V19H12M12,19V22H14V19H12'
                            />
                          </svg>
                        </IconButton>
                        <Typography variant='body2' sx={{ mt: 1 }}>
                          Voice Recording
                        </Typography>
                      </Box>
                    )}
                    <CardContent>
                      <Typography
                        variant='h6'
                        component='div'
                        gutterBottom
                        noWrap>
                        {memory.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}>
                        {memory.date}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Chip
                          size='small'
                          label={memory.location}
                          sx={{ borderRadius: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FavoriteIcon
                            sx={{ fontSize: 16, mr: 0.5, color: 'error.light' }}
                          />
                          <Typography variant='body2' color='text.secondary'>
                            {memory.reactions}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Patient Activity */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              },
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' component='h2'>
                Recent Activity
              </Typography>
              <IconButton
                size='small'
                sx={{
                  bgcolor: alpha('#f5f5f5', 0.8),
                  '&:hover': { bgcolor: alpha('#f5f5f5', 1) },
                }}>
                <NotificationsNoneIcon />
              </IconButton>
            </Box>
            <Stack spacing={2}>
              {userData.recentActivities.map((activity) => (
                <Card
                  key={activity.id}
                  variant='outlined'
                  sx={{
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: alpha('#f5f5f5', 0.5),
                    },
                  }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha('#f5f5f5', 0.8),
                          flexShrink: 0,
                        }}>
                        {activity.type === 'memory_added' ? (
                          <AddPhotoAlternateIcon color='primary' />
                        ) : activity.type === 'routine_completed' ? (
                          <AccessTimeIcon color='success' />
                        ) : (
                          <CalendarTodayOutlinedIcon color='warning' />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='body2' gutterBottom>
                          {activity.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {activity.date}
                        </Typography>
                      </Box>
                      <IconButton size='small'>
                        <MoreHorizIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='outlined'
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2 }}>
                View All Activity
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FamilyDashboard;
