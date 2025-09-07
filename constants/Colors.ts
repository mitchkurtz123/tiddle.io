/**
 * Tiddle.io Color System
 * Professional color palette optimized for both light and dark modes
 */

// Primary brand colors
const primaryLight = '#6366f1'; // Modern indigo
const primaryDark = '#818cf8';  // Lighter indigo for dark mode

// Additional brand colors
const secondaryLight = '#f59e0b'; // Warm amber
const secondaryDark = '#fbbf24';  // Lighter amber for dark mode

export const Colors = {
  light: {
    // Core colors
    text: '#1f2937',          // Rich dark gray
    textSecondary: '#6b7280', // Medium gray for secondary text
    background: '#ffffff',    // Pure white
    backgroundSecondary: '#f9fafb', // Light gray for cards/surfaces
    
    // Brand colors
    tint: primaryLight,
    secondary: secondaryLight,
    
    // UI colors
    icon: '#6b7280',
    iconSecondary: '#9ca3af',
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryLight,
    
    // Semantic colors
    success: '#10b981',       // Green
    warning: '#f59e0b',       // Amber
    error: '#ef4444',         // Red
    info: '#3b82f6',          // Blue
    
    // Surface colors
    surface: '#ffffff',
    surfaceSecondary: '#f3f4f6',
    border: '#e5e7eb',
    borderFocus: primaryLight,
  },
  dark: {
    // Core colors
    text: '#f9fafb',          // Light gray
    textSecondary: '#d1d5db', // Medium light gray
    background: '#111827',    // Deep dark blue-gray
    backgroundSecondary: '#1f2937', // Lighter dark gray
    
    // Brand colors
    tint: primaryDark,
    secondary: secondaryDark,
    
    // UI colors
    icon: '#9ca3af',
    iconSecondary: '#6b7280',
    tabIconDefault: '#6b7280',
    tabIconSelected: primaryDark,
    
    // Semantic colors
    success: '#34d399',       // Lighter green
    warning: '#fbbf24',       // Lighter amber
    error: '#f87171',         // Lighter red
    info: '#60a5fa',          // Lighter blue
    
    // Surface colors
    surface: '#1f2937',
    surfaceSecondary: '#374151',
    border: '#374151',
    borderFocus: primaryDark,
  },
};
