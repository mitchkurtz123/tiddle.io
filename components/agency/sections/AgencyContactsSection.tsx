import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BrandContact, BubbleThing } from '@/services/bubbleAPI';
import ContactCard from '@/components/brand-contact/ContactCard';
import EmptyState from '@/components/common/EmptyState';

interface AgencyContactsSectionProps {
  agencyContacts: (BubbleThing & BrandContact)[] | undefined;
  isLoading?: boolean;
}

export default function AgencyContactsSection({ 
  agencyContacts, 
  isLoading 
}: AgencyContactsSectionProps) {
  
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading agency contacts...</ThemedText>
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
            Agency Contacts ({agencyContacts?.length || 0})
          </ThemedText>
        </ThemedView>
        
        {/* TODO: Add contact button could go here */}
      </ThemedView>
      
      {/* Contacts List */}
      {(!agencyContacts || agencyContacts.length === 0) ? (
        <EmptyState
          title="No agency contacts"
          message="This agency has no contacts assigned yet."
        />
      ) : (
        <ThemedView style={styles.contactsContainer}>
          {agencyContacts.map((contact) => (
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