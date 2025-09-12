import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import AgencyBillingCard from '../AgencyBillingCard';

interface AgencyBillingSectionProps {
  agency: BubbleThing & Brand;
}

export default function AgencyBillingSection({ agency }: AgencyBillingSectionProps) {
  return (
    <ThemedView style={styles.container}>
      <AgencyBillingCard agency={agency} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});