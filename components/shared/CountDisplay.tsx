import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface CountDisplayProps {
  count: number;
  singular: string;
  plural?: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showZero?: boolean;
}

/**
 * Reusable count display component for showing counts with icons
 * Supports both contact counts and user counts patterns
 */
export function CountDisplay({
  count,
  singular,
  plural,
  icon = 'person.fill',
  iconSize = 14,
  iconColor = '#666',
  style,
  textStyle,
  showZero = true,
}: CountDisplayProps) {
  const normalizedCount = count || 0;
  
  // Don't render if count is 0 and showZero is false
  if (normalizedCount === 0 && !showZero) return null;
  
  // Determine text label
  const label = normalizedCount === 1 ? singular : (plural || `${singular}s`);
  
  return (
    <ThemedView style={[styles.container, style]}>
      <IconSymbol size={iconSize} name={icon} color={iconColor} />
      <ThemedText style={[styles.text, textStyle]}>
        {normalizedCount}
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Specialized component for contact counts (used in BrandCard)
 */
export function ContactCount({ count, style, textStyle }: {
  count?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <CountDisplay
      count={count || 0}
      singular="contact"
      icon="person.2.fill"
      style={style}
      textStyle={textStyle}
    />
  );
}

/**
 * Specialized component for user/creator counts (used in CampaignCard and BrandDealHeader)
 */
export function UserCount({ count, label, style, textStyle }: {
  count?: number;
  label?: 'user' | 'creator';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const singular = label || 'user';
  
  return (
    <CountDisplay
      count={count || 0}
      singular={singular}
      icon="person.fill"
      style={style}
      textStyle={textStyle}
    />
  );
}

/**
 * Extended user count component with full label (used in BrandDealHeader)
 */
export function UserCountWithLabel({ count, style, textStyle }: {
  count?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const normalizedCount = count || 0;
  const label = normalizedCount === 1 ? 'creator' : 'creators';
  
  return (
    <ThemedView style={[styles.container, style]}>
      <IconSymbol size={16} name="person.fill" color="#6366f1" />
      <ThemedText style={[styles.labelText, textStyle]}>
        {normalizedCount} {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  labelText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
});