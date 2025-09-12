import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';

interface BrandCardProps {
  item: BubbleThing & Brand;
  onPress?: (item: BubbleThing & Brand) => void;
}

// Component for brand logo with fallback
const BrandLogo = ({ brand }: { brand: BubbleThing & Brand }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fix protocol-relative URLs (starting with //)
  const getImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    
    // If URL starts with //, add https:
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    return url;
  };
  
  const logoUrl = getImageUrl(brand.image);
  
  if (logoUrl && !imageError) {
    return (
      <Image
        source={{ uri: logoUrl }}
        style={styles.brandLogo}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback placeholder
  return (
    <ThemedView style={styles.logoPlaceholder}>
      <ThemedText type="defaultSemiBold" style={styles.placeholderText}>
        {(brand.brandname ?? "BR").charAt(0).toUpperCase()}
      </ThemedText>
    </ThemedView>
  );
};

// Component for contact count display
const ContactCount = ({ contactCount }: { contactCount?: number }) => {
  const count = contactCount || 0;
  
  return (
    <ThemedView style={styles.contactCount}>
      <IconSymbol size={14} name="person.2.fill" color="#666" />
      <ThemedText style={styles.contactCountText}>{count}</ThemedText>
    </ThemedView>
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
    <ThemedView style={styles.brandCard}>
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
          <ContactCount contactCount={item["contact-count"]} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  // Always wrap in TouchableOpacity for navigation
  return (
    <TouchableOpacity onPress={handlePress}>
      {CardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactCountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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