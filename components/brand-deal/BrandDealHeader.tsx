import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BrandDeal, BubbleThing } from '@/services/bubbleAPI';

interface BrandDealHeaderProps {
  brandDeal: BubbleThing & BrandDeal;
}

// Component for branddeal image with fallback
const BrandDealImage = ({ brandDeal }: { brandDeal: BubbleThing & BrandDeal }) => {
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
  
  const imageUrl = getImageUrl(brandDeal.image);
  
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.campaignImage}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback placeholder
  return (
    <ThemedView style={styles.imagePlaceholder}>
      <ThemedText type="defaultSemiBold" style={styles.placeholderText}>
        {(brandDeal.title ?? "BD").charAt(0).toUpperCase()}
      </ThemedText>
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

export default function BrandDealHeader({ brandDeal }: BrandDealHeaderProps) {
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <IconSymbol size={24} name="chevron.left" color="#6366f1" />
      </TouchableOpacity>

      {/* Campaign Image */}
      <ThemedView style={styles.imageContainer}>
        <BrandDealImage brandDeal={brandDeal} />
      </ThemedView>

      {/* Brand Deal Info */}
      <ThemedView style={styles.infoContainer}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>
            {brandDeal.title ?? "(Untitled Campaign)"}
          </ThemedText>
          <StatusBadge status={brandDeal["kaban-status"]} />
        </ThemedView>
        
        <ThemedText style={styles.brandName}>
          {brandDeal.brandname || 'Brand'}
        </ThemedText>
        
        {brandDeal["user-list"] && (
          <ThemedView style={styles.userCountContainer}>
            <IconSymbol size={16} name="person.fill" color="#6366f1" />
            <ThemedText style={styles.userCountText}>
              {brandDeal["user-list"].length} {brandDeal["user-list"].length === 1 ? 'creator' : 'creators'}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  campaignImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    flex: 0,
  },
  brandName: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
    textAlign: 'center',
  },
  userCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  userCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
    lineHeight: 16,
  },
});