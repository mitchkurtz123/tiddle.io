import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { useBrandContactsList } from '@/hooks/useBrandContactsList';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

interface ContactSelectorProps {
  selectedBrand?: (BubbleThing & Brand) | null;
  selectedAgency?: (BubbleThing & Brand) | null;
  isAgencyMode: boolean;
  selectedContact: string | null;
  onContactChange: (contactId: string | null) => void;
}

export default function ContactSelector({
  selectedBrand,
  selectedAgency,
  isAgencyMode,
  selectedContact,
  onContactChange,
}: ContactSelectorProps) {
  const { data: allContacts, isLoading } = useBrandContactsList();

  // Filter contacts based on brand/agency selection
  const availableContacts = allContacts?.filter(contact => {
    if (isAgencyMode && selectedAgency) {
      // For agency mode, show contacts in two ways:
      // 1. Contacts directly linked to the agency (when brand field points to the agency)
      // 2. Contacts linked to the agency via agency-brands field
      return contact.brand === selectedAgency._id || 
             contact.resolvedAgencyBrands?.some(agencyBrand => agencyBrand._id === selectedAgency._id);
    } else if (selectedBrand) {
      // For direct mode, show contacts directly associated with the selected brand
      return contact.brand === selectedBrand._id;
    }
    return false;
  }) || [];

  const handleContactSelect = (contactId: string) => {
    if (selectedContact === contactId) {
      // Deselect current contact
      onContactChange(null);
    } else {
      // Select new contact
      onContactChange(contactId);
    }
  };

  const ContactItem = ({ contact, isMinimized = false }: { contact: any; isMinimized?: boolean }) => {
    const isSelected = selectedContact === contact._id;
    
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.contactItemSelected]}
        onPress={() => handleContactSelect(contact._id)}
      >
        <ThemedView style={styles.contactInfo}>
          <ImageWithFallback
            url={contact.profileimage}
            style={styles.contactAvatar}
            fallbackText={(contact.name ?? "C").charAt(0).toUpperCase()}
            fallbackStyle={styles.avatarPlaceholder}
            fallbackTextStyle={styles.avatarPlaceholderText}
          />
          <ThemedView style={styles.contactDetails}>
            <ThemedText style={styles.contactName}>
              {contact.name ?? "Unnamed Contact"}
            </ThemedText>
            {!isMinimized && contact.role && (
              <ThemedText style={styles.contactRole}>{contact.role}</ThemedText>
            )}
            {!isMinimized && contact.email && (
              <ThemedText style={styles.contactEmail}>{contact.email}</ThemedText>
            )}
            {/* Show brand association info */}
            {!isMinimized && isAgencyMode && contact.resolvedBrand && (
              <ThemedView style={styles.brandAssociation}>
                <IconSymbol size={10} name="building.2.fill" color="#10b981" />
                <ThemedText style={styles.associatedBrand}>
                  {contact.resolvedBrand.brandname}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
        
        {isSelected ? (
          <TouchableOpacity style={styles.changeButton} onPress={() => onContactChange(null)}>
            <ThemedText style={styles.changeButtonText}>Change</ThemedText>
          </TouchableOpacity>
        ) : (
          <ThemedView style={styles.radioButton}>
            {isSelected && (
              <ThemedView style={styles.radioButtonSelected} />
            )}
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };

  if (!selectedBrand) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Contacts</ThemedText>
        <ThemedView style={styles.placeholderContainer}>
          <ThemedText style={styles.placeholderText}>Select a brand first</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (isAgencyMode && !selectedAgency) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Contacts</ThemedText>
        <ThemedView style={styles.placeholderContainer}>
          <ThemedText style={styles.placeholderText}>Select an agency first</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>
        Contact {selectedContact && '(1 selected)'}
      </ThemedText>
      
      {isLoading ? (
        <ThemedView style={styles.placeholderContainer}>
          <ThemedText style={styles.placeholderText}>Loading contacts...</ThemedText>
        </ThemedView>
      ) : availableContacts.length === 0 ? (
        <ThemedView style={styles.placeholderContainer}>
          <ThemedText style={styles.placeholderText}>
            No contacts found for {isAgencyMode ? 'agency' : 'brand'}
          </ThemedText>
        </ThemedView>
      ) : (
        <ScrollView style={styles.contactsList} nestedScrollEnabled>
          {selectedContact ? (
            <>
              {/* Show selected contact first */}
              {(() => {
                const selected = availableContacts.find(c => c._id === selectedContact);
                return selected ? <ContactItem key={selected._id} contact={selected} /> : null;
              })()}
              
              {/* Show other contacts minimized */}
              {availableContacts.filter(c => c._id !== selectedContact).length > 0 && (
                <>
                  <ThemedView style={styles.otherContactsHeader}>
                    <ThemedText style={styles.otherContactsText}>Other contacts</ThemedText>
                  </ThemedView>
                  {availableContacts.filter(c => c._id !== selectedContact).map((contact) => (
                    <ContactItem key={contact._id} contact={contact} isMinimized />
                  ))}
                </>
              )}
            </>
          ) : (
            /* Show all contacts normally when none selected */
            availableContacts.map((contact) => (
              <ContactItem key={contact._id} contact={contact} />
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  contactsList: {
    maxHeight: 300,
    //backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 244, 246, 0.6)',
    backgroundColor: 'transparent',
  },
  contactItemSelected: {
    //backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactRole: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 11,
    color: '#666',
  },
  brandAssociation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  associatedBrand: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  changeButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  otherContactsHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 244, 246, 0.6)',
  },
  otherContactsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});