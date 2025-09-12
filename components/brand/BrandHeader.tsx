import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface BrandHeaderProps {
  title: string;
  count: string;
  onNewPress: () => void;
}

export default function BrandHeader({ 
  title, 
  count,
  onNewPress
}: BrandHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerLeft}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText type="subtitle" lightColor="#666" darkColor="#999">
          {count}
        </ThemedText>
      </ThemedView>
      
      <TouchableOpacity style={styles.newButton} onPress={onNewPress}>
        <IconSymbol size={16} name="plus" color="white" />
        <ThemedText style={styles.newButtonText}>
          New brand
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  newButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  newButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});