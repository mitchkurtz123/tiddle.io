import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import BrandOverviewCard from '../BrandOverviewCard';
import BrandStatsCard from '../BrandStatsCard';

interface BrandOverviewSectionProps {
  brand: BubbleThing & Brand;
  totalContactsCount?: number;
}

export default function BrandOverviewSection({ 
  brand,
  totalContactsCount
}: BrandOverviewSectionProps) {
  return (
    <ThemedView style={styles.container}>
      <BrandStatsCard 
        brand={brand}
        totalContactsCount={totalContactsCount}
      />
      <BrandOverviewCard brand={brand} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});