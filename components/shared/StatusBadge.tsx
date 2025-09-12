import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export type StatusType = 'branddeal' | 'instance';

interface StatusStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Reusable status badge component with consistent styling
 * Supports both brand deal and instance status types
 */
export function StatusBadge({ status, type, style, textStyle }: StatusBadgeProps) {
  if (!status) return null;
  
  const getStatusStyle = (status: string, type: StatusType): StatusStyle => {
    const lowerStatus = status.toLowerCase();
    
    if (type === 'branddeal') {
      // Brand deal status color mapping
      switch (lowerStatus) {
        case 'roster':
          return {
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            textColor: '#374151'
          };
        case 'waiting':
          return {
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            textColor: '#92400e'
          };
        case 'in progress':
          return {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            textColor: '#1e40af'
          };
        case 'invoiced':
          return {
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            textColor: '#7c3aed'
          };
        case 'complete':
          return {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            textColor: '#16a34a'
          };
        case 'canceled':
          return {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            textColor: '#dc2626'
          };
        default:
          return {
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            textColor: '#374151'
          };
      }
    } else {
      // Instance status color mapping
      switch (lowerStatus) {
        case 'none':
          return {
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            textColor: '#374151'
          };
        case 'waiting for product':
          return {
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            textColor: '#92400e'
          };
        case 'no submission':
          return {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            textColor: '#dc2626'
          };
        case 'brand review':
          return {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            textColor: '#1e40af'
          };
        case 'revising':
          return {
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            textColor: '#92400e'
          };
        case 'ready to post':
          return {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            textColor: '#16a34a'
          };
        case 'posted':
          return {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            textColor: '#16a34a'
          };
        case 'invoice pending':
          return {
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            textColor: '#7c3aed'
          };
        case 'paid':
          return {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            textColor: '#16a34a'
          };
        default:
          return {
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            textColor: '#374151'
          };
      }
    }
  };
  
  const statusStyle = getStatusStyle(status, type);
  
  // Default styling - can be customized per usage
  const badgeStyle = type === 'instance' ? styles.instanceBadge : styles.branddealBadge;
  
  return (
    <ThemedView style={[
      badgeStyle,
      {
        backgroundColor: statusStyle.backgroundColor,
        borderColor: statusStyle.borderColor,
      },
      style
    ]}>
      <ThemedText style={[
        styles.statusText,
        { color: statusStyle.textColor },
        textStyle
      ]}>
        {status}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Brand deal badges - slightly smaller for cards
  branddealBadge: {
    paddingHorizontal: 6,
    paddingVertical: 0,
    borderRadius: 4,
    borderWidth: 1,
  },
  // Instance badges - slightly larger for detail views
  instanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 12,
  },
});

// Export helper function for use in other components like AddCreatorSheet
export const getStatusStyle = (status: string, type: StatusType = 'instance'): StatusStyle => {
  const badge = { status, type, style: undefined, textStyle: undefined };
  const lowerStatus = status.toLowerCase();
  
  if (type === 'branddeal') {
    switch (lowerStatus) {
      case 'roster':
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', borderColor: 'rgba(107, 114, 128, 0.3)', textColor: '#374151' };
      case 'waiting':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', textColor: '#92400e' };
      case 'in progress':
        return { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', textColor: '#1e40af' };
      case 'invoiced':
        return { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)', textColor: '#7c3aed' };
      case 'complete':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', textColor: '#16a34a' };
      case 'canceled':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', textColor: '#dc2626' };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', borderColor: 'rgba(107, 114, 128, 0.3)', textColor: '#374151' };
    }
  } else {
    switch (lowerStatus) {
      case 'none':
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', borderColor: 'rgba(107, 114, 128, 0.3)', textColor: '#374151' };
      case 'waiting for product':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', textColor: '#92400e' };
      case 'no submission':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', textColor: '#dc2626' };
      case 'brand review':
        return { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', textColor: '#1e40af' };
      case 'revising':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', textColor: '#92400e' };
      case 'ready to post':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', textColor: '#16a34a' };
      case 'posted':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', textColor: '#16a34a' };
      case 'invoice pending':
        return { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)', textColor: '#7c3aed' };
      case 'paid':
        return { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', textColor: '#16a34a' };
      default:
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', borderColor: 'rgba(107, 114, 128, 0.3)', textColor: '#374151' };
    }
  }
};