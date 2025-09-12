import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import BrandCard from '@/components/brand/BrandCard';
import SearchBar from '@/components/common/SearchBar';
import EmptyState from '@/components/common/EmptyState';

interface AgencyBrandsSectionProps {
  managedBrands: (BubbleThing & Brand)[] | undefined;
  isLoading?: boolean;
}

export default function AgencyBrandsSection({ 
  managedBrands, 
  isLoading 
}: AgencyBrandsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter managed brands based on search
  const filteredBrands = managedBrands?.filter(brand =>
    brand.brandname?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    brand.legalname?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  ) || [];
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading managed brands...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      {/* Section Header with Count */}
      <ThemedView style={styles.sectionHeader}>
        <ThemedView style={styles.headerLeft}>
          <IconSymbol size={20} name="building.2.fill" color="#8b5cf6" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Managed Brands ({filteredBrands.length})
          </ThemedText>
        </ThemedView>
        
        {/* TODO: Add brand button could go here */}
      </ThemedView>
      
      {/* Search Bar */}
      {(managedBrands?.length ?? 0) > 0 && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search managed brands..."
          onClear={clearSearch}
        />
      )}
      
      {/* Brands List */}
      {filteredBrands.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No matching brands' : 'No managed brands'}
          message={
            searchQuery
              ? `No brands match "${searchQuery}".`
              : 'This agency has no managed brands yet.'
          }
        />
      ) : (
        <ThemedView style={styles.brandsContainer}>
          {filteredBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              item={brand}
            />
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  brandsContainer: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});