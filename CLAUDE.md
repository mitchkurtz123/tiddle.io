# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Tiddle.io**, an Expo React Native application using file-based routing with Expo Router. The app supports iOS, Android, and web platforms with automatic dark/light theme support and Bubble.io API integration for user management.

## Development Commands

### Core Development
- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start development server with platform options
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator  
- `npm run web` - Start on web browser

### Code Quality
- `npm run lint` - Run ESLint with Expo config
- TypeScript checking: Use IDE integration (no separate script defined)

### Project Reset
- `npm run reset-project` - Move starter code to `/app-example` and create blank `/app` directory

## Architecture

### File-Based Routing Structure
- `app/_layout.tsx` - Root layout with theme provider and navigation stack
- `app/(tabs)/` - Tab navigation group with bottom tabs
  - `index.tsx` - Home tab
  - `explore.tsx` - Explore tab
  - `users.tsx` - Users tab with Bubble.io API integration
  - `_layout.tsx` - Tab-specific layout with haptic feedback and blur effects
- `app/+not-found.tsx` - 404 page

### Component Organization
- `components/` - Reusable React components
  - UI primitives: `ThemedText`, `ThemedView`, `Collapsible`
  - Platform-specific: `HapticTab`, `ParallaxScrollView`
  - `ui/` - Platform-specific UI components (IconSymbol, TabBarBackground)
- `hooks/` - Custom React hooks for theme, color management, and API data fetching
  - `useUsers.ts` - React Query hook for user data from Bubble.io API
- `services/` - API clients and business logic services
  - `bubbleAPI.ts` - Bubble.io API client with TypeScript types and axios
- `constants/Colors.ts` - Theme color definitions for light/dark modes

### Platform Differences
- iOS: Uses SF Symbols via `IconSymbol.ios.tsx` and blur effects
- Other platforms: Fallback implementations in base component files
- Path alias `@/*` maps to project root for clean imports

### Key Technologies
- **Expo SDK 53** with new architecture enabled
- **React Native 0.79** with React 19
- **Expo Router 5** for file-based navigation
- **TypeScript** with strict mode enabled
- **TanStack Query (React Query)** for data fetching, caching, and synchronization
- **Axios** for HTTP client and API requests
- **Bubble.io API** for backend services and user management
- **Reanimated & Gesture Handler** for animations
- **ESLint** with Expo flat config

## Development Notes

### Theme System
The app uses automatic theme detection with `useColorScheme` hook and React Navigation's theme provider. Colors are defined in `constants/Colors.ts` with separate light/dark variants.

### API Integration with Bubble.io
The app integrates with Bubble.io for backend services:
- **Environment Variables**: Configure `EXPO_PUBLIC_BUBBLE_BASE_URL` and `EXPO_PUBLIC_BUBBLE_API_KEY`
- **API Client**: Located in `services/bubbleAPI.ts` with full TypeScript support
- **Data Fetching**: Uses React Query via `useUsers` hook for caching and synchronization
- **Error Handling**: Built-in loading states, error boundaries, and retry logic
- **Type Safety**: Complete TypeScript types for API responses and data models

### Data Fetching Patterns
- **React Query Integration**: All API calls use TanStack Query for caching and background updates
- **Custom Hooks**: Domain-specific hooks like `useUsers` encapsulate query logic
- **Stale Time**: 30-second stale time configured for user data caching
- **Automatic Retry**: Built-in retry logic for failed requests

### TypeScript Configuration
- Strict mode enabled
- Uses Expo's base TypeScript config
- Path alias `@/*` for root imports
- Typed routes enabled via experiments flag
- Full API type definitions in `services/bubbleAPI.ts`