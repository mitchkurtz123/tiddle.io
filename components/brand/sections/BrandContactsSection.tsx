import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BrandContact, BubbleThing } from '@/services/bubbleAPI';
import ContactCard from '@/components/brand-contact/ContactCard';
import EmptyState from '@/components/common/EmptyState';

interface BrandContactsSectionProps {
  brandContacts: (BubbleThing & BrandContact)[] | undefined;
  isLoading?: boolean;
}

export default function BrandContactsSection({ 
  brandContacts, 
  isLoading 
}: BrandContactsSectionProps) {
  
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading brand contacts...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      {/* Section Header with Count */}
      <ThemedView style={styles.sectionHeader}>
        <ThemedView style={styles.headerLeft}>
          <IconSymbol size={20} name="person.2.fill" color="#10b981" />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Brand Contacts ({brandContacts?.length || 0})
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      {/* Contacts List */}
      {(!brandContacts || brandContacts.length === 0) ? (
        <EmptyState
          title="No brand contacts"
          message="This brand has no contacts assigned yet."
        />
      ) : (
        <ThemedView style={styles.contactsContainer}>
          {brandContacts.map((contact) => (
            <ContactCard
              key={contact._id}
              item={contact}
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
  contactsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});