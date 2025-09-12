import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Brand, BubbleThing } from '@/services/bubbleAPI';
import { Card } from '@/components/layout/Card';

interface AgencyStatsCardProps {
  agency: BubbleThing & Brand;
  managedBrandsCount?: number;
  totalContactsCount?: number;
}

// Component for stat item
const StatItem = ({ 
  icon, 
  label, 
  value, 
  color = '#8b5cf6' 
}: { 
  icon: string; 
  label: string; 
  value: number | string;
  color?: string;
}) => {
  return (
    <ThemedView style={styles.statItem}>
      <ThemedView style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <IconSymbol size={20} name={icon} color={color} />
      </ThemedView>
      <ThemedView style={styles.statContent}>
        <ThemedText style={styles.statValue}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default function AgencyStatsCard({ 
  agency, 
  managedBrandsCount = 0,
  totalContactsCount = 0 
}: AgencyStatsCardProps) {
  // Calculate days since agency was created
  const getDaysSinceCreated = () => {
    if (!agency.CreatedDate) return 0;
    const createdDate = new Date(agency.CreatedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysSinceCreated = getDaysSinceCreated();
  
  return (
    <Card style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
        Quick Stats
      </ThemedText>
      
      <ThemedView style={styles.statsGrid}>
        <StatItem
          icon="building.2.fill"
          label="Managed Brands"
          value={managedBrandsCount}
          color="#8b5cf6"
        />
        
        <StatItem
          icon="person.2.fill"
          label="Total Contacts"
          value={totalContactsCount}
          color="#10b981"
        />
        
        <StatItem
          icon="calendar"
          label="Days Active"
          value={daysSinceCreated}
          color="#f59e0b"
        />
        
        {agency["employee-count"] && (
          <StatItem
            icon="person.3.fill"
            label="Team Size"
            value={agency["employee-count"]}
            color="#6366f1"
          />
        )}
        
        {agency["commission-rate"] && (
          <StatItem
            icon="percent"
            label="Commission Rate"
            value={`${agency["commission-rate"]}%`}
            color="#ef4444"
          />
        )}
        
        {agency["annual-revenue"] && (
          <StatItem
            icon="chart.line.uptrend.xyaxis"
            label="Annual Revenue"
            value={agency["annual-revenue"] >= 1000000 
              ? `$${(agency["annual-revenue"] / 1000000).toFixed(1)}M`
              : `$${(agency["annual-revenue"] / 1000).toFixed(0)}K`
            }
            color="#8b5cf6"
          />
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minWidth: '45%',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
});