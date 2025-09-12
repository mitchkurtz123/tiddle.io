import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { useBrandContactById } from '@/hooks/useBrandContactById';

export default function BrandContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: contact, isLoading, error } = useBrandContactById(id);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/contacts');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol size={20} name="chevron.left" color="#666" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Contact Details</ThemedText>
          <ThemedView style={styles.headerSpacer} />
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <ThemedText style={styles.loadingText}>Loading contact details...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error || !contact) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol size={20} name="chevron.left" color="#666" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Contact Details</ThemedText>
          <ThemedView style={styles.headerSpacer} />
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <IconSymbol size={48} name="exclamationmark.triangle" color="#ef4444" />
          <ThemedText style={styles.errorText}>Contact not found</ThemedText>
          <TouchableOpacity onPress={handleBack} style={styles.backToListButton}>
            <ThemedText style={styles.backToListText}>Back to Contacts</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol size={20} name="chevron.left" color="#666" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Contact Details</ThemedText>
        <ThemedView style={styles.headerSpacer} />
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Header */}
        <ThemedView style={styles.contactHeader}>
          <ImageWithFallback
            url={contact.profileimage}
            style={styles.contactAvatar}
            fallbackText={(contact.name ?? "C").charAt(0).toUpperCase()}
            fallbackStyle={styles.avatarPlaceholder}
            fallbackTextStyle={styles.placeholderText}
          />
          <ThemedView style={styles.contactHeaderInfo}>
            <ThemedText type="title" style={styles.contactName}>
              {contact.name ?? "Unnamed Contact"}
            </ThemedText>
            {contact.role && (
              <ThemedText style={styles.contactRole}>{contact.role}</ThemedText>
            )}
            {contact["is-primary"] && (
              <ThemedView style={styles.primaryBadge}>
                <IconSymbol size={10} name="star.fill" color="#f59e0b" />
                <ThemedText style={styles.primaryBadgeText}>Primary Contact</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        {/* Contact Information */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
          
          {contact.email && (
            <ThemedView style={styles.infoRow}>
              <IconSymbol size={16} name="envelope.fill" color="#10b981" />
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{contact.email}</ThemedText>
            </ThemedView>
          )}
          
          {contact.phone && (
            <ThemedView style={styles.infoRow}>
              <IconSymbol size={16} name="phone.fill" color="#10b981" />
              <ThemedText style={styles.infoLabel}>Phone</ThemedText>
              <ThemedText style={styles.infoValue}>{contact.phone}</ThemedText>
            </ThemedView>
          )}
          
          {contact.role && (
            <ThemedView style={styles.infoRow}>
              <IconSymbol size={16} name="person.fill" color="#10b981" />
              <ThemedText style={styles.infoLabel}>Role</ThemedText>
              <ThemedText style={styles.infoValue}>{contact.role}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Brand Association */}
        {(contact.resolvedBrand || (contact.resolvedAgencyBrands && contact.resolvedAgencyBrands.length > 0)) && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Brand Associations</ThemedText>
            
            {contact.resolvedBrand && (
              <ThemedView style={styles.brandRow}>
                <IconSymbol size={16} name="building.2.fill" color="#10b981" />
                <ThemedView style={styles.brandInfo}>
                  <ThemedText style={styles.brandLabel}>Primary Brand</ThemedText>
                  <ThemedText style={styles.brandName}>
                    {contact.resolvedBrand.brandname ?? 'Unknown Brand'}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
            
            {contact.resolvedAgencyBrands && contact.resolvedAgencyBrands.length > 0 && (
              <ThemedView style={styles.brandRow}>
                <IconSymbol size={16} name="network" color="#8b5cf6" />
                <ThemedView style={styles.brandInfo}>
                  <ThemedText style={styles.brandLabel}>Agency Brands</ThemedText>
                  {contact.resolvedAgencyBrands.map((brand) => (
                    <ThemedText key={brand._id} style={styles.agencyBrandName}>
                      {brand.brandname ?? 'Unknown Agency'}
                    </ThemedText>
                  ))}
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        )}

        {/* Status Information */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Status</ThemedText>
          <ThemedView style={styles.infoRow}>
            <IconSymbol size={16} name="info.circle.fill" color="#6366f1" />
            <ThemedText style={styles.infoLabel}>Status</ThemedText>
            <ThemedText style={styles.infoValue}>
              {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : 'Active'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  backToListButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  backToListText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 24,
  },
  contactAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  contactHeaderInfo: {
    flex: 1,
    marginLeft: 16,
    gap: 4,
  },
  contactName: {
    fontSize: 24,
    fontWeight: '700',
  },
  contactRole: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d97706',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    gap: 12,
  },
  brandInfo: {
    flex: 1,
    gap: 4,
  },
  brandLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  brandName: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  agencyBrandName: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
});