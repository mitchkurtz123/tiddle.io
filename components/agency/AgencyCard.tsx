import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { Card } from '@/components/layout/Card';

interface AgencyCardProps {
  item: BubbleThing & Brand;
  onPress?: (item: BubbleThing & Brand) => void;
}

// Component for agency logo with fallback
const AgencyLogo = ({ agency }: { agency: BubbleThing & Brand }) => {
  return (
    <ImageWithFallback
      url={agency.image}
      style={styles.agencyLogo}
      fallbackText={(agency.brandname ?? "AG").charAt(0).toUpperCase()}
      fallbackStyle={styles.logoPlaceholder}
      fallbackTextStyle={styles.placeholderText}
    />
  );
};

// Component for managed brands count
const ManagedBrandsCount = ({ count }: { count?: number }) => {
  const brandCount = count || 0;
  
  return (
    <ThemedView style={styles.brandCount}>
      <IconSymbol size={14} name="building.2.fill" color="#666" />
      <ThemedText style={styles.brandCountText}>
        {brandCount} {brandCount === 1 ? 'brand' : 'brands'}
      </ThemedText>
    </ThemedView>
  );
};

// Component for agency badge indicator
const AgencyBadge = () => {
  return (
    <ThemedView style={styles.agencyBadge}>
      <IconSymbol size={10} name="building.2.fill" color="#6366f1" />
      <ThemedText style={styles.agencyBadgeText}>Agency</ThemedText>
    </ThemedView>
  );
};

export default function AgencyCard({ item, onPress }: AgencyCardProps) {
  const handlePress = () => {
    // If custom onPress is provided, use it; otherwise navigate to agency detail screen
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/agency/${item._id}`);
    }
  };

  const CardContent = (
    <>
      <AgencyLogo agency={item} />
      <ThemedView style={styles.agencyInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {item.brandname ?? "(untitled agency)"}
          </ThemedText>
          <AgencyBadge />
        </ThemedView>
        <ThemedView style={styles.bottomRow}>
          <ThemedText style={styles.subtitle}>
            {item.legalname || 'Agency'}
          </ThemedText>
          <ManagedBrandsCount count={item["brand-count"]} />
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
  agencyLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#8b5cf6', // Purple for agencies
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  agencyInfo: {
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
    color: '#8b5cf6', // Purple color for agencies
    fontWeight: '500',
  },
  brandCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandCountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  agencyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  agencyBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#6d28d9',
    lineHeight: 14,
  },
});