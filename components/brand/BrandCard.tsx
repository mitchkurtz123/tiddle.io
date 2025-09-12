import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { ContactCount } from '@/components/shared/CountDisplay';
import { Card } from '@/components/layout/Card';

interface BrandCardProps {
  item: BubbleThing & Brand;
  onPress?: (item: BubbleThing & Brand) => void;
}

// Component for brand logo with fallback
const BrandLogo = ({ brand }: { brand: BubbleThing & Brand }) => {
  return (
    <ImageWithFallback
      url={brand.image}
      style={styles.brandLogo}
      fallbackText={(brand.brandname ?? "BR").charAt(0).toUpperCase()}
      fallbackStyle={styles.logoPlaceholder}
      fallbackTextStyle={styles.placeholderText}
    />
  );
};


// Component for niche badge (shows only first niche to save space)
const NicheBadges = ({ niches }: { niches?: string[] }) => {
  if (!niches || niches.length === 0) return null;
  
  // Show only the first niche
  const firstNiche = niches[0];
  
  return (
    <ThemedView style={styles.nicheBadge}>
      <ThemedText style={styles.nicheText}>{firstNiche}</ThemedText>
    </ThemedView>
  );
};

export default function BrandCard({ item, onPress }: BrandCardProps) {
  const handlePress = () => {
    // If custom onPress is provided, use it; otherwise navigate to detail screen
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/brand/${item._id}`);
    }
  };

  const CardContent = (
    <>
      <BrandLogo brand={item} />
      <ThemedView style={styles.brandInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {item.brandname ?? "(untitled)"}
          </ThemedText>
          <NicheBadges niches={item.niche} />
        </ThemedView>
        <ThemedView style={styles.bottomRow}>
          <ThemedText style={styles.subtitle}>
            {item.legalname || 'Company'}
          </ThemedText>
          <ContactCount count={item["contact-count"]} style={styles.contactCount} textStyle={styles.contactCountText} />
        </ThemedView>
      </ThemedView>
    </>
  );

  // Use shared Card component
  return (
    <Card onPress={handlePress} style={styles.cardOverride}>
      {CardContent}
    </Card>
  );
}

const styles = StyleSheet.create({
  cardOverride: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandInfo: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6366f1', // Purple color matching tab icons
    fontWeight: '500',
  },
  contactCount: {
    // Styling for ContactCount component
  },
  contactCountText: {
    // Styling for ContactCount text
  },
  nicheBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nicheText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#3730a3',
    lineHeight: 14,
  },
});