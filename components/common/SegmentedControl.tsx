import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface SegmentedControlProps<T extends string> {
  tabs: readonly T[];
  selected: T;
  onSelect: (tab: T) => void;
  style?: object;
}

/**
 * iOS-style segmented control component for tab navigation
 * Generic implementation that works with any string union type
 */
export function SegmentedControl<T extends string>({
  tabs,
  selected,
  onSelect,
  style
}: SegmentedControlProps<T>) {
  return (
    <ThemedView style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.segmentedContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.segment,
                selected === tab && styles.segmentActive
              ]}
              onPress={() => onSelect(tab)}
            >
              <ThemedText style={[
                styles.segmentText,
                selected === tab && styles.segmentTextActive
              ]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 4, // Small padding for better visual balance
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 9,
    padding: 2,
  },
  segment: {
    flex: 1,
    minWidth: 80, // Minimum width for each tab
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 1,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: '#8b5cf6', // Purple for agencies
    fontWeight: '600',
  },
});