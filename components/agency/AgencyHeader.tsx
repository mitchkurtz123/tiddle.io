import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

interface AgencyHeaderProps {
  agency: BubbleThing & Brand;
  onBack?: () => void;
  onAddBrand?: () => void;
  onAddContact?: () => void;
}

export default function AgencyHeader({ 
  agency,
  onBack,
  onAddBrand,
  onAddContact 
}: AgencyHeaderProps) {
  const brandCount = agency["brand-count"] || 0;
  const contactCount = agency["contact-count"] || 0;

  return (
    <ThemedView style={styles.container}>
      {/* Back button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <IconSymbol size={24} name="arrow.left" color="#6366f1" />
        </TouchableOpacity>
      )}

      {/* Agency image */}
      <ImageWithFallback
        url={agency.image}
        style={styles.agencyImage}
        fallbackText={(agency.brandname ?? "AG").charAt(0).toUpperCase()}
        fallbackStyle={styles.imagePlaceholder}
        fallbackTextStyle={styles.placeholderText}
      />

      {/* Agency info */}
      <ThemedView style={styles.agencyInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>
            {agency.brandname ?? "(untitled agency)"}
          </ThemedText>
          <ThemedView style={styles.agencyBadge}>
            <IconSymbol size={12} name="building.2.fill" color="#8b5cf6" />
            <ThemedText style={styles.agencyBadgeText}>Agency</ThemedText>
          </ThemedView>
        </ThemedView>

        {agency.legalname && (
          <ThemedText style={styles.legalName}>{agency.legalname}</ThemedText>
        )}

        {/* Stats row */}
        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.stat}>
            <IconSymbol size={16} name="building.2.fill" color="#8b5cf6" />
            <ThemedText style={styles.statText}>
              {brandCount} {brandCount === 1 ? 'brand' : 'brands'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.stat}>
            <IconSymbol size={16} name="person.2.fill" color="#8b5cf6" />
            <ThemedText style={styles.statText}>
              {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Notes if available */}
        {agency.notes && (
          <ThemedText style={styles.notes} numberOfLines={2}>
            {agency.notes}
          </ThemedText>
        )}
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
  },
  agencyImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignSelf: 'center',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  agencyInfo: {
    alignItems: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  agencyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agencyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6d28d9',
  },
  legalName: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '500',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});