import React, { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BubbleThing, Instance0963 } from '@/services/bubbleAPI';
import { useUser } from '@/hooks/useUser';

interface InstanceCardProps {
  instance: BubbleThing & Instance0963;
}

// Component for instance status badge
const InstanceStatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  
  const getStatusStyle = (status: string) => {
    // Status color mapping for instances
    switch (status.toLowerCase()) {
      case 'draft':
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: 'rgba(107, 114, 128, 0.3)',
          textColor: '#374151'
        };
      case 'in-review':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          textColor: '#92400e'
        };
      case 'approved':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          textColor: '#166534'
        };
      case 'posted':
        return {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          textColor: '#3730a3'
        };
      case 'rejected':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
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

// Component for platform icon
const PlatformIcon = ({ platform }: { platform?: string }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return 'video.fill';
      case 'instagram':
        return 'camera.fill';
      case 'youtube':
        return 'play.fill';
      case 'twitter':
      case 'x':
        return 'text.bubble.fill';
      default:
        return 'globe';
    }
  };

  if (!platform) return null;

  return (
    <ThemedView style={styles.platformContainer}>
      <IconSymbol size={14} name={getPlatformIcon(platform)} color="#6366f1" />
      <ThemedText style={styles.platformText}>{platform}</ThemedText>
    </ThemedView>
  );
};

// Component for price and rate display
const PriceRateDisplay = ({ price, rate }: { price?: number; rate?: number }) => {
  return (
    <ThemedView style={styles.priceContainer}>
      <ThemedView style={styles.priceItem}>
        <ThemedText style={styles.priceLabel}>Rate</ThemedText>
        <ThemedText style={styles.rateText}>
          {rate ? `$${rate.toLocaleString()}` : 'TBD'}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.priceItem}>
        <ThemedText style={styles.priceLabel}>Price</ThemedText>
        <ThemedText style={styles.priceText}>
          {price ? `$${price.toLocaleString()}` : 'TBD'}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default function InstanceCard({ instance }: InstanceCardProps) {
  // Fetch user data using the user ID from the instance
  const { data: userData, isLoading: userLoading, error: userError } = useUser(instance.user);
  const [imageError, setImageError] = useState(false);
  
  // Use user data if available, fallback to instance username
  const displayName = userData?.username ?? instance.username ?? "Unknown User";
  const userImage = userData?.image;
  
  // Fix protocol-relative URLs (starting with //)
  const getImageUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return url;
  };
  
  const imageUrl = getImageUrl(userImage);

  return (
    <ThemedView style={styles.card}>
      {/* Header Row */}
      <ThemedView style={styles.headerRow}>
        <ThemedView style={styles.userInfo}>
          <ThemedView style={styles.userAvatar}>
            {imageUrl && !imageError ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.userAvatarImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <ThemedText style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </ThemedText>
            )}
          </ThemedView>
          <ThemedView style={styles.userDetails}>
            <ThemedText type="defaultSemiBold" style={styles.username}>
              {userLoading ? "Loading..." : displayName}
            </ThemedText>
            <PlatformIcon platform={instance.platform} />
          </ThemedView>
        </ThemedView>
        <InstanceStatusBadge status={instance["instance-status"]} />
      </ThemedView>

      {/* Price and Rate Section */}
      <PriceRateDisplay price={instance.price} rate={instance.rate} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 16,
    lineHeight: 20,
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  platformText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceItem: {
    alignItems: 'center',
    gap: 2,
  },
  priceLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669', // Green color for creator rate
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1', // Indigo color for company price
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    lineHeight: 14,
  },
});