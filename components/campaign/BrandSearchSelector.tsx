import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing, isAgency } from '@/services/bubbleAPI';
import { useBrands } from '@/hooks/useBrands';

interface BrandSearchSelectorProps {
  selectedBrand?: (BubbleThing & Brand) | null;
  onBrandSelect: (brand: (BubbleThing & Brand) | null) => void;
  placeholder?: string;
  searchMode?: 'all' | 'brands' | 'agencies';
}

export default function BrandSearchSelector({ 
  selectedBrand, 
  onBrandSelect, 
  placeholder = "Search brands...",
  searchMode = 'all'
}: BrandSearchSelectorProps) {
  const { data: brands, isLoading } = useBrands();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter brands based on search query and mode
  const filteredBrands = brands?.filter(brand => {
    if (!searchQuery.trim()) return false;
    
    // First filter by search query
    const query = searchQuery.toLowerCase();
    const matchesQuery = brand.brandname?.toLowerCase().includes(query) ||
                        brand.legalname?.toLowerCase().includes(query);
    
    if (!matchesQuery) return false;
    
    // Then filter by search mode
    const brandIsAgency = isAgency(brand);
    switch (searchMode) {
      case 'brands':
        return !brandIsAgency; // Only non-agency brands
      case 'agencies':
        return brandIsAgency;  // Only agencies
      case 'all':
      default:
        return true; // All brands and agencies
    }
  }).slice(0, 5) || []; // Limit to 5 results for performance

  // Clear search when brand is selected
  useEffect(() => {
    if (selectedBrand) {
      setSearchQuery('');
      setShowDropdown(false);
    }
  }, [selectedBrand]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowDropdown(text.trim().length > 0);
  };

  const handleBrandSelect = (brand: BubbleThing & Brand) => {
    onBrandSelect(brand);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const clearSelection = () => {
    onBrandSelect(null);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Brand</ThemedText>
      
      {selectedBrand ? (
        // Show selected brand
        <ThemedView style={styles.selectedBrand}>
          <ThemedView style={styles.brandInfo}>
            <IconSymbol 
              size={16} 
              name={isAgency(selectedBrand) ? "network" : "building.2.fill"} 
              color={isAgency(selectedBrand) ? "#8b5cf6" : "#10b981"} 
            />
            <ThemedText style={styles.brandName}>
              {selectedBrand.brandname}
            </ThemedText>
            {isAgency(selectedBrand) && (
              <ThemedView style={styles.agencyBadge}>
                <ThemedText style={styles.agencyBadgeText}>Agency</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <IconSymbol size={16} name="xmark" color="#666" />
          </TouchableOpacity>
        </ThemedView>
      ) : (
        // Show search input
        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => setShowDropdown(searchQuery.trim().length > 0)}
          />
          <IconSymbol size={16} name="magnifyingglass" color="#666" style={styles.searchIcon} />
        </ThemedView>
      )}

      {/* Dropdown with search results */}
      {showDropdown && (
        <ThemedView style={styles.dropdown}>
          {isLoading ? (
            <ThemedView style={styles.dropdownItem}>
              <ThemedText style={styles.dropdownText}>Loading brands...</ThemedText>
            </ThemedView>
          ) : filteredBrands.length > 0 ? (
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {filteredBrands.map((brand) => (
                <TouchableOpacity
                  key={brand._id}
                  style={styles.dropdownItem}
                  onPress={() => handleBrandSelect(brand)}
                >
                  <IconSymbol 
                    size={14} 
                    name={isAgency(brand) ? "network" : "building.2.fill"} 
                    color={isAgency(brand) ? "#8b5cf6" : "#10b981"} 
                  />
                  <ThemedView style={styles.dropdownBrandInfo}>
                    <ThemedText style={styles.dropdownText}>
                      {brand.brandname}
                    </ThemedText>
                    {brand.legalname && brand.legalname !== brand.brandname && (
                      <ThemedText style={styles.legalNameText}>
                        {brand.legalname}
                      </ThemedText>
                    )}
                  </ThemedView>
                  {isAgency(brand) && (
                    <ThemedView style={styles.smallAgencyBadge}>
                      <ThemedText style={styles.smallAgencyBadgeText}>Agency</ThemedText>
                    </ThemedView>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : searchQuery.trim().length > 0 ? (
            <ThemedView style={styles.dropdownItem}>
              <ThemedText style={styles.dropdownText}>No brands found</ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  selectedBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   // backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '500',
  },
  agencyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  agencyBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7c3aed',
  },
  clearButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    //backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownBrandInfo: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalNameText: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  smallAgencyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  smallAgencyBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#7c3aed',
  },
});