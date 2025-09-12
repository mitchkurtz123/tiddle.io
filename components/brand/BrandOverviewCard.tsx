import React from 'react';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { Card } from '@/components/layout/Card';

interface BrandOverviewCardProps {
  brand: BubbleThing & Brand;
}

const InfoRow = ({ 
  icon, 
  label, 
  value, 
  onPress,
  isLink = false 
}: { 
  icon: string; 
  label: string; 
  value?: string | number; 
  onPress?: () => void;
  isLink?: boolean;
}) => {
  if (!value) return null;
  
  const content = (
    <ThemedView style={styles.infoRow}>
      <ThemedView style={styles.infoLeft}>
        <IconSymbol size={16} name={icon} color="#10b981" />
        <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      </ThemedView>
      <ThemedText style={[
        styles.infoValue,
        isLink && styles.infoValueLink,
        onPress && styles.infoValueClickable
      ]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </ThemedText>
    </ThemedView>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

export default function BrandOverviewCard({ brand }: BrandOverviewCardProps) {
  const handleWebsitePress = () => {
    if (brand.website) {
      const url = brand.website.startsWith('http') ? brand.website : `https://${brand.website}`;
      Linking.openURL(url);
    }
  };
  
  const handlePhonePress = () => {
    if (brand.phone) {
      Linking.openURL(`tel:${brand.phone}`);
    }
  };
  
  const formatFoundedDate = (date?: string) => {
    if (!date) return undefined;
    try {
      return new Date(date).getFullYear().toString();
    } catch {
      return date;
    }
  };

  return (
    <Card style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
        Brand Information
      </ThemedText>
      
      <ThemedView style={styles.cardContent}>
        <InfoRow 
          icon="building.2.fill" 
          label="Legal Name" 
          value={brand.legalname} 
        />
        
        <InfoRow 
          icon="globe" 
          label="Website" 
          value={brand.website}
          onPress={handleWebsitePress}
          isLink={true}
        />
        
        <InfoRow 
          icon="phone.fill" 
          label="Phone" 
          value={brand.phone}
          onPress={handlePhonePress}
          isLink={true}
        />
        
        <InfoRow 
          icon="calendar" 
          label="Founded" 
          value={formatFoundedDate(brand["founded-date"])}
        />
        
        <InfoRow 
          icon="person.2.fill" 
          label="Employees" 
          value={brand["employee-count"]}
        />
        
        <InfoRow 
          icon="tag.fill" 
          label="Classification" 
          value={brand.classification}
        />

        {brand.notes && (
          <ThemedView style={styles.notesSection}>
            <ThemedView style={styles.notesTitleRow}>
              <IconSymbol size={16} name="doc.text.fill" color="#10b981" />
              <ThemedText style={styles.notesTitle}>Notes</ThemedText>
            </ThemedView>
            <ThemedText style={styles.notesText}>{brand.notes}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 16,
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
    maxWidth: 180,
  },
  infoValueLink: {
    color: '#10b981',
  },
  infoValueClickable: {
    textDecorationLine: 'underline',
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  notesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});