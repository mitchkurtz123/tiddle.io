import React, { useState, useRef } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useBranddeal } from '@/hooks/useBranddeal';
import { useInstances } from '@/hooks/useInstances';
import { useCreateInstance } from '@/hooks/useCreateInstance';
import { useUpdateInstance } from '@/hooks/useUpdateInstance';
import BrandDealHeader from '@/components/brand-deal/BrandDealHeader';
import InstanceList from '@/components/brand-deal/InstanceList';
import EmptyState from '@/components/common/EmptyState';
import AddCreatorSheet from '@/components/brand-deal/AddCreatorSheet';
import SearchBar from '@/components/common/SearchBar';
import { BubbleThing, Instance0963 } from '@/services/bubbleAPI';

// Filter options for instances
type InstanceFilterOption = 'all' | 'none' | 'waiting-for-product' | 'no-submission' | 'brand-review' | 'revising' | 'ready-to-post' | 'posted' | 'invoice-pending' | 'paid';

// Filter and sort logic for instances
const filterAndSortInstances = (instances: (BubbleThing & Instance0963)[], filterBy: InstanceFilterOption, searchQuery: string = '') => {
  let filtered = [...instances];
  
  // Filter by status first
  if (filterBy !== 'all') {
    const filterStatus = filterBy === 'waiting-for-product' ? 'Waiting for Product' 
      : filterBy === 'no-submission' ? 'No Submission'
      : filterBy === 'brand-review' ? 'Brand Review'
      : filterBy === 'ready-to-post' ? 'Ready to Post'
      : filterBy === 'invoice-pending' ? 'Invoice Pending'
      : filterBy.charAt(0).toUpperCase() + filterBy.slice(1).replace('-', ' ');
    
    filtered = filtered.filter(item => 
      item["instance-status"]?.toLowerCase() === filterStatus.toLowerCase()
    );
  }
  
  // Then filter by search query (within the status-filtered results)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => {
      const usernameMatch = item.username?.toLowerCase().includes(query);
      const platformMatch = item.platform?.toLowerCase().includes(query);
      
      // Debug logging to help identify issues
      if (searchQuery.length > 0) {
        console.log('Search debug:', {
          query,
          username: item.username,
          platform: item.platform,
          usernameMatch,
          platformMatch
        });
      }
      
      return usernameMatch || platformMatch;
    });
  }
  
  // Sort by workflow order (natural instance progression)
  const statusOrder = {
    'none': 1, 'waiting for product': 2, 'no submission': 3,
    'brand review': 4, 'revising': 5, 'ready to post': 6,
    'posted': 7, 'invoice pending': 8, 'paid': 9
  };
  
  return filtered.sort((a, b) => {
    const aStatus = a["instance-status"]?.toLowerCase() || '';
    const bStatus = b["instance-status"]?.toLowerCase() || '';
    const aOrder = statusOrder[aStatus as keyof typeof statusOrder] || 999;
    const bOrder = statusOrder[bStatus as keyof typeof statusOrder] || 999;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Secondary sort by username
    const aUsername = a.username?.toLowerCase() || '';
    const bUsername = b.username?.toLowerCase() || '';
    return aUsername.localeCompare(bUsername);
  });
};

const getInstanceFilterDisplayName = (filterOption: InstanceFilterOption): string => {
  switch (filterOption) {
    case 'all': return 'All';
    case 'none': return 'None';
    case 'waiting-for-product': return 'Waiting';
    case 'no-submission': return 'No Submission';
    case 'brand-review': return 'Brand Review';
    case 'revising': return 'Revising';
    case 'ready-to-post': return 'Ready to Post';
    case 'posted': return 'Posted';
    case 'invoice-pending': return 'Invoiced';
    case 'paid': return 'Paid';
    default: return 'Filter';
  }
};

