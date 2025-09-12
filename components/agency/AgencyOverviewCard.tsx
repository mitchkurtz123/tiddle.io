import React from 'react';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { Card } from '@/components/layout/Card';

interface AgencyOverviewCardProps {
  agency: BubbleThing & Brand;
}

// Component for clickable info row
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
        <IconSymbol size={16} name={icon} color="#8b5cf6" />
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

export default function AgencyOverviewCard({ agency }: AgencyOverviewCardProps) {
  const handleWebsitePress = () => {
    if (agency.website) {
      const url = agency.website.startsWith('http') ? agency.website : `https://${agency.website}`;
      Linking.openURL(url);
    }
  };
  
  const handlePhonePress = () => {
    if (agency.phone) {
      Linking.openURL(`tel:${agency.phone}`);
    }
  };
  
  const formatFoundedDate = (date?: string) => {
    if (!date) return undefined;
    try {
      return new Date(date).getFullYear().toString();
    } catch {
      return date; // Return as-is if can't parse
    }
  };
  
  const formatRevenue = (revenue?: number) => {
    if (!revenue) return undefined;
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    }
    if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(0)}K`;
    }
    return `$${revenue.toLocaleString()}`;
  };

  return (
    <Card style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
        Agency Information
      </ThemedText>
      
      <ThemedView style={styles.cardContent}>
        {/* Basic Information */}
        <InfoRow 
          icon="building.2.fill" 
          label="Legal Name" 
          value={agency.legalname} 
        />
        
        <InfoRow 
          icon="globe" 
          label="Website" 
          value={agency.website}
          onPress={handleWebsitePress}
          isLink={true}
        />
        
        <InfoRow 
          icon="phone.fill" 
          label="Phone" 
          value={agency.phone}
          onPress={handlePhonePress}
          isLink={true}
        />
        
        <InfoRow 
          icon="calendar" 
          label="Founded" 
          value={formatFoundedDate(agency["founded-date"])}
        />
        
        {/* Business Metrics */}
        <InfoRow 
          icon="person.2.fill" 
          label="Employees" 
          value={agency["employee-count"]}
        />
        
        <InfoRow 
          icon="dollarsign.circle.fill" 
          label="Annual Revenue" 
          value={formatRevenue(agency["annual-revenue"])}
        />
        
        <InfoRow 
          icon="percent" 
          label="Commission Rate" 
          value={agency["commission-rate"] ? `${agency["commission-rate"]}%` : undefined}
        />
        
        {/* Notes */}
        {agency.notes && (
          <ThemedView style={styles.notesSection}>
            <ThemedView style={styles.notesTitleRow}>
              <IconSymbol size={16} name="doc.text.fill" color="#8b5cf6" />
              <ThemedText style={styles.notesTitle}>Notes</ThemedText>
            </ThemedView>
            <ThemedText style={styles.notesText}>{agency.notes}</ThemedText>
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
    color: '#8b5cf6',
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