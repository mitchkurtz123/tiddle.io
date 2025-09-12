import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import AgencyOverviewCard from '../AgencyOverviewCard';
import AgencyStatsCard from '../AgencyStatsCard';

interface AgencyOverviewSectionProps {
  agency: BubbleThing & Brand;
  managedBrandsCount?: number;
  totalContactsCount?: number;
}

export default function AgencyOverviewSection({ 
  agency,
  managedBrandsCount,
  totalContactsCount 
}: AgencyOverviewSectionProps) {
  return (
    <ThemedView style={styles.container}>
      <AgencyStatsCard 
        agency={agency}
        managedBrandsCount={managedBrandsCount}
        totalContactsCount={totalContactsCount}
      />
      <AgencyOverviewCard agency={agency} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});