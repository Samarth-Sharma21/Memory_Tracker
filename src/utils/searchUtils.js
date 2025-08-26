/**
 * Fuzzy Semantic Search Utilities
 * Implements advanced text matching with semantic understanding and fuzzy matching
 */

/**
 * Calculate Levenshtein distance between two strings
 */
export const getLevenshteinDistance = (str1, str2) => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize the matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len2][len1];
};

/**
 * Calculate fuzzy match score (0-1, higher is better)
 */
export const getFuzzyScore = (query, target) => {
  if (!query || !target) return 0;
  
  const queryLower = query.toLowerCase().trim();
  const targetLower = target.toLowerCase().trim();
  
  // Exact match gets highest score
  if (queryLower === targetLower) return 1;
  
  // Contains match gets high score
  if (targetLower.includes(queryLower)) {
    return 0.9 - (targetLower.length - queryLower.length) / targetLower.length * 0.2;
  }
  
  // Calculate Levenshtein distance for fuzzy matching
  const distance = getLevenshteinDistance(queryLower, targetLower);
  const maxLength = Math.max(queryLower.length, targetLower.length);
  
  // Normalize the score (0-1)
  const score = 1 - distance / maxLength;
  
  // Only return scores above threshold to avoid too many irrelevant results
  return score > 0.4 ? score : 0;
};

/**
 * Extract keywords and synonyms for semantic matching
 */
export const getSemanticKeywords = (text) => {
  if (!text) return [];
  
  // Common semantic mappings for memory-related terms
  const semanticMap = {
    'home': ['house', 'residence', 'place', 'apartment', 'condo'],
    'family': ['relatives', 'parents', 'siblings', 'children', 'spouse'],
    'vacation': ['holiday', 'trip', 'travel', 'journey', 'getaway'],
    'birthday': ['anniversary', 'celebration', 'party', 'special day'],
    'work': ['job', 'office', 'career', 'employment', 'workplace'],
    'school': ['education', 'university', 'college', 'academy', 'learning'],
    'hospital': ['medical', 'clinic', 'doctor', 'health', 'treatment'],
    'restaurant': ['dining', 'food', 'meal', 'cafe', 'eatery'],
    'park': ['garden', 'outdoor', 'nature', 'recreation', 'green space'],
    'beach': ['ocean', 'sea', 'shore', 'coast', 'waterfront'],
    'wedding': ['marriage', 'ceremony', 'celebration', 'union'],
    'graduation': ['achievement', 'completion', 'milestone', 'success']
  };
  
  const words = text.toLowerCase().split(/\s+/);
  const keywords = new Set(words);
  
  // Add semantic synonyms
  words.forEach(word => {
    if (semanticMap[word]) {
      semanticMap[word].forEach(synonym => keywords.add(synonym));
    }
    
    // Also check if word is a synonym of any key
    Object.entries(semanticMap).forEach(([key, synonyms]) => {
      if (synonyms.includes(word)) {
        keywords.add(key);
        synonyms.forEach(s => keywords.add(s));
      }
    });
  });
  
  return Array.from(keywords);
};

/**
 * Calculate semantic similarity score
 */
export const getSemanticScore = (query, target) => {
  if (!query || !target) return 0;
  
  const queryKeywords = getSemanticKeywords(query);
  const targetKeywords = getSemanticKeywords(target);
  
  if (queryKeywords.length === 0 || targetKeywords.length === 0) return 0;
  
  // Calculate Jaccard similarity
  const intersection = queryKeywords.filter(word => 
    targetKeywords.some(targetWord => 
      targetWord.includes(word) || word.includes(targetWord)
    )
  );
  
  const union = new Set([...queryKeywords, ...targetKeywords]);
  
  return intersection.length / union.size;
};

/**
 * Comprehensive search scoring that combines fuzzy and semantic matching
 */
export const getComprehensiveScore = (query, item, fields = []) => {
  if (!query || !item) return 0;
  
  let maxScore = 0;
  let hasExactMatch = false;
  
  // Default fields to search if none specified
  const searchFields = fields.length > 0 ? fields : Object.keys(item);
  
  searchFields.forEach(field => {
    if (item[field] && typeof item[field] === 'string') {
      const fieldValue = item[field];
      
      // Check for exact phrase match first
      if (fieldValue.toLowerCase().includes(query.toLowerCase())) {
        hasExactMatch = true;
      }
      
      // Calculate fuzzy score
      const fuzzyScore = getFuzzyScore(query, fieldValue);
      
      // Calculate semantic score
      const semanticScore = getSemanticScore(query, fieldValue);
      
      // Combine scores with weights
      const combinedScore = (fuzzyScore * 0.7) + (semanticScore * 0.3);
      
      maxScore = Math.max(maxScore, combinedScore);
    }
    
    // Handle array fields (like people)
    if (Array.isArray(item[field])) {
      item[field].forEach(arrayItem => {
        if (typeof arrayItem === 'string') {
          const fuzzyScore = getFuzzyScore(query, arrayItem);
          const semanticScore = getSemanticScore(query, arrayItem);
          const combinedScore = (fuzzyScore * 0.7) + (semanticScore * 0.3);
          maxScore = Math.max(maxScore, combinedScore);
          
          if (arrayItem.toLowerCase().includes(query.toLowerCase())) {
            hasExactMatch = true;
          }
        }
      });
    }
  });
  
  // Boost exact matches
  if (hasExactMatch) {
    maxScore = Math.min(1, maxScore + 0.2);
  }
  
  return maxScore;
};

/**
 * Sort search results by relevance
 */
export const sortByRelevance = (results, query) => {
  return results.sort((a, b) => {
    // Exact title matches first
    const aExactTitle = a.title?.toLowerCase() === query.toLowerCase();
    const bExactTitle = b.title?.toLowerCase() === query.toLowerCase();
    
    if (aExactTitle && !bExactTitle) return -1;
    if (!aExactTitle && bExactTitle) return 1;
    
    // Then by comprehensive score
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    
    // Then by type priority (memories > locations > tasks > people)
    const typePriority = { memory: 4, location: 3, task: 2, person: 1 };
    const aPriority = typePriority[a.type] || 0;
    const bPriority = typePriority[b.type] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Finally by date (newer first)
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    
    return 0;
  });
};

/**
 * Highlight matching text in search results
 */
export const highlightMatches = (text, query) => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Get search suggestions based on input
 */
export const getSearchSuggestions = (query, allData) => {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set();
  
  // Add title suggestions from memories
  allData.memories?.forEach(memory => {
    if (memory.title && memory.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(memory.title);
    }
  });
  
  // Add location suggestions
  allData.locations?.forEach(location => {
    if (location.name && location.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(location.name);
    }
  });
  
  // Add people suggestions
  allData.people?.forEach(person => {
    if (person.name && person.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(person.name);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
};