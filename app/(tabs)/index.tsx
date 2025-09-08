import { ActivityIndicator, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBranddeals } from '@/hooks/useBranddeals';
import { useAuth } from '@/contexts/AuthContext';
import { BrandDeal, BubbleThing } from '@/services/bubbleAPI';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Component for branddeal image with fallback
const BranddealImage = ({ branddeal }: { branddeal: BubbleThing & BrandDeal }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fix protocol-relative URLs (starting with //)
  const getImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    
    // If URL starts with //, add https:
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    return url;
  };
  
  const imageUrl = getImageUrl(branddeal.image);
  
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.branddealImage}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback placeholder
  return (
    <ThemedView style={styles.imagePlaceholder}>
      <ThemedText type="defaultSemiBold" style={styles.placeholderText}>
        {(branddeal.title ?? "BD").charAt(0).toUpperCase()}
      </ThemedText>
    </ThemedView>
  );
};

// Component for professional status badge
const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  
  const getStatusStyle = (status: string) => {
    // Professional color palette with refined tones
    switch (status.toLowerCase()) {
      case 'roster':
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)', // Subtle gray
          borderColor: 'rgba(107, 114, 128, 0.3)',
          textColor: '#374151'
        };
      case 'waiting':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)', // Warm amber
          borderColor: 'rgba(245, 158, 11, 0.3)',
          textColor: '#92400e'
        };
      case 'in progress':
        return {
          backgroundColor: 'rgba(99, 102, 241, 0.1)', // Professional indigo
          borderColor: 'rgba(99, 102, 241, 0.3)',
          textColor: '#3730a3'
        };
      case 'invoiced':
        return {
          backgroundColor: 'rgba(139, 92, 246, 0.1)', // Sophisticated purple
          borderColor: 'rgba(139, 92, 246, 0.3)',
          textColor: '#5b21b6'
        };
      case 'complete':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.1)', // Success green
          borderColor: 'rgba(34, 197, 94, 0.3)',
          textColor: '#166534'
        };
      case 'canceled':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)', // Muted red
          borderColor: 'rgba(239, 68, 68, 0.3)',
          textColor: '#991b1b'
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: 'rgba(107, 114, 128, 0.3)',
          textColor: '#374151'
        };
    }
  };
  
  const statusStyle = getStatusStyle(status);
  
  return (
    <ThemedView style={[
      styles.statusBadge, 
      { 
        backgroundColor: statusStyle.backgroundColor,
        borderColor: statusStyle.borderColor,
      }
    ]}>
      <ThemedText style={[styles.statusText, { color: statusStyle.textColor }]}>
        {status}
      </ThemedText>
    </ThemedView>
  );
};

// Filter options
type FilterOption = 'all' | 'roster' | 'waiting' | 'in-progress' | 'invoiced' | 'complete' | 'canceled';

// Filter and sort logic for branddeals
const filterAndSortBranddeals = (branddeals: (BubbleThing & BrandDeal)[], filterBy: FilterOption) => {
  let filtered = [...branddeals];
  
  // Filter by status
  if (filterBy !== 'all') {
    const filterStatus = filterBy === 'in-progress' ? 'in progress' : filterBy;
    filtered = filtered.filter(item => 
      item["kaban-status"]?.toLowerCase() === filterStatus
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
  
  // Apply filtering and sorting to the data
  const filteredData = data ? filterAndSortBranddeals(data, filterBy) : [];

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
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerLeft}>
          <ThemedText type="title">My Campaigns</ThemedText>
          <ThemedText type="subtitle" lightColor="#666" darkColor="#999">
            {filteredData.length} deals
          </ThemedText>
        </ThemedView>
        
        <TouchableOpacity style={styles.filterButton} onPress={() => setDropdownVisible(true)}>
          <IconSymbol size={16} name="line.3.horizontal.decrease.circle" color="#6366f1" />
          <ThemedText style={styles.filterText}>
            {getFilterDisplayName(filterBy)}
          </ThemedText>
          <IconSymbol size={12} name="chevron.down" color="#6366f1" />
        </TouchableOpacity>
      </ThemedView>

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
      
      {filteredData.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="subtitle" style={styles.emptyTitle}>No branddeals yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Your branddeals will appear here once you create them.
          </ThemedText>
        </ThemedView>
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
            <ThemedView style={styles.branddealCard}>
              <BranddealImage branddeal={item} />
              <ThemedView style={styles.branddealInfo}>
                <ThemedView style={styles.titleRow}>
                  <ThemedText type="defaultSemiBold" style={styles.title}>
                    {item.title ?? "(untitled)"}
                  </ThemedText>
                  <StatusBadge status={item["kaban-status"]} />
                </ThemedView>
                <ThemedText style={styles.subtitle}>Brand</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Safe area padding
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  filterText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  branddealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  branddealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  branddealInfo: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
});
