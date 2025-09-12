import React, { useState, ReactNode } from 'react';
import { Image, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface ImageWithFallbackProps {
  url?: string;
  style?: StyleProp<ImageStyle>;
  fallback?: ReactNode;
  fallbackText?: string;
  fallbackStyle?: StyleProp<ViewStyle>;
  fallbackTextStyle?: StyleProp<any>;
  onError?: () => void;
}

/**
 * Reusable image component with automatic protocol fixing and fallback support
 * Consolidates the duplicate URL fixing logic across the app
 */
export function ImageWithFallback({
  url,
  style,
  fallback,
  fallbackText,
  fallbackStyle,
  fallbackTextStyle,
  onError,
}: ImageWithFallbackProps) {
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
  
  const imageUrl = getImageUrl(url);
  
  const handleError = () => {
    setImageError(true);
    onError?.();
  };
  
  // If we have a valid image URL and no error, show the image
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={style}
        onError={handleError}
      />
    );
  }
  
  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default fallback with text (commonly used pattern)
  if (fallbackText) {
    return (
      <ThemedView style={fallbackStyle}>
        <ThemedText style={fallbackTextStyle}>
          {fallbackText}
        </ThemedText>
      </ThemedView>
    );
  }
  
  // Basic empty fallback
  return <ThemedView style={[style, fallbackStyle]} />;
}