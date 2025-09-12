import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { Card } from '@/components/layout/Card';
import * as Clipboard from 'expo-clipboard';

interface AgencyBillingCardProps {
  agency: BubbleThing & Brand;
}

const BillingRow = ({ 
  icon, 
  label, 
  value,
  copyable = false,
  onPress
}: { 
  icon: string; 
  label: string; 
  value?: string; 
  copyable?: boolean;
  onPress?: () => void;
}) => {
  if (!value) return null;
  
  const handleCopy = async () => {
    if (copyable && value) {
      await Clipboard.setStringAsync(value);
      Alert.alert('Copied', `${label} copied to clipboard`);
    }
  };
  
  const handlePress = onPress || (copyable ? handleCopy : undefined);
  
  const content = (
    <ThemedView style={styles.billingRow}>
      <ThemedView style={styles.billingLeft}>
        <IconSymbol size={16} name={icon} color="#8b5cf6" />
        <ThemedText style={styles.billingLabel}>{label}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.billingRight}>
        <ThemedText style={[
          styles.billingValue,
          handlePress && styles.billingValueClickable
        ]}>
          {value}
        </ThemedText>
        {copyable && (
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <IconSymbol size={14} name="doc.on.doc.fill" color="#8b5cf6" />
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
  
  if (handlePress && !copyable) {
    return (
      <TouchableOpacity onPress={handlePress}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

const AddressDisplay = ({ address }: { address?: Brand['billing-address'] }) => {
  if (!address) return null;
  
  const formatAddress = () => {
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.city) {
      const cityState = [address.city, address.state].filter(Boolean).join(', ');
      if (address.postal_code) {
        parts.push(`${cityState} ${address.postal_code}`);
      } else {
        parts.push(cityState);
      }
    }
    if (address.country && address.country !== 'US') {
      parts.push(address.country);
    }
    return parts.join('\n');
  };
  
  return (
    <BillingRow
      icon="location.fill"
      label="Billing Address"
      value={formatAddress()}
    />
  );
};

export default function AgencyBillingCard({ agency }: AgencyBillingCardProps) {
  const handleStripePress = () => {
    const customerId = agency["stripe-customer-id"];
    if (customerId) {
      Alert.alert(
        'Stripe Dashboard',
        'This would open the Stripe dashboard for this customer.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Copy ID', onPress: () => Clipboard.setStringAsync(customerId) }
        ]
      );
    }
  };
  
  const hasBillingInfo = agency["stripe-customer-id"] || 
                         agency["billing-email"] || 
                         agency["tax-id"] || 
                         agency["payment-terms"];
  
  if (!hasBillingInfo) {
    return (
      <Card style={styles.card}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Billing & Payments
        </ThemedText>
        
        <ThemedView style={styles.emptyState}>
          <IconSymbol size={32} name="creditcard" color="#D1D5DB" />
          <ThemedText style={styles.emptyText}>
            No billing information available
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Billing details will appear here once configured
          </ThemedText>
        </ThemedView>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <ThemedView style={styles.titleRow}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Billing & Payments
        </ThemedText>
        {agency["stripe-customer-id"] && (
          <TouchableOpacity style={styles.stripeButton} onPress={handleStripePress}>
            <IconSymbol size={14} name="link" color="white" />
            <ThemedText style={styles.stripeButtonText}>Stripe</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
      
      <ThemedView style={styles.cardContent}>
        <BillingRow
          icon="creditcard.fill"
          label="Stripe Customer ID"
          value={agency["stripe-customer-id"]}
          copyable={true}
        />
        
        <BillingRow
          icon="building.2.fill"
          label="Stripe Account ID"
          value={agency["stripe-account-id"]}
          copyable={true}
        />
        
        <BillingRow
          icon="envelope.fill"
          label="Billing Email"
          value={agency["billing-email"]}
        />
        
        <BillingRow
          icon="doc.text.fill"
          label="Tax ID"
          value={agency["tax-id"]}
          copyable={true}
        />
        
        <BillingRow
          icon="calendar.badge.clock"
          label="Payment Terms"
          value={agency["payment-terms"]}
        />
        
        <BillingRow
          icon="number"
          label="Invoice Prefix"
          value={agency["invoice-prefix"]}
        />
        
        <BillingRow
          icon="creditcard"
          label="Payment Method"
          value={agency["payment-method"]}
        />
        
        <AddressDisplay address={agency["billing-address"]} />
      </ThemedView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: '#374151',
  },
  stripeButton: {
    backgroundColor: '#635bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  stripeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 12,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  billingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  billingLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  billingRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: 180,
  },
  billingValue: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  billingValueClickable: {
    color: '#8b5cf6',
  },
  copyButton: {
    padding: 4,
    marginTop: -4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});