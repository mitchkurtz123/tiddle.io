import { ActivityIndicator, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBranddeals } from '@/hooks/useBranddeals';
import { useAuth } from '@/contexts/AuthContext';
import { BrandDeal, BubbleThing } from '@/services/bubbleAPI';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CampaignCard from '@/components/campaign/CampaignCard';
import SearchBar from '@/components/common/SearchBar';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import EmptyState from '@/components/common/EmptyState';


// Filter options
type FilterOption = 'all' | 'roster' | 'waiting' | 'in-progress' | 'invoiced' | 'complete' | 'canceled';

// Filter and sort logic for branddeals
const filterAndSortBranddeals = (branddeals: (BubbleThing & BrandDeal)[], filterBy: FilterOption, searchQuery: string = '') => {
  let filtered = [...branddeals];
  
  // Filter by status first
  if (filterBy !== 'all') {
    const filterStatus = filterBy === 'in-progress' ? 'in progress' : filterBy;
    filtered = filtered.filter(item => 
      item["kaban-status"]?.toLowerCase() === filterStatus
    );
  }
  
  // Then filter by search query (within the status-filtered results)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.title?.toLowerCase().includes(query) ||
      item.brandname?.toLowerCase().includes(query)
    );
  }
  
  // Sort by workflow order (natural kanban progression)
  const statusOrder = {
    'roster': 1, 'waiting': 2, 'in progress': 3,
    'invoiced': 4, 'complete': 5, 'canceled': 6
  };
  
  return filtered.sort((a, b) => {
    const aStatus = a["kaban-status"]?.toLowerCase() || '';
    const bStatus = b["kaban-status"]?.toLowerCase() || '';
    const aOrder = statusOrder[aStatus as keyof typeof statusOrder] || 999;
    const bOrder = statusOrder[bStatus as keyof typeof statusOrder] || 999;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Secondary sort by title
    const aTitle = a.title?.toLowerCase() || '';
    const bTitle = b.title?.toLowerCase() || '';
    return aTitle.localeCompare(bTitle);
  });
};

const getFilterDisplayName = (filterOption: FilterOption): string => {
  switch (filterOption) {
    case 'all': return 'All';
    case 'roster': return 'Roster';
    case 'waiting': return 'Waiting';
    case 'in-progress': return 'In Progress';
    case 'invoiced': return 'Invoiced';
    case 'complete': return 'Complete';
    case 'canceled': return 'Canceled';
    default: return 'Filter';
  }
};

export default function HomeScreen() {
  const { auth } = useAuth();
  const { data, isLoading, error, refetch } = useBranddeals(auth.userId);
  const [refreshing, setRefreshing] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterOption>('in-progress'); // Default to In Progress filter
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filtering and sorting to the data
  const filteredData = data ? filterAndSortBranddeals(data, filterBy, searchQuery) : [];
  
  // Calculate count information for enhanced UX
  const statusFilteredCount = data ? filterAndSortBranddeals(data, filterBy, '').length : 0;
  const isSearching = searchQuery.trim().length > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh branddeals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterOptions: FilterOption[] = ['all', 'in-progress', 'roster', 'waiting', 'invoiced', 'complete', 'canceled'];

  const handleFilterSelect = (option: FilterOption) => {
    setFilterBy(option);
    setDropdownVisible(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getSearchPlaceholder = () => {
    const filterName = getFilterDisplayName(filterBy);
    return `Search ${filterName.toLowerCase()} campaigns...`;
  };

  const getCountText = () => {
    if (isSearching) {
      return `${filteredData.length} of ${statusFilteredCount} deals`;
    }
    return `${filteredData.length} deals`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading your branddeals...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>Failed to load branddeals</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CampaignHeader
        title="My Campaigns"
        count={getCountText()}
        filterDisplayName={getFilterDisplayName(filterBy)}
        onFilterPress={() => setDropdownVisible(true)}
      />

      {/* Filter Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <ThemedView style={styles.dropdownMenu}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  option === filterBy && styles.dropdownItemSelected
                ]}
                onPress={() => handleFilterSelect(option)}
              >
                <ThemedText style={[
                  styles.dropdownItemText,
                  option === filterBy && styles.dropdownItemTextSelected
                ]}>
                  {getFilterDisplayName(option)}
                </ThemedText>
                {option === filterBy && (
                  <IconSymbol size={16} name="checkmark" color="#6366f1" />
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={getSearchPlaceholder()}
        onClear={clearSearch}
      />
      
      {filteredData.length === 0 ? (
        <EmptyState
          title={isSearching ? 'No matching campaigns' : 'No campaigns yet'}
          message={
            isSearching 
              ? `No campaigns match "${searchQuery}" in ${getFilterDisplayName(filterBy).toLowerCase()} status.`
              : 'Your campaigns will appear here once you create them.'
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
            <CampaignCard item={item} />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 120, // Position below header area
    right: 20, // Align with right margin of filter button
    minWidth: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
  },
  dropdownItemTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
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
});
