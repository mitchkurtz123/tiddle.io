import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BrandDeal, BubbleThing } from '@/services/bubbleAPI';

interface CampaignCardProps {
  item: BubbleThing & BrandDeal;
  onPress?: (item: BubbleThing & BrandDeal) => void;
}

// Component for branddeal image with fallback
const BranddealImage = ({ branddeal }: { branddeal: BubbleThing & BrandDeal }) => {
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
  
  const imageUrl = getImageUrl(branddeal.image);
  
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.branddealImage}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback placeholder
  return (
    <ThemedView style={styles.imagePlaceholder}>
      <ThemedText type="defaultSemiBold" style={styles.placeholderText}>
        {(branddeal.title ?? "BD").charAt(0).toUpperCase()}
      </ThemedText>
    </ThemedView>
  );
};

// Component for user count display
const UserCount = ({ userList }: { userList?: string[] }) => {
  const count = userList?.length || 0;
  
  // Always show for debugging - we can see if it's a data or display issue
  return (
    <ThemedView style={styles.userCount}>
      <IconSymbol size={14} name="person.fill" color="#666" />
      <ThemedText style={styles.userCountText}>{count}</ThemedText>
    </ThemedView>
  );
};

// Component for professional status badge
const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  
  const getStatusStyle = (status: string) => {
    // Professional color palette with refined tones
    switch (status.toLowerCase()) {
      case 'roster':
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)', // Subtle gray
          borderColor: 'rgba(107, 114, 128, 0.3)',
          textColor: '#374151'
        };
      case 'waiting':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)', // Warm amber
          borderColor: 'rgba(245, 158, 11, 0.3)',
          textColor: '#92400e'
        };
      case 'in progress':
        return {
          backgroundColor: 'rgba(99, 102, 241, 0.1)', // Professional indigo
          borderColor: 'rgba(99, 102, 241, 0.3)',
          textColor: '#3730a3'
        };
      case 'invoiced':
        return {
          backgroundColor: 'rgba(139, 92, 246, 0.1)', // Sophisticated purple
          borderColor: 'rgba(139, 92, 246, 0.3)',
          textColor: '#5b21b6'
        };
      case 'complete':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.1)', // Success green
          borderColor: 'rgba(34, 197, 94, 0.3)',
          textColor: '#166534'
        };
      case 'canceled':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)', // Muted red
          borderColor: 'rgba(239, 68, 68, 0.3)',
          textColor: '#991b1b'
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: 'rgba(107, 114, 128, 0.3)',
          textColor: '#374151'
        };
    }
  };
  
  const statusStyle = getStatusStyle(status);
  
  return (
    <ThemedView style={[
      styles.statusBadge, 
      { 
        backgroundColor: statusStyle.backgroundColor,
        borderColor: statusStyle.borderColor,
      }
    ]}>
      <ThemedText style={[styles.statusText, { color: statusStyle.textColor }]}>
        {status}
      </ThemedText>
    </ThemedView>
  );
};

export default function CampaignCard({ item, onPress }: CampaignCardProps) {
  const handlePress = () => {
    // If custom onPress is provided, use it; otherwise navigate to detail screen
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/brand-deal/${item._id}`);
    }
  };

  const CardContent = (
    <ThemedView style={styles.branddealCard}>
      <BranddealImage branddeal={item} />
      <ThemedView style={styles.branddealInfo}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {item.title ?? "(untitled)"}
          </ThemedText>
          <StatusBadge status={item["kaban-status"]} />
        </ThemedView>
        <ThemedView style={styles.bottomRow}>
          <ThemedText style={styles.subtitle}>
            {item.brandname || 'Brand'}
          </ThemedText>
          <UserCount userList={item["user-list"]} />
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
  branddealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  branddealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  imagePlaceholder: {
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
  branddealInfo: {
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
  userCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userCountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    lineHeight: 16, // Tight line height to reduce vertical space
    includeFontPadding: false, // Android: removes extra font padding
    textAlignVertical: 'center', // Android: center text vertically
  },
});