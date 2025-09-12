import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export type CardVariant = 'default' | 'elevated' | 'outline';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/**
 * Generic card component that consolidates common card styling patterns
 * Used across BrandCard, CampaignCard, InstanceCard, etc.
 */
export function Card({ 
  children, 
  variant = 'default', 
  onPress, 
  style,
  disabled = false 
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    style,
    disabled && styles.disabled,
  ];

  if (onPress && !disabled) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={cardStyle}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  default: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  elevated: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  disabled: {
    opacity: 0.6,
  },
});