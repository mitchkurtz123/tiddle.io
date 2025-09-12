import React from 'react';
import { StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface DataListViewProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  loadingText?: string;
  errorTitle?: string;
  errorText?: string;
  style?: StyleProp<ViewStyle>;
  centerStyle?: StyleProp<ViewStyle>;
}

/**
 * Generic data list view wrapper that handles loading, error, and success states
 * Consolidates the repetitive loading/error patterns across list screens
 */
export function DataListView({
  children,
  isLoading,
  error,
  loadingText = 'Loading...',
  errorTitle = 'Oops!',
  errorText = 'Something went wrong',
  style,
  centerStyle,
}: DataListViewProps) {
  
  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={[styles.centerContainer, centerStyle]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>{loadingText}</ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView style={[styles.centerContainer, centerStyle]}>
        <ThemedText type="title" style={styles.errorTitle}>{errorTitle}</ThemedText>
        <ThemedText style={styles.errorText}>{errorText}</ThemedText>
      </ThemedView>
    );
  }

  // Success state - render children in container
  return (
    <ThemedView style={[styles.container, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, // Standard safe area padding
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
});