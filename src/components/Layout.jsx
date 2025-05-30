import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Container,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  useResponsive,
  commonResponsiveStyles,
} from '../styles/responsiveStyles';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import Logo from './Logo';

const drawerWidth = 260;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1.5),
  height: 60,
  width: '100%',
  maxWidth: '100vw',
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    height: 65,
    padding: theme.spacing(0, 3),
  },
}));

const StyledAppBar = styled(AppBar)(({ theme, visible }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.9)
      : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: visible
    ? theme.palette.mode === 'dark'
      ? '0 1px 8px 0 rgba(0, 0, 0, 0.3)'
      : '0 1px 8px 0 rgba(0, 0, 0, 0.15)'
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : theme.palette.text.primary,
  borderBottom: `1px solid ${visible ? theme.palette.divider : 'transparent'}`,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  maxWidth: '100vw',
  overflowX: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: visible ? 'translateY(0)' : 'translateY(-100%)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    border: 'none',
    background:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.95)
        : alpha(theme.palette.background.paper, 0.95),
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 0 20px rgba(0, 0, 0, 0.2)'
        : '0 0 20px rgba(0, 0, 0, 0.05)',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.4),
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
}));

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.25, 1),
  margin: theme.spacing(0.25, 1),
  borderRadius: theme.shape.borderRadius,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(0.8, 1.8),
  transition: 'all 0.3s ease',
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.12)
    : 'transparent',
  '&:hover': {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.18)
      : alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-2px)',
    boxShadow: active ? '0 4px 8px rgba(0, 0, 0, 0.05)' : 'none',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, active }) => ({
  minWidth: 40,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
}));

