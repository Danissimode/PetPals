import { useState, useEffect, useCallback } from 'react';

// Types for search results
export type SearchResultType = 'pet' | 'expert' | 'service' | 'lost' | 'people';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  image?: string;
  location?: string;
  price?: string;
  rating?: number;
  distance?: string;
  reward?: string;
  available?: boolean;
}

// Combine all mock data
const ALL_DATA: SearchResult[] = [
  // People
  {
    id: 'person-1',
    type: 'people',
    title: 'Emma Wilson',
    subtitle: 'Pet Trainer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    location: 'Brooklyn, NY',
    rating: 4.9,
  },
  {
    id: 'person-2',
    type: 'people',
    title: 'Michael Chen',
    subtitle: 'Dog Walker',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    location: 'Manhattan, NY',
    rating: 4.7,
  },
  // Lost Pets
  {
    id: 'lost-1',
    type: 'lost',
    title: 'Charlie',
    subtitle: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    location: 'Central Park, New York',
    distance: '0.8 miles away',
    reward: '$500',
  },
  // Experts
  {
    id: 'expert-1',
    type: 'expert',
    title: 'Dr. Sarah Johnson',
    subtitle: 'Veterinarian',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    price: '$50/consultation',
    rating: 4.9,
    available: true,
  },
  // Services
  {
    id: 'service-1',
    type: 'service',
    title: 'Pet Grooming',
    subtitle: 'Professional grooming services',
    price: 'From $40',
    rating: 4.8,
  },
];

// Popular search suggestions
const POPULAR_SEARCHES = [
  'Lost pets nearby',
  'Veterinarian',
  'Dog grooming',
  'Pet sitter',
  'Dog trainer',
];

export function useSearch() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchResultType | 'all'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search function
  const search = useCallback((searchQuery: string, filter: SearchResultType | 'all') => {
    setIsLoading(true);
    
    try {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      
      let filtered = ALL_DATA.filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(normalizedQuery) ||
          (item.subtitle?.toLowerCase().includes(normalizedQuery)) ||
          (item.location?.toLowerCase().includes(normalizedQuery));
          
        const matchesFilter = filter === 'all' || item.type === filter;
        
        return matchesQuery && matchesFilter;
      });

      setResults(filtered);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = POPULAR_SEARCHES.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Perform search when query or filter changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query) {
        search(query, activeFilter);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, activeFilter, search]);

  const addToRecentSearches = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setRecentSearches(prev => 
        [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5)
      );
    }
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    suggestions,
    recentSearches,
    activeFilter,
    setActiveFilter,
    addToRecentSearches,
  };
}
