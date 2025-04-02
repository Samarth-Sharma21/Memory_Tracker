import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAuth } from '../contexts/AuthContext';

const FamilyRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    groupCode: '',
    relationship: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value,
    });
  };

  const handleTogglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.groupCode ||
      !formData.relationship
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // In a real app, we would verify the group code and register with a backend
    // For demo purposes, just log in the family member
    const userData = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      groupCode: formData.groupCode,
      relationship: formData.relationship,
      // Other family member data
    };

    login('family', userData);
    // Navigate to dashboard after successful registration
    navigate('/family/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}>
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Button
            component={Link}
            to='/'
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 4 }}>
            Back to Home
          </Button>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                <PeopleAltIcon color='primary' sx={{ fontSize: 60, mb: 2 }} />
              </motion.div>
              <Typography
                variant='h4'
                component='h1'
                gutterBottom
                sx={{
                  mb: 2,
                  textAlign: 'center',
                }}>
                <span
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 800,
                  }}>
                  Memo
                </span>
                <span
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                  }}>
                  Bloom
                </span>
              </Typography>
              <Typography variant='h5' gutterBottom sx={{ fontWeight: 500 }}>
                Family Member Registration
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                align='center'
                sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                Join your loved one's memory journey. Enter your details and the
                group code they provided.
              </Typography>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Full Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Mobile Number'
                name='mobile'
                value={formData.mobile}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                placeholder='e.g. 9876543210'
                InputProps={{
                  sx: { borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PhoneIcon color='action' />
                    </InputAdornment>
                  ),
                }}
                helperText="Enter a 10-digit Indian mobile number"
              />

              <TextField
                fullWidth
                label='Email Address'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Relationship to Patient'
                name='relationship'
                value={formData.relationship}
                onChange={handleInputChange}
                placeholder='e.g. Daughter, Son, Spouse'
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Group Code'
                name='groupCode'
                value={formData.groupCode}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                helperText='Enter the group code provided by the patient'
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleTogglePassword('password')}
                        edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label='Confirm Password'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin='normal'
                variant='outlined'
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => handleTogglePassword('confirm')}
                        edge='end'>
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name='agreeTerms'
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    color='primary'
                  />
                }
                label={
                  <Typography variant='body2'>
                    I agree to the{' '}
                    <Link
                      to='/terms'
                      style={{ color: 'inherit', fontWeight: 'bold' }}>
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                size='large'
                sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', mb: 2 }}>
                Register
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>
                Already have an account?{' '}
                <Link
                  to='/family/login'
                  style={{ color: 'inherit', fontWeight: 'bold' }}>
                  Log in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FamilyRegister;
