import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useBrands } from '@/hooks/useBrands';
import { useBrandContacts } from '@/hooks/useBrandContacts';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import BrandDetailHeader from '@/components/brand/BrandDetailHeader';
import { DataListView } from '@/components/layout/DataListView';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import BrandOverviewSection from '@/components/brand/sections/BrandOverviewSection';
import BrandContactsSection from '@/components/brand/sections/BrandContactsSection';

// Tab options for the brand detail view
type BrandTab = 'Overview' | 'Contacts' | 'Campaigns';
const BRAND_TABS: readonly BrandTab[] = ['Overview', 'Contacts', 'Campaigns'] as const;

export default function BrandDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<BrandTab>('Overview');
  
  // Fetch the brand details from the main brands list
  const { data: allBrands, isLoading: allBrandsLoading, error: allBrandsError } = useBrands();
  
  // Fetch brand contacts
  const { data: brandContacts, isLoading: contactsLoading } = useBrandContacts(id);
  
  // Find the brand in the brands list
  const brand = allBrands?.find(b => b._id === id);
  
  const isLoading = allBrandsLoading;
  const error = allBrandsError;

  const handleBack = () => {
    router.back();
  };

  // Calculate counts for stats
  const totalContactsCount = brandContacts?.length || 0;

  // Render content based on active tab
  const renderTabContent = () => {
    if (!brand) return null;
    
    switch (activeTab) {
      case 'Overview':
        return (
          <BrandOverviewSection
            brand={brand}
            totalContactsCount={totalContactsCount}
          />
        );
      case 'Contacts':
        return (
          <BrandContactsSection
            brandContacts={brandContacts}
            isLoading={contactsLoading}
          />
        );
      case 'Campaigns':
        return (
          <ThemedView style={styles.comingSoon}>
            <ThemedText style={styles.comingSoonText}>
              Campaigns view coming soon...
            </ThemedText>
          </ThemedView>
        );
      default:
        return null;
    }
  };

  return (
    <DataListView
      isLoading={isLoading}
      error={error}
      loadingText="Loading brand details..."
      errorText="Failed to load brand details"
    >
      <ThemedView style={styles.container}>
        {/* Brand Header */}
        {brand && (
          <BrandDetailHeader
            brand={brand}
            contactCount={totalContactsCount}
            onBack={handleBack}
          />
        )}

        {/* Tab Navigation */}
        <SegmentedControl
          tabs={BRAND_TABS}
          selected={activeTab}
          onSelect={setActiveTab}
        />

        {/* Tab Content */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </ThemedView>
    </DataListView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
    textAlign: 'center',
  },
});