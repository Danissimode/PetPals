import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { Search as SearchIcon, X, History, MapPin } from 'lucide-react-native';
import { useSearch, SearchResult, SearchResultType } from '@/hooks/useSearch';

const FILTER_OPTIONS: { type: SearchResultType | 'all'; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'people', label: 'People' },
  { type: 'lost', label: 'Lost Pets' },
  { type: 'expert', label: 'Experts' },
  { type: 'service', label: 'Services' },
];

export default function SearchScreen() {
  const {
    query,
    setQuery,
    results,
    isLoading,
    suggestions,
    recentSearches,
    activeFilter,
    setActiveFilter,
    addToRecentSearches,
  } = useSearch();

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    addToRecentSearches(searchQuery);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultItem}>
      {item.image && (
        <View style={styles.resultImageContainer}>
          <Image source={{ uri: item.image }} style={styles.resultImage} />
          {item.type === 'lost' && item.reward && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>Urgent</Text>
            </View>
          )}
          {item.type === 'expert' && item.available !== undefined && (
            <View style={[
              styles.availabilityBadge,
              item.available ? styles.availableBadge : styles.unavailableBadge
            ]}>
              <Text style={styles.availabilityText}>
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
        )}
        {item.location && (
          <View style={styles.locationContainer}>
            <MapPin size={12} color="#8E8E93" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        <View style={styles.resultMeta}>
          {item.price && (
            <Text style={styles.priceText}>{item.price}</Text>
          )}
          {item.rating && (
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          )}
          {item.distance && (
            <Text style={styles.distanceText}>{item.distance}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#FF9F1C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pets, services, experts..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={20} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.filterOption,
              activeFilter === option.type && styles.activeFilterOption,
            ]}
            onPress={() => setActiveFilter(option.type)}>
            <Text
              style={[
                styles.filterText,
                option.type === 'all' && styles.allFilterText,
                activeFilter === option.type && styles.activeFilterText,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FF9F1C" />
        </View>
      ) : query ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView style={styles.content}>
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSearch(suggestion)}>
                  <SearchIcon size={16} color="#8E8E93" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleSearch(search)}>
                  <History size={16} color="#8E8E93" />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F2F2F7',
  },
  activeFilterOption: {
    backgroundColor: '#FF9F1C',
  },
  filterText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  allFilterText: {
    color: '#FF9F1C',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  suggestionsContainer: {
    padding: 16,
  },
  recentSearchesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultContent: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
  ratingText: {
    fontSize: 14,
    color: '#333333',
  },
  distanceText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  rewardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9F1C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    color: '#FF9F1C',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#4CD964',
  },
  unavailableBadge: {
    backgroundColor: '#8E8E93',
  },
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
