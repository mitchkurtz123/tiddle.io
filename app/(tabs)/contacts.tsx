import { ActivityIndicator, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useBrandContactsList, EnhancedBrandContact } from '@/hooks/useBrandContactsList';
import ContactListCard from '@/components/brand-contact/ContactListCard';
import SearchBar from '@/components/common/SearchBar';
import BrandHeader from '@/components/brand/BrandHeader';
import EmptyState from '@/components/common/EmptyState';

// Search and sort logic for contacts
const searchAndSortContacts = (contacts: EnhancedBrandContact[], searchQuery: string = '') => {
  let filtered = [...contacts];
  
  // Filter by search query (name, brand, agency brands, email)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(contact => {
      const matchesName = contact.name?.toLowerCase().includes(query);
      const matchesBrand = contact.resolvedBrand?.brandname?.toLowerCase().includes(query);
      const matchesAgencyBrands = contact.resolvedAgencyBrands?.some(brand => 
        brand.brandname?.toLowerCase().includes(query)
      );
      const matchesEmail = contact.email?.toLowerCase().includes(query);
      
      return matchesName || matchesBrand || matchesAgencyBrands || matchesEmail;
    });
  }
  
  // Sort alphabetically by contact name
  return filtered.sort((a, b) => {
    const aName = a.name?.toLowerCase() || '';
    const bName = b.name?.toLowerCase() || '';
    return aName.localeCompare(bName);
  });
};

export default function ContactsScreen() {
  const { data, isLoading, error, refetch } = useBrandContactsList();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply search and sorting to the data
  const filteredData = data ? searchAndSortContacts(data, searchQuery) : [];
  
  // Calculate count information for enhanced UX
  const isSearching = searchQuery.trim().length > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh contacts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleNewContact = () => {
    // TODO: Navigate to contact creation screen when implemented
    console.log('Navigate to new contact creation');
  };

  const getSearchPlaceholder = () => {
    return 'Search contacts, brands...';
  };

  const getCountText = () => {
    if (isSearching) {
      return `${filteredData.length} of ${data?.length || 0} contacts`;
    }
    return `${filteredData.length} contacts`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading contacts...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>Oops!</ThemedText>
        <ThemedText style={styles.errorText}>Failed to load contacts</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <BrandHeader
        title="Brand Contacts"
        count={getCountText()}
        onNewPress={handleNewContact}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={getSearchPlaceholder()}
        onClear={clearSearch}
      />
      
      {filteredData.length === 0 ? (
        <EmptyState
          title={isSearching ? 'No matching contacts' : 'No contacts yet'}
          message={
            isSearching 
              ? `No contacts match "${searchQuery}".`
              : 'Brand contacts will appear here once you create them.'
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
            <ContactListCard item={item} />
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
});