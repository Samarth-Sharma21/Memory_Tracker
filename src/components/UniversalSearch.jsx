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
  Divider,
  CircularProgress,
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
import { 
  getComprehensiveScore, 
  sortByRelevance, 
  highlightMatches,
  getSearchSuggestions 
} from '../utils/searchUtils';

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
  const [suggestions, setSuggestions] = useState([]);
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
  const searchTimeoutRef = useRef(null);

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

        // Determine actual user ID for data fetching
        let actualUserId = currentUser.id;
        
        // If user is a family member, get patient ID
        if (user?.type === 'family') {
          try {
            const { data: familyData, error: familyError } = await supabase
              .from('family_members')
              .select('patient_id')
              .eq('id', currentUser.id)
              .single();
            
            if (!familyError && familyData) {
              actualUserId = familyData.patient_id;
            }
          } catch (error) {
            console.log('Family member lookup failed, using current user ID');
          }
        }

        // Load memories
        const { data: memories } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', actualUserId)
          .order('date', { ascending: false });

        // Load locations - FIX THE TABLE NAME
        const { data: locations } = await supabase
          .from('saved_locations')  // Fixed table name from 'locations' to 'saved_locations'
          .select('*')
          .eq('user_id', actualUserId);

        // Load tasks
        let tasks = [];
        try {
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', actualUserId);
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

  // Enhanced search function with fuzzy matching and semantic understanding
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setShowResults(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to improve performance
    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 200);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, allData]);

  const performSearch = () => {
    setIsSearching(true);
    const term = searchTerm.trim();
    const results = [];

    // Search memories with comprehensive scoring
    allData.memories.forEach(memory => {
      const score = getComprehensiveScore(term, memory, [
        'title', 'description', 'content', 'location', 'people'
      ]);

      if (score > 0.2) { // Threshold for relevance
        results.push({
          id: memory.id,
          title: memory.title || 'Untitled Memory',
          subtitle: memory.description || memory.content?.substring(0, 50) + '...' || '',
          type: 'memory',
          subtype: memory.type || 'photo',
          date: memory.date,
          icon: getMemoryIcon(memory.type),
          image: memory.type === 'photo' ? memory.content : null,
          score: score,
          onClick: () => navigate(`/memory/${memory.id}`)
        });
      }
    });

    // Search locations with comprehensive scoring
    allData.locations.forEach(location => {
      const score = getComprehensiveScore(term, location, [
        'name', 'address', 'notes'
      ]);

      if (score > 0.2) {
        results.push({
          id: location.id,
          title: location.name,
          subtitle: location.address,
          type: 'location',
          icon: <LocationOnIcon />,
          score: score,
          onClick: () => navigate('/saved-locations')
        });
      }
    });

    // Search tasks with comprehensive scoring
    allData.tasks.forEach(task => {
      const score = getComprehensiveScore(term, task, [
        'title', 'description'
      ]);

      if (score > 0.2) {
        results.push({
          id: task.id,
          title: task.title,
          subtitle: task.description || 'Task',
          type: 'task',
          date: task.date,
          icon: <TaskIcon />,
          score: score,
          onClick: () => navigate('/task-manager')
        });
      }
    });

    // Search people with comprehensive scoring
    allData.people.forEach(person => {
      const score = getComprehensiveScore(term, person, ['name']);

      if (score > 0.2) {
        results.push({
          id: person.id,
          title: person.name,
          subtitle: 'Person',
          type: 'person',
          icon: <PeopleIcon />,
          score: score,
          onClick: () => navigate('/patient/dashboard/timeline')
        });
      }
    });

    // Sort results by relevance using advanced sorting
    const sortedResults = sortByRelevance(results, term);

    setSearchResults(sortedResults.slice(0, 8)); // Limit to 8 results
    setSuggestions(getSearchSuggestions(term, allData));
    setShowResults(sortedResults.length > 0 || suggestions.length > 0);
    setIsSearching(false);
  };

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
    if (searchTerm && (searchResults.length > 0 || suggestions.length > 0)) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    if (onSearchBlur) onSearchBlur();
    // Don't hide results immediately to allow clicking
    setTimeout(() => setShowResults(false), 300);
  };

  const handleResultClick = (result) => {
    setSearchTerm('');
    setShowResults(false);
    result.onClick();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowResults(false);
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
                {isSearching ? (
                  <CircularProgress size={20} sx={{ color: 'text.secondary' }} />
                ) : (
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                )}
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
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <>
                    <ListItem sx={{ py: 1, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                        Suggestions
                      </Typography>
                    </ListItem>
                    {suggestions.map((suggestion, index) => (
                      <ListItem key={`suggestion-${index}`} disablePadding>
                        <ListItemButton
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            py: 1,
                            px: 2,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.secondary.main, 0.08),
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {suggestion}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    {searchResults.length > 0 && <Divider />}
                  </>
                )}

                {/* Search Results */}
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
                            <Typography 
                              variant="body2" 
                              sx={{ fontWeight: 500 }}
                              dangerouslySetInnerHTML={{
                                __html: highlightMatches(result.title, searchTerm)
                              }}
                            />
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
                            <Chip
                              label={`${Math.round(result.score * 100)}%`}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                borderColor: alpha(theme.palette.text.secondary, 0.3),
                                color: 'text.secondary',
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
                            dangerouslySetInnerHTML={{
                              __html: highlightMatches(result.subtitle, searchTerm)
                            }}
                          />
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

                {searchResults.length === 0 && suggestions.length === 0 && searchTerm && !isSearching && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" align="center">
                          No results found for "{searchTerm}"
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" align="center">
                          Try different keywords or check spelling
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