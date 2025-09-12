import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing, isAgency } from '@/services/bubbleAPI';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';

interface BrandDetailHeaderProps {
  brand: BubbleThing & Brand;
  contactCount?: number;
  onBack?: () => void;
}

export default function BrandDetailHeader({ 
  brand,
  contactCount = 0,
  onBack
}: BrandDetailHeaderProps) {
  const campaignCount = 0; // Will be populated later

  return (
    <ThemedView style={styles.container}>
      {/* Back button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <IconSymbol size={24} name="arrow.left" color="#6366f1" />
        </TouchableOpacity>
      )}

      {/* Brand image */}
      <ImageWithFallback
        url={brand.image}
        style={styles.brandImage}
        fallbackText={(brand.brandname ?? "BR").charAt(0).toUpperCase()}
        fallbackStyle={styles.imagePlaceholder}
        fallbackTextStyle={styles.placeholderText}
      />

      {/* Brand info */}
      <ThemedView style={styles.brandInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>
            {brand.brandname ?? "(untitled brand)"}
          </ThemedText>
          {isAgency(brand) ? (
            <ThemedView style={styles.agencyBadge}>
              <IconSymbol size={12} name="building.2.fill" color="#8b5cf6" />
              <ThemedText style={styles.agencyBadgeText}>Agency</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.brandBadge}>
              <IconSymbol size={12} name="tag.fill" color="#10b981" />
              <ThemedText style={styles.brandBadgeText}>Brand</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {brand.legalname && (
          <ThemedText style={styles.legalName}>{brand.legalname}</ThemedText>
        )}

        {/* Stats row */}
        <ThemedView style={styles.statsRow}>
          <ThemedView style={styles.stat}>
            <IconSymbol size={16} name="person.2.fill" color="#10b981" />
            <ThemedText style={styles.statText}>
              {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.stat}>
            <IconSymbol size={16} name="megaphone.fill" color="#10b981" />
            <ThemedText style={styles.statText}>
              {campaignCount} {campaignCount === 1 ? 'campaign' : 'campaigns'}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Notes if available */}
        {brand.notes && (
          <ThemedText style={styles.notes} numberOfLines={2}>
            {brand.notes}
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
  brandImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignSelf: 'center',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandInfo: {
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
  brandBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
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
    color: '#10b981',
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
    color: '#10b981',
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