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
  const { isMobile } = useResponsive();

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
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters={isMobile}
        sx={{
          mt: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 3, sm: 4, md: 5 },
          px: { xs: 1, sm: 2, md: 3 },
          boxSizing: "border-box",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Vertical Stack Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, sm: 4, md: 5 },
            width: "100%",
          }}
        >
          {/* Greeting Section */}
          <Box sx={{ width: "100%" }}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
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
                color: "#fff",
                overflow: "hidden",
                position: "relative",
                boxShadow: isDarkMode
                  ? "0 8px 20px rgba(0, 0, 0, 0.3)"
                  : "0 8px 20px rgba(0, 0, 0, 0.15)",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                height: "auto",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: { xs: "150px", sm: "200px" },
                  height: { xs: "150px", sm: "200px" },
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  zIndex: 0,
                  display: { xs: "none", sm: "block" },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: { xs: "100px", sm: "150px" },
                  height: { xs: "100px", sm: "150px" },
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.05)",
                  zIndex: 0,
                  display: { xs: "none", sm: "block" },
                }}
              />
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                alignItems="center"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Grid xs={12} sm={7}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                    }}
                  >
                    {greeting}{" "}
                    <Box
                      component="span"
                      sx={{
                        pl: { xs: 0, sm: 1 },
                        fontWeight: 400,
                        opacity: 0.9,
                      }}
                    >
                      {userData.name}
                    </Box>
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      opacity: 0.9,
                      fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                    }}
                  >
                    Welcome to your memory dashboard. Ready to capture some new
                    memories today?
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2 }}
                    sx={{ width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleAddMemory}
                      startIcon={<AddPhotoAlternateIcon />}
                      fullWidth={isMobile}
                      sx={{
                        bgcolor: "white",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.9)",
                        },
                      }}
                    >
                      Add Memory
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<SpaIcon />}
                      onClick={toggleBreathingExercise}
                      fullWidth={isMobile}
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Breathing Exercise
                    </Button>
                  </Stack>
                  {showBreathingExercise && (
                    <Box sx={{ mt: 3, maxWidth: "100%", overflow: "hidden" }}>
                      <BreathingExercise />
                    </Box>
                  )}
                </Grid>
                <Grid xs={12} sm={5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", sm: "flex-end" },
                      alignItems: "center",
                      mt: { xs: 3, sm: 0 },
                      transform: { xs: "scale(1)", sm: "scale(1.1)" },
                      transformOrigin: { xs: "center", sm: "right center" },
                    }}
                  >
                    <Logo
                      size={isMobile ? "medium" : "large"}
                      withLink={false}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Featured Memories Section */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Featured Memories
            </Typography>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                boxShadow: isDarkMode
                  ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                  : "0 10px 30px rgba(0, 0, 0, 0.15)",
                width: "100%",
                height: { xs: 200, sm: 280, md: 350, lg: 400 },
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                {/* Add Memory Button - small circle that expands */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddMemory}
                  sx={{
                    borderRadius: "50%",
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    padding: 0,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    bgcolor: "primary.main",
                    transition: "all 0.4s ease",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      width: 120,
                      borderRadius: 2,
                      padding: "0 12px",
                    },
                  }}
                >
                  <AddPhotoAlternateIcon fontSize="small" />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                      maxWidth: 0,
                      opacity: 0,
                      ml: 0,
                      transition: "all 0.4s ease",
                      overflow: "hidden",
                      "button:hover &": {
                        maxWidth: "100px",
                        opacity: 1,
                        ml: 1,
                      },
                    }}
                  >
                    Add Memory
                  </Typography>
                </Button>

                {/* View Timeline Button - small circle that expands */}
                <Button
                  variant="contained"
                  component={Link}
                  to="/patient/dashboard/timeline"
                  sx={{
                    borderRadius: "50%",
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    padding: 0,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    color: "primary.main",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.4s ease-in-out",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      width: 130,
                      borderRadius: 2,
                      padding: "0 12px",
                      bgcolor: "white",
                    },
                  }}
                >
                  <TimelineIcon fontSize="small" />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                      maxWidth: 0,
                      opacity: 0,
                      ml: 0,
                      transition: "all 0.4s ease-in-out",
                      overflow: "hidden",
                      "button:hover &": {
                        maxWidth: "100px",
                        opacity: 1,
                        ml: 1,
                      },
                      "a:hover &": {
                        maxWidth: "100px",
                        opacity: 1,
                        ml: 1,
                      },
                    }}
                  >
                    View Timeline
                  </Typography>
                </Button>
              </Box>
              <MemoryCarousel memories={memories} />
            </Paper>
          </Box>

          {/* Dashboard Tools Section */}
          <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Dashboard Tools
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 3 },
                width: "100%",
              }}
            >
              {/* Three action cards - vertically stacked */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "column", md: "row" },
                  gap: { xs: 2, sm: 3 },
                  width: "100%",
                  overflowX: "hidden",
                }}
              >
                {/* Saved Locations Card */}
                <Box sx={{ flex: { xs: 1, md: 1 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
                  <SavedLocationsCard />
                </Box>

                {/* Tasks Card */}
                <Box sx={{ flex: { xs: 1, md: 1 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
                  <UpcomingTasksCard isWidget={true} />
                </Box>

                {/* Family Management Card */}
                <Box sx={{ flex: { xs: 1, md: 1 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
                  <FamilyManagementCard onSettingsClick={() => {}} />
                </Box>
              </Box>

              {/* Calendar and Tasks */}
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  minHeight: "400px",
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  overflowX: "hidden",
                }}
              >
                <CalendarAndTasks activeTab={0} showCalendar={true} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 2,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    to="/calendar"
                    sx={{
                      borderRadius: 1,
                      py: 0.75,
                      "&:hover": {
                        color: "primary.main",
                        borderColor: "primary.main",
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    View More
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Quick Actions Section */}
          <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: { xs: "nowrap", sm: "wrap" },
                  gap: 2,
                  width: "100%",
                  maxWidth: "100%",
                  overflowX: "hidden",
                }}
              >
                <Button
                  component={Link}
                  to="/add-memory"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{
                    height: "100%",
                    py: 2,
                    width: { xs: "100%", sm: "calc(50% - 8px)" },
                    mx: { xs: 0, sm: 0 },
                    "&:hover": {
                      color: "primary.main",
                      borderColor: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Add Memory
                </Button>
                <Button
                  onClick={toggleBreathingExercise}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<SpaIcon />}
                  sx={{
                    height: "100%",
                    py: 2,
                    width: { xs: "100%", sm: "calc(50% - 8px)" },
                    mx: { xs: 0, sm: 0 },
                    "&:hover": {
                      color: "secondary.main",
                      borderColor: "secondary.main",
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    },
                  }}
                >
                  Breathing
                </Button>
                <Button
                  component={Link}
                  to="/patient/dashboard/timeline"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<TimelineIcon />}
                  sx={{
                    height: "100%",
                    py: 2,
                    width: { xs: "100%", sm: "calc(50% - 8px)" },
                    mx: { xs: 0, sm: 0 },
                    "&:hover": {
                      color: "primary.main",
                      borderColor: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Timeline
                </Button>
                <Button
                  component={Link}
                  to="/saved-locations"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<LocationOnIcon />}
                  sx={{
                    height: "100%",
                    py: 2,
                    width: { xs: "100%", sm: "calc(50% - 8px)" },
                    mx: { xs: 0, sm: 0 },
                    "&:hover": {
                      color: "secondary.main",
                      borderColor: "secondary.main",
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    },
                  }}
                >
                  Locations
                </Button>
                <Button
                  component={Link}
                  to="/calendar"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<CalendarTodayIcon />}
                  sx={{
                    height: "100%",
                    py: 2,
                    width: { xs: "100%", sm: "calc(50% - 8px)" },
                    mx: { xs: 0, sm: 0 },
                    "&:hover": {
                      color: "primary.main",
                      borderColor: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Calendar
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Recent Memories Section */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              Recent Memories
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: { xs: "none", sm: "translateY(-5px)" },
                  boxShadow: isDarkMode
                    ? "0 12px 20px rgba(0, 0, 0, 0.3)"
                    : "0 12px 20px rgba(0, 0, 0, 0.1)",
                },
                width: "100%",
                maxWidth: "100%",
                minHeight: "280px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  mb: 3,
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  component={Link}
                  to="/patient/dashboard/timeline"
                  sx={{
                    borderRadius: 2,
                    alignSelf: { xs: "flex-start", sm: "flex-start" },
                    ml: { xs: 0, sm: 0 },
                    px: 2,
                    py: 0.75,
                  }}
                >
                  View All
                </Button>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                  width: "100%",
                  height: "100%",
                  minHeight: "200px",
                }}
              >
                {memories?.length > 0 ? (
                  memories.slice(0, 3).map((memory) => (
                    <Card
                      sx={{
                        width: "100%",
                        height: { xs: "auto", md: "220px" },
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: (theme) =>
                            `0 6px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                        },
                      }}
                      onClick={() => handleViewMemory(memory.id)}
                    >
                      {memory.type === "text" ? (
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha("#9c27b0", 0.05),
                            height: { xs: "100px", md: "120px" },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: "8px 8px 0 0",
                          }}
                        >
                          <TextSnippetIcon
                            sx={{
                              fontSize: { xs: 28, sm: 32, md: 36 },
                              color: alpha("#9c27b0", 0.7),
                              mb: 1,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              fontStyle: "italic",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              fontSize: {
                                xs: "0.75rem",
                                sm: "0.8rem",
                                md: "0.85rem",
                              },
                              textAlign: "center",
                              lineHeight: 1.3,
                            }}
                          >
                            "{memory.content}"
                          </Typography>
                        </Box>
                      ) : (
                        <CardMedia
                          component="img"
                          image={memory.content || catImage}
                          alt={memory.title || "Memory"}
                          sx={{
                            height: { xs: "100px", md: "120px" },
                            objectFit: "cover",
                            borderRadius: "8px 8px 0 0",
                          }}
                        />
                      )}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: { xs: 1.5, sm: 2 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: { xs: "80px", md: "100px" },
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{
                              fontSize: {
                                xs: "0.9rem",
                                sm: "1rem",
                                md: "1.05rem",
                              },
                              fontWeight: 600,
                              lineHeight: 1.2,
                              mb: 0.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {memory.title || "Untitled Memory"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                              fontSize: {
                                xs: "0.65rem",
                                sm: "0.7rem",
                                md: "0.75rem",
                              },
                              fontWeight: 500,
                            }}
                          >
                            <CalendarTodayOutlinedIcon
                              fontSize="inherit"
                              sx={{ mr: 0.5 }}
                            />
                            {memory.date || "Unknown Date"}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.8rem",
                            },
                            lineHeight: 1.3,
                          }}
                        >
                          {memory.description || "No description available."}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box
                    sx={{
                      gridColumn: { xs: "1", sm: "1 / -1", md: "1 / -1" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      No memories found.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PatientDashboard;
