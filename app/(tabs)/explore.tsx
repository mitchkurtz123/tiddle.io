import { ActivityIndicator, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBrands } from '@/hooks/useBrands';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import BrandCard from '@/components/brand/BrandCard';
import SearchBar from '@/components/common/SearchBar';
import BrandHeader from '@/components/brand/BrandHeader';
import EmptyState from '@/components/common/EmptyState';


// Classification filter options
type ClassificationOption = 'all' | 'direct' | 'agency' | 'music';

// Search and sort logic for brands
const searchAndSortBrands = (brands: (BubbleThing & Brand)[], searchQuery: string = '', classificationFilter: ClassificationOption = 'all') => {
  let filtered = [...brands];
  
  // Filter by classification first
  if (classificationFilter !== 'all') {
    filtered = filtered.filter(item => 
      item.classification?.toLowerCase() === classificationFilter.toLowerCase()
    );
  }
  
  // Filter by search query (brandname only)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.brandname?.toLowerCase().includes(query)
    );
  }
  
  // Sort alphabetically by brandname
  return filtered.sort((a, b) => {
    const aName = a.brandname?.toLowerCase() || '';
    const bName = b.brandname?.toLowerCase() || '';
    return aName.localeCompare(bName);
  });
};


// Classification Toggle Component
const ClassificationToggle = ({ 
  selected, 
  onSelect 
}: { 
  selected: ClassificationOption; 
  onSelect: (option: ClassificationOption) => void; 
}) => {
  const options: { key: ClassificationOption; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'direct', label: 'Brand' },
    { key: 'agency', label: 'Agency' },
    { key: 'music', label: 'Music' },
  ];

  return (
    <ThemedView style={styles.toggleContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.toggleButton,
            selected === option.key && styles.toggleButtonActive
          ]}
          onPress={() => onSelect(option.key)}
        >
          <ThemedText style={[
            styles.toggleText,
            selected === option.key && styles.toggleTextActive
          ]}>
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
};

export default function BrandsScreen() {
  const { data, isLoading, error, refetch } = useBrands();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<ClassificationOption>('all');
  
  // Apply search and sorting to the data
  const filteredData = data ? searchAndSortBrands(data, searchQuery, classificationFilter) : [];
  
  // Calculate count information for enhanced UX
  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = classificationFilter !== 'all';

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh brands:', error);
    } finally {
      setRefreshing(false);
    }
  };


  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleNewBrand = () => {
    // TODO: Navigate to brand creation screen when implemented
    console.log('Navigate to new brand creation');
  };

  const getSearchPlaceholder = () => {
    return 'Search brands...';
  };

  const getCountText = () => {
    if (isSearching || isFiltering) {
      return `${filteredData.length} of ${data?.length || 0} brands`;
    }
    return `${filteredData.length} brands`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading your brands...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>Failed to load brands</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <BrandHeader
        title="My Brands"
        count={getCountText()}
        onNewPress={handleNewBrand}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={getSearchPlaceholder()}
        onClear={clearSearch}
      />

      {/* Classification Toggle */}
      <ClassificationToggle
        selected={classificationFilter}
        onSelect={setClassificationFilter}
      />
      
      {filteredData.length === 0 ? (
        <EmptyState
          title={isSearching ? 'No matching brands' : 'No brands yet'}
          message={
            isSearching 
              ? `No brands match "${searchQuery}".`
              : 'Your brands will appear here once you create them.'
          }
        />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
              colors={["#6366f1"]}
            />
          }
          renderItem={({ item }) => (
            <BrandCard item={item} />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, // Increased safe area padding for better spacing
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 9,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
  },
  toggleTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
