import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useBrands } from '@/hooks/useBrands';
import { useAgencyBrands } from '@/hooks/useAgencyBrands';
import { useBrandContacts } from '@/hooks/useBrandContacts';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import AgencyHeader from '@/components/agency/AgencyHeader';
import { DataListView } from '@/components/layout/DataListView';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import AgencyOverviewSection from '@/components/agency/sections/AgencyOverviewSection';
import AgencyBrandsSection from '@/components/agency/sections/AgencyBrandsSection';
import AgencyContactsSection from '@/components/agency/sections/AgencyContactsSection';
import AgencyBillingSection from '@/components/agency/sections/AgencyBillingSection';

// Tab options for the agency detail view
type AgencyTab = 'Overview' | 'Brands' | 'Contacts' | 'Billing';
const AGENCY_TABS: readonly AgencyTab[] = ['Overview', 'Brands', 'Contacts', 'Billing'] as const;

export default function AgencyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<AgencyTab>('Overview');
  
  // Fetch the agency details from the main brands list
  const { data: allBrands, isLoading: allBrandsLoading, error: allBrandsError } = useBrands();
  
  // Fetch brands managed by this agency
  const { data: managedBrands, isLoading: managedBrandsLoading, error: managedBrandsError } = useAgencyBrands(id);
  
  // Fetch agency contacts
  const { data: agencyContacts, isLoading: contactsLoading } = useBrandContacts(id);
  
  // Find the agency in the brands list
  const agency = allBrands?.find(brand => brand._id === id);
  
  const isLoading = allBrandsLoading;
  const error = allBrandsError;

  const handleBack = () => {
    router.back();
  };

  const handleAddBrand = () => {
    // TODO: Implement add brand to agency workflow
    console.log('Add brand to agency:', id);
  };

  const handleAddContact = () => {
    // TODO: Implement add agency contact workflow
    console.log('Add contact to agency:', id);
  };
  
  // Calculate counts for stats
  const managedBrandsCount = managedBrands?.length || 0;
  const totalContactsCount = agencyContacts?.length || 0;

  // Render content based on active tab
  const renderTabContent = () => {
    if (!agency) return null;
    
    switch (activeTab) {
      case 'Overview':
        return (
          <AgencyOverviewSection
            agency={agency}
            managedBrandsCount={managedBrandsCount}
            totalContactsCount={totalContactsCount}
          />
        );
      case 'Brands':
        return (
          <AgencyBrandsSection
            managedBrands={managedBrands}
            isLoading={managedBrandsLoading}
          />
        );
      case 'Contacts':
        return (
          <AgencyContactsSection
            agencyContacts={agencyContacts}
            isLoading={contactsLoading}
          />
        );
      case 'Billing':
        return <AgencyBillingSection agency={agency} />;
      default:
        return null;
    }
  };

  return (
    <DataListView
      isLoading={isLoading}
      error={error}
      loadingText="Loading agency details..."
      errorText="Failed to load agency details"
    >
      <ThemedView style={styles.container}>
        {/* Agency Header */}
        {agency && (
          <AgencyHeader
            agency={agency}
            onBack={handleBack}
            onAddBrand={handleAddBrand}
            onAddContact={handleAddContact}
          />
        )}

        {/* Tab Navigation */}
        <SegmentedControl
          tabs={AGENCY_TABS}
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
});