const StyledListItemText = styled(ListItemText)(({ theme, active }) => ({
  '& .MuiTypography-root': {
    fontWeight: active ? 600 : 400,
    fontSize: '0.95rem',
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

const NavSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.75, 1),
  marginBottom: theme.spacing(0.5),
  '& .MuiTypography-root': {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

const Layout = () => {
  const muiTheme = useMuiTheme();
  const { mode, toggleTheme } = useTheme();
  const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSidePanelLogo, setShowSidePanelLogo] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Control header visibility on scroll
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      // Only trigger header change if scroll amount is significant
      if (scrollDifference < 10) return;

      if (currentScrollY < 30) {
        // Always show header near the top of the page
        setHeaderVisible(true);
        setShowSidePanelLogo(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header and show side panel logo
        setHeaderVisible(false);
        setShowSidePanelLogo(true);
      } else {
        // Scrolling up - show header
        setHeaderVisible(true);
        // Keep side panel logo visible when scrolling up unless at the top
        setShowSidePanelLogo(currentScrollY > 100);
      }

      setLastScrollY(currentScrollY);
    };

    const throttledControlHeader = () => {
      // Throttle the scroll events for better performance
      if (!window.headerScrollTimeout) {
        window.headerScrollTimeout = setTimeout(() => {
          controlHeader();
          window.headerScrollTimeout = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledControlHeader);

    return () => {
      window.removeEventListener('scroll', throttledControlHeader);
      clearTimeout(window.headerScrollTimeout);
      window.headerScrollTimeout = null;
    };
  }, [lastScrollY]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseDrawer = () => {
    if (isMobile || isTablet) {
      setMobileOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const userType = user?.type || 'patient';
  const isPatient = userType === 'patient';

  const navigationItems = [
    {
      text: isPatient ? 'Dashboard' : 'Family Dashboard',
      icon: <HomeOutlinedIcon />,
      path: isPatient ? '/patient/dashboard' : '/family/dashboard',
    },
    {
      text: 'Timeline',
      icon: <TimelineOutlinedIcon />,
      path: isPatient
        ? '/patient/dashboard/timeline'
        : '/family/dashboard/timeline',
    },
    {
      text: 'Calendar & Tasks',
      icon: <CalendarTodayOutlinedIcon />,
      path: '/calendar',
    },
    {
      text: 'Add Memory',
      icon: <AddPhotoAlternateOutlinedIcon />,
      path: '/add-memory',
    },
    {
      text: 'Saved Locations',
      icon: <LocationOnOutlinedIcon />,
      path: '/saved-locations',
    },
    {
      text: 'Breathing Exercise',
      icon: <SpaOutlinedIcon />,
      path: '/breathing-game',
    },
    {
      text: 'Help Center',
      icon: <HelpOutlineOutlinedIcon />,
      path: '/help',
    },
    {
      text: 'Settings',
      icon: <SettingsOutlinedIcon />,
      path: '/settings',
    },
  ];

  const drawer = (
    <Box
      sx={{
        mt: { xs: 0, md: 5 },
        py: 0.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box sx={{ px: 3, mb: 1, display: { xs: 'block', md: 'none' } }}>
        <Box
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Logo size='medium' withLink={true} />
        </Box>
      </Box>

      {/* Main Navigation */}
      <NavSection>
        {showSidePanelLogo ? (
          <Box sx={{ px: 2, mb: 0, mt: -4 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}>
              <Logo size='medium' withLink={true} />
            </motion.div>
          </Box>
        ) : null}
      </NavSection>

      <List component='nav' sx={{ px: 1 }}>
        {navigationItems.slice(0, 3).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <StyledListItem key={item.text} disablePadding>
              <StyledListItemButton
                component={RouterLink}
                to={item.path}
                onClick={handleCloseDrawer}
                active={isActive ? 1 : 0}>
                <StyledListItemIcon active={isActive ? 1 : 0}>
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                  active={isActive ? 1 : 0}
                  primary={item.text}
                />
              </StyledListItemButton>
            </StyledListItem>
          );
        })}
      </List>

      {/* Support Features */}
      <NavSection>
        <Typography sx={{ px: 3, mb: 0.5 }}>Support</Typography>
      </NavSection>

      <List component='nav' sx={{ px: 1 }}>
        {navigationItems.slice(3).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <StyledListItem key={item.text} disablePadding>
              <StyledListItemButton
                component={RouterLink}
                to={item.path}
                onClick={handleCloseDrawer}
                active={isActive ? 1 : 0}>
                <StyledListItemIcon active={isActive ? 1 : 0}>
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                  active={isActive ? 1 : 0}
                  primary={item.text}
                />
              </StyledListItemButton>
            </StyledListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', px: 3, pb: 2 }}>
        <Divider sx={{ my: 1, opacity: 0.6 }} />
        {user && (
          <Box
            component={RouterLink}
            to='/settings'
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.08),
              },
            }}>
            <Avatar
              sx={{
                bgcolor: muiTheme.palette.primary.main,
                mr: 2,
                width: 40,
                height: 40,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant='subtitle2' noWrap sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant='caption' color='text.secondary' noWrap>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
        )}
        <Button
          fullWidth
          variant='outlined'
          color='primary'
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            borderRadius: 3,
            mt: 1,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}>
      <CssBaseline />
      <StyledAppBar
        visible={headerVisible}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
        <StyledToolbar>
          <StyledLogoContainer>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 0.5, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                color: mode === 'dark' ? 'primary.main' : 'inherit',
                '&:hover': {
                  opacity: 0.85,
                },
                transform: { xs: 'scale(0.9)', sm: 'scale(1)' },
                transformOrigin: 'left center',
                mx: { xs: 0, sm: 0 },
                overflow: 'hidden',
                marginLeft: { xs: 0, sm: 0.5 },
                flexShrink: 1,
              }}>
              <Logo size={isMobile ? 'small' : 'medium'} withLink={true} />
            </Box>
          </StyledLogoContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* Theme Toggle */}
            <Tooltip
              title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
              <IconButton
                onClick={toggleTheme}
                color='inherit'
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  color: mode === 'dark' ? 'primary.main' : 'text.secondary',
                  padding: { xs: 0.5, sm: 1 },
                }}>
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon
                    fontSize={isMobile ? 'small' : 'medium'}
                  />
                ) : (
                  <DarkModeOutlinedIcon
                    fontSize={isMobile ? 'small' : 'medium'}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title='Add Memory'>
              <IconButton
                component={RouterLink}
                to='/add-memory'
                color='primary'
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                  padding: { xs: 0.5, sm: 0.8 },
                  mr: { xs: 0.5, sm: 1 },
                }}>
                <AddPhotoAlternateOutlinedIcon
                  fontSize={isMobile ? 'small' : 'medium'}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title='Account settings'>
              <IconButton
                onClick={handleMenuOpen}
                size='small'
                sx={{
                  ml: { xs: 0, sm: 1 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  },
                }}
                aria-controls={anchorEl ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={anchorEl ? 'true' : undefined}>
                <Avatar
                  sx={{
                    width: isMobile ? 30 : 36,
                    height: isMobile ? 30 : 36,
                    bgcolor: (theme) => theme.palette.primary.main,
                    fontSize: isMobile ? '0.8rem' : '1rem',
                    fontWeight: 600,
                  }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id='account-menu'
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: {
                overflow: 'visible',
                borderRadius: 2,
                mt: 1.5,
                width: { xs: 180, sm: 220 },
                maxWidth: '95vw',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}>
            <Box sx={{ pt: 2, pb: 1, px: 2 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              component={RouterLink}
              to='/settings'
              onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonOutlineIcon fontSize='small' />
              </ListItemIcon>
              <Typography variant='body2'>Account Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize='small' />
              </ListItemIcon>
              <Typography variant='body2'>Logout</Typography>
            </MenuItem>
          </Menu>
        </StyledToolbar>
      </StyledAppBar>
      <Box component='nav' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        {isMobile || isTablet ? (
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                mt: '65px',
                top: 0,
                height: 'calc(100% - 65px)',
              },
            }}>
            {drawer}
          </Drawer>
        ) : (
          <StyledDrawer
            variant='permanent'
            sx={{ display: { xs: 'none', md: 'block' } }}
            open>
            {drawer}
          </StyledDrawer>
        )}
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          pt: { xs: '70px', sm: '75px' },
          transition: 'padding-top 0.3s ease',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          ...commonResponsiveStyles.container,
        }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ minHeight: '100%' }}>
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;
