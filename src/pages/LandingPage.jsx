import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  Stack,
  Slide,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Logo from '../components/Logo';
import { Footer } from '../components';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [scrollDir, setScrollDir] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  const handlePatientLogin = () => {
    navigate('/patient/login');
  };

  const handleFamilyLogin = () => {
    navigate('/family/login');
  };

  const handlePatientRegister = () => {
    navigate('/patient/register');
  };

  const handleFamilyRegister = () => {
    navigate('/family/register');
  };

  const handlePricingNavigate = () => {
    navigate('/pricing');
  };

  const features = [
    {
      title: 'Memory Recording',
      description:
        'Easily record memories through photos, voice recordings, or text entries.',
      icon: <MemoryIcon fontSize='large' />,
    },
    {
      title: 'Family Connection',
      description:
        'Share memories with family members and caregivers through secure access codes.',
      icon: <PeopleIcon fontSize='large' />,
    },
    {
      title: 'Calming Exercises',
      description:
        'Access breathing exercises and relaxation techniques to reduce anxiety.',
      icon: <SpaIcon fontSize='large' />,
    },
  ];

  const statistics = [
    { value: 'Our Goal', label: '100% user satisfaction' },
    { value: 'Our Mission', label: 'Improve family communication' },
    { value: 'Our Vision', label: 'Enhance memory recall for all' },
  ];

  const testimonials = [
    {
      quote:
        'ReKindle has transformed how we connect with our father. The app makes it easy to share memories and stay connected despite the distance.',
      author: 'Sarah Thompson',
      role: 'Family Member',
    },
    {
      quote:
        'As someone with early-stage dementia, this app has been invaluable for preserving my memories and maintaining independence.',
      author: 'Robert Miller',
      role: 'Patient',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Slide appear={false} direction='down' in={scrollDir === 'up'}>
        <AppBar
          position='fixed'
          color='transparent'
          elevation={0}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid rgba(255, 138, 0, 0.12)`,
          }}>
          <Container maxWidth='lg'>
            <Toolbar
              disableGutters
              sx={{ justifyContent: 'space-between', py: 1 }}>
              {/* Brand Logo/Name */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  transform: 'scale(1.2)',
                  transformOrigin: 'left center',
                  ml: { xs: 2, sm: 0 },
                }}>
                <Logo size='medium' />
              </Box>

              {/* Navigation */}
              <Stack
                direction='row'
                spacing={1}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                }}>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() =>
                    document
                      .getElementById('ourApproach')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    fontWeight: 500,
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                  }}>
                  Our Approach
                </Button>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() =>
                    document
                      .getElementById('features')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    fontWeight: 500,
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                  }}>
                  Features
                </Button>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={handlePricingNavigate}
                  endIcon={<CelebrationIcon />}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                  }}>
                  Pricing
                </Button>
              </Stack>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() =>
                    document
                      .getElementById('howWeWork')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'flex' },
                  }}>
                  How it Works
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handlePatientRegister}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}>
                  Get Started
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          pt: { xs: 12, sm: 14, md: 16 }, // Reduced padding for shorter hero
          pb: { xs: 8, sm: 10, md: 12 }, // Reduced padding for shorter hero
        }}>
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-5%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />

        <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={5} alignItems='center'>
            <Grid item xs={12} sx={{ textAlign: 'center', mx: 'auto' }}>
              <div>
                <Typography
                  component='h1'
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 3,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: '"Playfair Display", serif',
                  }}>
                  Transform Uncertain into{' '}
                  <Box
                    component='span'
                    sx={{
                      color: theme.palette.secondary.light,
                      fontStyle: 'italic',
                      letterSpacing: '0.03em',
                    }}>
                    Undeniable
                  </Box>
                </Typography>

                <Typography
                  variant='h5'
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.4rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: '600px',
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center',
                    mx: 'auto',
                  }}>
                  The ultimate memory preservation platform, making memories
                  last forever.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    justifyContent: 'center',
                  }}>
                  <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={handlePatientRegister}
                    sx={{
                      py: 1.8,
                      px: 3,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: theme.shadows[4],
                      minWidth: '180px',
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s',
                    }}>
                    Get Started
                  </Button>

                  <Button
                    variant='outlined'
                    size='large'
                    onClick={handleFamilyRegister}
                    sx={{
                      py: 1.8,
                      px: 3,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      minWidth: '180px',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      transition: 'all 0.3s',
                    }}>
                    Family Connect
                  </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                    Already have an account?{' '}
                    <Button
                      onClick={handlePatientLogin}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}>
                      Patient Login
                    </Button>{' '}
                    or{' '}
                    <Button
                      onClick={handleFamilyLogin}
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}>
                      Family Login
                    </Button>
                  </Typography>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: 5,
          borderBottom: `1px solid rgba(255, 138, 0, 0.12)`,
          background: theme.palette.background.subtle,
        }}>
        <Container maxWidth='lg'>
          <Grid container spacing={3} justifyContent='center'>
            {statistics.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                    }}>
                    <Typography
                      variant='h4'
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        mb: 1,
                      }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant='h6'
                      color='text.secondary'
                      sx={{
                        fontWeight: 400,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Approach Section */}
      <Box
        id='ourApproach'
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'background.default',
          borderBottom: `1px solid rgba(255, 138, 0, 0.12)`,
        }}>
        <Container maxWidth='lg'>
          <Grid container justifyContent='center'>
            {/* Text content */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}>
              <div>
                <Box
                  sx={{
                    maxWidth: '760px',
                    mx: 'auto',
                    textAlign: 'center',
                  }}>
                  <Typography
                    variant='overline'
                    component='p'
                    sx={{
                      mb: 1.5,
                      color: theme.palette.primary.main,
                      letterSpacing: 2,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      opacity: 0.85,
                    }}>
                    OUR APPROACH
                  </Typography>
                  <Typography
                    variant='h3'
                    component='h2'
                    sx={{
                      mb: 4,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: theme.palette.text.primary,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                    Welcome to the end
                    <br />
                    of forgotten memories
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      mb: 4,
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      maxWidth: '650px',
                      mx: 'auto',
                    }}>
                    As a leading memory-preservation platform, we do everything
                    in our power to help families preserve precious moments
                    through total clarity. We provide intuitive tools that make
                    capturing and accessing memories simple, believing in
                    connection versus distance.
                  </Typography>
                  <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    endIcon={<ArrowForwardIcon />}
                    onClick={handlePatientRegister}
                    sx={{
                      py: 1.5,
                      px: 3.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      background: theme.palette.primary.main,
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(255, 138, 0, 0.3)',
                        transform: 'translateY(-3px)',
                        background: theme.palette.primary.dark,
                      },
                      transition: 'all 0.3s ease',
                    }}>
                    How We Work
                  </Button>
                </Box>
              </div>
            </Grid>

            {/* Services section below */}
            <Grid item xs={12} sx={{ mt: { xs: 8, md: 12 } }}>
              <div>
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
                      title: 'Data-Driven Care',
                      description:
                        'Personalized memory tracking that adapts to individual needs and cognitive patterns.',
                    },
                    {
                      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
                      title: 'Multi-Platform Access',
                      description:
                        'Access memories seamlessly across any device - mobile, tablet, or desktop.',
                    },
                    {
                      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                      title: 'Privacy & Security',
                      description:
                        'End-to-end encryption ensures your personal memories remain private and secure.',
                    },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          height: '100%',
                          borderRadius: 3,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 8px 20px rgba(255, 138, 0, 0.15)',
                          },
                          background:
                            'linear-gradient(135deg, rgba(255, 138, 0, 0.02) 0%, rgba(255, 255, 255, 1) 100%)',
                        }}>
                        <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant='h6'
                          sx={{ mb: 1, fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {item.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id='features'
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: theme.palette.background.subtle,
        }}>
        <Container maxWidth='lg'>
          <Grid container spacing={3} direction='column' alignItems='center'>
            <Grid item xs={12}>
              <div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    maxWidth: '700px',
                    mx: 'auto',
                    mb: 6,
                  }}>
                  <Typography
                    variant='overline'
                    sx={{
                      color: theme.palette.primary.main,
                      letterSpacing: 2,
                      fontWeight: 600,
                    }}>
                    OUR FEATURES
                  </Typography>
                  <Typography
                    variant='h3'
                    component='h2'
                    sx={{
                      mt: 1,
                      mb: 3,
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                    Key Features That Make a Difference
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{
                      fontSize: '1.1rem',
                    }}>
                    Our comprehensive suite of memory preservation tools is
                    designed to support every phase of the memory journey.
                  </Typography>
                </Box>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={4} justifyContent='center'>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(255, 138, 0, 0.1)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 10px 25px rgba(255, 138, 0, 0.2)',
                      },
                      background: 'white',
                      border: '1px solid rgba(255, 138, 0, 0.08)',
                    }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          mb: 3,
                          color: theme.palette.primary.main,
                          display: 'flex',
                          justifyContent: 'center',
                        }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant='h5'
                        component='h3'
                        align='center'
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        align='center'
                        color='text.secondary'
                        sx={{ fontSize: '1rem', lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'background.default',
        }}>
        <Container maxWidth='lg'>
          <Grid container spacing={3} justifyContent='center'>
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
              <div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}>
                <Typography
                  variant='overline'
                  sx={{
                    color: theme.palette.primary.main,
                    letterSpacing: 2,
                    fontWeight: 600,
                  }}>
                  TESTIMONIALS
                </Typography>
                <Typography
                  variant='h3'
                  component='h2'
                  sx={{
                    mt: 1,
                    mb: 2,
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  What Our Users Say
                </Typography>
              </div>
            </Grid>

            <Grid container spacing={4} justifyContent='center'>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(255, 138, 0, 0.08)',
                        background:
                          'linear-gradient(135deg, rgba(255, 138, 0, 0.02) 0%, rgba(255, 255, 255, 1) 100%)',
                        border: '1px solid rgba(255, 138, 0, 0.05)',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(255, 138, 0, 0.12)',
                          transform: 'translateY(-5px)',
                        },
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                      <Box
                        sx={{
                          color: 'rgba(255, 138, 0, 0.07)',
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          transform: 'rotate(180deg)',
                        }}>
                        <FormatQuoteIcon sx={{ fontSize: 120 }} />
                      </Box>
                      <Box
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          textAlign: 'center',
                        }}>
                        <Typography
                          variant='body1'
                          sx={{
                            mb: 3,
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}>
                          "{testimonial.quote}"
                        </Typography>
                        <Divider
                          sx={{
                            mb: 2,
                            borderColor: 'rgba(255, 138, 0, 0.12)',
                            width: '50%',
                            mx: 'auto',
                          }}
                        />
                        <Typography
                          variant='subtitle1'
                          sx={{ fontWeight: 600, textAlign: 'center' }}>
                          {testimonial.author}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ textAlign: 'center' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Paper>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call To Action */}
      <Box
        id='howWeWork'
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}>
        <Container maxWidth='md'>
          <div>
            <Typography
              variant='h3'
              component='h2'
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}>
              Ready to preserve your memories?
            </Typography>
            <Typography
              variant='h6'
              component='p'
              sx={{
                mb: 5,
                maxWidth: '700px',
                mx: 'auto',
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.2rem' },
              }}>
              Join today and start creating a lasting collection of precious
              moments.
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: 3,
                }}>
                <Logo size='large' withLink={false} />
              </Box>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                variant='contained'
                size='large'
                color='secondary'
                onClick={handlePatientRegister}
                sx={{
                  py: 2,
                  px: 5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(255, 189, 0, 0.3)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(255, 189, 0, 0.4)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s',
                }}>
                Get Started Now
              </Button>
              <Button
                variant='outlined'
                size='large'
                onClick={handleFamilyRegister}
                sx={{
                  py: 2,
                  px: 5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s',
                }}>
                Learn More
              </Button>
            </Box>
          </div>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
