import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ImageWithFallback } from '@/components/shared/ImageWithFallback';
import { Card } from '@/components/layout/Card';
import { EnhancedBrandContact } from '@/hooks/useBrandContactsList';

interface ContactListCardProps {
  item: EnhancedBrandContact;
  onPress?: (item: EnhancedBrandContact) => void;
}

// Component for contact avatar with fallback
const ContactAvatar = ({ contact }: { contact: EnhancedBrandContact }) => {
  return (
    <ImageWithFallback
      url={contact.profileimage}
      style={styles.contactAvatar}
      fallbackText={(contact.name ?? "C").charAt(0).toUpperCase()}
      fallbackStyle={styles.avatarPlaceholder}
      fallbackTextStyle={styles.placeholderText}
    />
  );
};

// Component for contact status badge
const ContactStatusBadge = ({ status, isPrimary }: { status?: string; isPrimary?: boolean }) => {
  if (isPrimary) {
    return (
      <ThemedView style={styles.primaryBadge}>
        <IconSymbol size={10} name="star.fill" color="#f59e0b" />
        <ThemedText style={styles.primaryBadgeText}>Primary</ThemedText>
      </ThemedView>
    );
  }
  
  if (!status || status === 'active') return null;
  
  const getStatusColor = () => {
    switch (status) {
      case 'inactive': return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#374151' };
      case 'archived': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#dc2626' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#374151' };
    }
  };
  
  const colors = getStatusColor();
  
  return (
    <ThemedView style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <ThemedText style={[styles.statusBadgeText, { color: colors.text }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </ThemedText>
    </ThemedView>
  );
};

// Component for brand association display
const BrandAssociations = ({ contact }: { contact: EnhancedBrandContact }) => {
  return (
    <ThemedView style={styles.brandAssociations}>
      {/* Main brand */}
      {contact.resolvedBrand && (
        <ThemedView style={styles.brandInfo}>
          <IconSymbol size={12} name="building.2.fill" color="#10b981" />
          <ThemedText style={styles.brandText}>
            {contact.resolvedBrand.brandname ?? 'Unknown Brand'}
          </ThemedText>
        </ThemedView>
      )}
      
      {/* Agency brands */}
      {contact.resolvedAgencyBrands && contact.resolvedAgencyBrands.length > 0 && (
        <ThemedView style={styles.agencyInfo}>
          <IconSymbol size={12} name="network" color="#8b5cf6" />
          <ThemedText style={styles.agencyText}>
            {contact.resolvedAgencyBrands.map(brand => brand.brandname).filter(Boolean).join(', ')}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default function ContactListCard({ item, onPress }: ContactListCardProps) {
  const handlePress = () => {
    // If custom onPress is provided, use it; otherwise navigate to contact detail screen
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/brand-contact/${item._id}`);
    }
  };

  const CardContent = (
    <>
      <ContactAvatar contact={item} />
      <ThemedView style={styles.contactInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {item.name ?? "(unnamed contact)"}
          </ThemedText>
          <ContactStatusBadge status={item.status} isPrimary={item["is-primary"]} />
        </ThemedView>
        
        {/* Brand associations */}
        <BrandAssociations contact={item} />
        
        <ThemedView style={styles.detailsColumn}>
          {item.role && (
            <ThemedText style={styles.role}>{item.role}</ThemedText>
          )}
          {item.email && (
            <ThemedView style={styles.contactDetail}>
              <IconSymbol size={12} name="envelope.fill" color="#666" />
              <ThemedText style={styles.detailText}>{item.email}</ThemedText>
            </ThemedView>
          )}
          {item.phone && (
            <ThemedView style={styles.contactDetail}>
              <IconSymbol size={12} name="phone.fill" color="#666" />
              <ThemedText style={styles.detailText}>{item.phone}</ThemedText>
            </ThemedView>
          )}
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
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10b981', // Green for contacts
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  brandAssociations: {
    gap: 4,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    flex: 1,
  },
  agencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agencyText: {
    fontSize: 13,
    color: '#8b5cf6',
    fontWeight: '500',
    flex: 1,
  },
  role: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailsColumn: {
    gap: 4,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  primaryBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#d97706',
    lineHeight: 12,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 12,
  },
});