export default function BrandDealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddCreatorSheet, setShowAddCreatorSheet] = useState(false);
  const [editingInstance, setEditingInstance] = useState<(BubbleThing & Instance0963) | null>(null);
  const [filterBy, setFilterBy] = useState<InstanceFilterOption>('all');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Fetch brand deal data
  const { 
    data: brandDeal, 
    isLoading: brandDealLoading, 
    error: brandDealError, 
    refetch: refetchBrandDeal 
  } = useBranddeal(id);
  
  // Fetch instances data using user-list from brand deal
  const { 
    data: instancesData, 
    isLoading: instancesLoading, 
    error: instancesError, 
    refetch: refetchInstances 
  } = useInstances(brandDeal?.["user-list"]);

  // Create and update instance mutations
  const createInstanceMutation = useCreateInstance();
  const updateInstanceMutation = useUpdateInstance();

  // Debug logging
  console.log('Brand deal data:', brandDeal);
  console.log('User list:', brandDeal?.["user-list"]);
  console.log('Instances data:', instancesData);
  console.log('Instances loading:', instancesLoading);
  console.log('Instances error:', instancesError);

  // Apply filtering and sorting to instances
  const instances = instancesData?.results || [];
  const filteredInstances = filterAndSortInstances(instances, filterBy, searchQuery);
  
  // Calculate count information for enhanced UX
  const isSearching = searchQuery.trim().length > 0;

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchBrandDeal(),
        refetchInstances()
      ]);
    } catch (error) {
      console.error('Failed to refresh brand deal details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddCreators = () => {
    setEditingInstance(null);
    setShowAddCreatorSheet(true);
  };

  const handleEditInstance = (instance: BubbleThing & Instance0963) => {
    setEditingInstance(instance);
    setShowAddCreatorSheet(true);
  };

  const handleFilterSelect = (option: InstanceFilterOption) => {
    setFilterBy(option);
    setDropdownVisible(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getSearchPlaceholder = () => {
    const filterName = getInstanceFilterDisplayName(filterBy);
    return `Search ${filterName.toLowerCase()} instances...`;
  };


  const handleSearchFocus = () => {
    // Add delay to allow keyboard to appear, then scroll to position the search bar optimally
    setTimeout(() => {
      // Account for brand deal header and instances section header
      // Add extra offset to ensure search results are visible above keyboard
      const scrollOffset = 320; // Increased from 280 to provide more space above keyboard
      scrollViewRef.current?.scrollTo({
        y: scrollOffset,
        animated: true,
      });
    }, 300);
  };

  const handleAddCreatorSubmit = async (data: {
    user?: string;
    platform: string;
    rate: number;
    price: number;
    instanceStatus?: string;
    instanceId?: string;
    notes?: string;
  }) => {
    if (!id) {
      throw new Error('Brand deal ID is required');
    }

    console.log('=== STARTING INSTANCE OPERATION ===');
    console.log('Edit mode:', !!editingInstance);
    console.log('Data:', data);
    
    try {
      let result;
      
      if (editingInstance && data.instanceId) {
        // Update existing instance
        console.log('=== UPDATING INSTANCE ===');
        result = await updateInstanceMutation.mutateAsync({
          instance: data.instanceId,
          rate: data.rate,
          price: data.price,
          platform: data.platform,
          instanceStatus: data.instanceStatus || 'None',
          notes: data.notes,
        });
        console.log('=== INSTANCE UPDATE SUCCESS ===');
      } else {
        // Create new instance
        console.log('=== CREATING INSTANCE ===');
        result = await createInstanceMutation.mutateAsync({
          username: data.user!,
          platform: data.platform,
          rate: data.rate,
          price: data.price,
          branddeal: id,
          notes: data.notes,
        });
        console.log('=== INSTANCE CREATION SUCCESS ===');
      }
      
      console.log('API Result:', result);
      
      // Add a small delay to allow backend processing
      setTimeout(async () => {
        console.log('=== MANUAL REFETCH AFTER DELAY ===');
        await Promise.all([
          refetchBrandDeal(),
          refetchInstances(),
        ]);
        console.log('Manual refetch completed');
      }, 1000);
      
      console.log('Operation completed successfully');
      setEditingInstance(null);
    } catch (error) {
      console.error('=== INSTANCE OPERATION ERROR ===');
      console.error('Failed to process instance:', error);
      throw error;
    }
  };

  // Loading state
  if (brandDealLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading brand deal...</ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (brandDealError || !brandDeal) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>
          {brandDealError ? 'Failed to load brand deal details' : 'Brand deal not found'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
              colors={["#6366f1"]}
            />
          }
        >
        {/* Header Section */}
        <BrandDealHeader brandDeal={brandDeal} />
        
        {/* Instances Section */}
        <ThemedView style={styles.instancesSection}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={styles.headerLeft}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {filteredInstances.length} Videos
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.headerRight}>
              <TouchableOpacity style={styles.filterButton} onPress={() => setDropdownVisible(true)}>
                <IconSymbol size={16} name="line.3.horizontal.decrease.circle" color="#6366f1" />
                <ThemedText style={styles.filterText}>
                  {getInstanceFilterDisplayName(filterBy)}
                </ThemedText>
                <IconSymbol size={12} name="chevron.down" color="#6366f1" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.addCreatorsButton} onPress={handleAddCreators}>
                <IconSymbol size={16} name="plus" color="white" />
                <ThemedText style={styles.addCreatorsText}>Add creators</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Search Bar */}
          <ThemedView style={styles.searchContainer}>
            <ThemedView style={styles.searchBar}>
              <IconSymbol size={20} name="magnifyingglass" color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder={getSearchPlaceholder()}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <IconSymbol size={18} name="xmark.circle.fill" color="#999" />
                </TouchableOpacity>
              )}
            </ThemedView>
          </ThemedView>
          
          {instancesLoading ? (
            <ThemedView style={styles.instancesLoading}>
              <ActivityIndicator size="small" />
              <ThemedText style={styles.loadingText}>Loading instances...</ThemedText>
            </ThemedView>
          ) : instancesError ? (
            <EmptyState
              title="Failed to load instances"
              message="There was an error loading the video instances for this brand deal."
            />
          ) : instances.length === 0 ? (
            <EmptyState
              title="No instances yet"
              message="No video instances have been created for this brand deal."
            />
          ) : filteredInstances.length === 0 ? (
            <EmptyState
              title={isSearching ? "No matches found" : "No instances in this status"}
              message={isSearching 
                ? `No instances match "${searchQuery}" in ${getInstanceFilterDisplayName(filterBy).toLowerCase()} status.`
                : `There are no instances with ${getInstanceFilterDisplayName(filterBy).toLowerCase()} status.`
              }
            />
          ) : (
            <InstanceList instances={filteredInstances} onEditInstance={handleEditInstance} />
          )}
        </ThemedView>
      </ScrollView>

      {/* Filter Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <ThemedView style={styles.dropdown}>
            {['all', 'none', 'waiting-for-product', 'no-submission', 'brand-review', 'revising', 'ready-to-post', 'posted', 'invoice-pending', 'paid'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  filterBy === option && styles.dropdownItemSelected
                ]}
                onPress={() => handleFilterSelect(option as InstanceFilterOption)}
              >
                <ThemedText style={[
                  styles.dropdownText,
                  filterBy === option && styles.dropdownTextSelected
                ]}>
                  {getInstanceFilterDisplayName(option as InstanceFilterOption)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>

      {/* Add Creator Sheet */}
      <AddCreatorSheet
        visible={showAddCreatorSheet}
        onClose={() => {
          setShowAddCreatorSheet(false);
          setEditingInstance(null);
        }}
        onSubmit={handleAddCreatorSubmit}
        isSubmitting={createInstanceMutation.isPending || updateInstanceMutation.isPending}
        editMode={!!editingInstance}
        initialData={editingInstance}
      />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Account for safe area and header
    paddingBottom: 20,
  },
  instancesSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  filterText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  addCreatorsButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  addCreatorsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  instancesLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#666',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 140, // Account for header height
    paddingRight: 20, // Match the padding from the screen
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  searchContainer: {
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // Remove default padding on iOS
  },
  clearButton: {
    padding: 2,
  },
});