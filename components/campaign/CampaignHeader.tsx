import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface CampaignHeaderProps {
  title: string;
  count: string;
  filterDisplayName: string;
  onFilterPress: () => void;
  onNewPress?: () => void;
}

export default function CampaignHeader({ 
  title, 
  count, 
  filterDisplayName, 
  onFilterPress,
  onNewPress
}: CampaignHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerLeft}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText type="subtitle" lightColor="#666" darkColor="#999">
          {count}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.headerActions}>
        {onNewPress && (
          <TouchableOpacity style={styles.newButton} onPress={onNewPress}>
            <IconSymbol size={16} name="plus" color="white" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <IconSymbol size={16} name="line.3.horizontal.decrease.circle" color="#6366f1" />
          <ThemedText style={styles.filterText}>
            {filterDisplayName}
          </ThemedText>
          <IconSymbol size={12} name="chevron.down" color="#6366f1" />
        </TouchableOpacity>
      </ThemedView>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  filterText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
});