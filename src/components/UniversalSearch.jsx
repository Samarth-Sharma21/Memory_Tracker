import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  InputAdornment,
  Popper,
  ClickAwayListener,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PhotoIcon from '@mui/icons-material/Photo';
import MicIcon from '@mui/icons-material/Mic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { supabase } from '../backend/server';
import { useAuth } from '../contexts/AuthContext';

const UniversalSearch = ({ 
  isFullWidth = false, 
  placeholder = "Search memories, tasks, people, or locations...",
  onSearchFocus,
  onSearchBlur 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allData, setAllData] = useState({
    memories: [],
    locations: [],
    tasks: [],
    people: []
  });
  
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchRef = useRef(null);
  const anchorRef = useRef(null);

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          // Load from localStorage as fallback
          loadLocalData();
          return;
        }

        // Load memories
        const { data: memories } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('date', { ascending: false });

        // Load locations
        const { data: locations } = await supabase
          .from('locations')
          .select('*')
          .eq('user_id', currentUser.id);

        // Load tasks (assuming tasks table exists)
        let tasks = [];
        try {
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id);
          tasks = tasksData || [];
        } catch (error) {
          console.log('Tasks table not available, using local storage');
          tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        }

        // Extract people from memories
        const people = new Set();
        memories?.forEach(memory => {
          if (memory.people && Array.isArray(memory.people)) {
            memory.people.forEach(person => people.add(person));
          }
        });

        setAllData({
          memories: memories || [],
          locations: locations || [],
          tasks: tasks,
          people: Array.from(people).map(name => ({ name, id: name }))
        });

      } catch (error) {
        console.error('Error loading search data:', error);
        loadLocalData();
      }
    };

    const loadLocalData = () => {
      const memories = JSON.parse(localStorage.getItem('memories') || '[]');
      const locations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      
      const people = new Set();
      memories.forEach(memory => {
        if (memory.people && Array.isArray(memory.people)) {
          memory.people.forEach(person => people.add(person));
        }
      });

      setAllData({
        memories,
        locations,
        tasks,
        people: Array.from(people).map(name => ({ name, id: name }))
      });
    };

    loadAllData();
  }, [user]);

  // Search function with instant filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const term = searchTerm.toLowerCase();
    const results = [];

    // Search memories
    allData.memories.forEach(memory => {
      const matchesTitle = memory.title?.toLowerCase().includes(term);
      const matchesDescription = memory.description?.toLowerCase().includes(term);
      const matchesContent = memory.content?.toLowerCase().includes(term);
      const matchesPeople = memory.people?.some(person => 
        person.toLowerCase().includes(term)
      );
      const matchesLocation = memory.location?.toLowerCase().includes(term);

      if (matchesTitle || matchesDescription || matchesContent || matchesPeople || matchesLocation) {
        results.push({
          id: memory.id,
          title: memory.title || 'Untitled Memory',
          subtitle: memory.description || memory.content?.substring(0, 50) + '...' || '',
          type: 'memory',
          subtype: memory.type || 'photo',
          date: memory.date,
          icon: getMemoryIcon(memory.type),
          image: memory.type === 'photo' ? memory.content : null,
          onClick: () => navigate(`/memory/${memory.id}`)
        });
      }
    });

    // Search locations
    allData.locations.forEach(location => {
      const matchesName = location.name?.toLowerCase().includes(term);
      const matchesAddress = location.address?.toLowerCase().includes(term);
      const matchesNotes = location.notes?.toLowerCase().includes(term);

      if (matchesName || matchesAddress || matchesNotes) {
        results.push({
          id: location.id,
          title: location.name,
          subtitle: location.address,
          type: 'location',
          icon: <LocationOnIcon />,
          onClick: () => navigate('/saved-locations')
        });
      }
    });

    // Search tasks
    allData.tasks.forEach(task => {
      const matchesTitle = task.title?.toLowerCase().includes(term);
      const matchesDescription = task.description?.toLowerCase().includes(term);

      if (matchesTitle || matchesDescription) {
        results.push({
          id: task.id,
          title: task.title,
          subtitle: task.description || 'Task',
          type: 'task',
          date: task.date,
          icon: <TaskIcon />,
          onClick: () => navigate('/task-manager')
        });
      }
    });

    // Search people
    allData.people.forEach(person => {
      if (person.name.toLowerCase().includes(term)) {
        results.push({
          id: person.id,
          title: person.name,
          subtitle: 'Person',
          type: 'person',
          icon: <PeopleIcon />,
          onClick: () => navigate('/patient/dashboard/timeline') // Navigate to timeline to see memories with this person
        });
      }
    });

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === term;
      const bExact = b.title.toLowerCase() === term;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowResults(results.length > 0);
    setIsSearching(false);
  }, [searchTerm, allData, navigate]);

  const getMemoryIcon = (type) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon />;
      case 'voice':
        return <MicIcon />;
      case 'text':
        return <TextSnippetIcon />;
      default:
        return <PhotoIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'memory':
        return theme.palette.primary.main;
      case 'location':
        return theme.palette.secondary.main;
      case 'task':
        return theme.palette.success.main;
      case 'person':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFocus = () => {
    if (onSearchFocus) onSearchFocus();
    if (searchTerm && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    if (onSearchBlur) onSearchBlur();
    // Don't hide results immediately to allow clicking
    setTimeout(() => setShowResults(false), 200);
  };

  const handleResultClick = (result) => {
    setSearchTerm('');
    setShowResults(false);
    result.onClick();
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        ref={anchorRef}
        sx={{ 
          position: 'relative',
          width: isFullWidth ? '100%' : { xs: '100%', sm: 400, md: 500 },
          maxWidth: '100%'
        }}
      >
        <TextField
          ref={searchRef}
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.3),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              transition: 'all 0.3s ease',
            }
          }}
        />

        {showResults && (
          <Popper
            open={showResults}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
          >
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 400,
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.95)
                  : 'background.paper',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <List dense sx={{ py: 0 }}>
                {searchResults.map((result, index) => (
                  <ListItem key={`${result.type}-${result.id}-${index}`} disablePadding>
                    <ListItemButton
                      onClick={() => handleResultClick(result)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {result.image ? (
                          <Avatar
                            src={result.image}
                            sx={{ 
                              width: 32, 
                              height: 32,
                              borderRadius: 1,
                            }}
                          >
                            {result.icon}
                          </Avatar>
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: alpha(getTypeColor(result.type), 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: getTypeColor(result.type),
                            }}
                          >
                            {result.icon}
                          </Box>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {result.title}
                            </Typography>
                            <Chip
                              label={result.type}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: alpha(getTypeColor(result.type), 0.1),
                                color: getTypeColor(result.type),
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {result.subtitle}
                            {result.date && ` • ${new Date(result.date).toLocaleDateString()}`}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
                {searchResults.length === 0 && searchTerm && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" align="center">
                          No results found for "{searchTerm}"
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default UniversalSearch;