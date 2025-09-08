# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Tiddle.io**, a professional Expo React Native application with complete authentication and API integration. Built with file-based routing using Expo Router, the app features:

- **Complete Authentication System** - Secure login/logout with Bubble.io backend integration
- **Protected Routes** - Authentication-gated navigation with automatic redirects
- **Professional UI/UX** - Custom branded login screen with modern design system
- **User Management** - Full user listing with profile images and pull-to-refresh
- **Multi-Platform Support** - iOS, Android, and web with responsive design
- **Modern Architecture** - TypeScript, React Query, and comprehensive error handling

The app uses Bubble.io as the backend service for authentication and user data management.

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
- `app/_layout.tsx` - Root layout with AuthProvider, QueryClient, and theme providers
- `app/login.tsx` - Professional login screen with branded UI and form validation
- `app/(tabs)/` - Protected tab navigation group (requires authentication)
  - `index.tsx` - Home tab
  - `explore.tsx` - Explore tab
  - `users.tsx` - Users management with profile images, pull-to-refresh, and logout
  - `_layout.tsx` - Tab layout with haptic feedback, blur effects, and user tab
- `app/+not-found.tsx` - 404 page

### Authentication Flow
- **Unauthenticated users** → Redirected to `login.tsx`
- **Authenticated users** → Access to `(tabs)` navigation
- **Root layout** handles authentication state and routing logic

### Component Organization
- `components/` - Reusable React components
  - UI primitives: `ThemedText`, `ThemedView`, `Collapsible`
  - Platform-specific: `HapticTab`, `ParallaxScrollView`
  - `ui/` - Platform-specific UI components (IconSymbol, TabBarBackground)
- `contexts/` - React Context providers for global state
  - `AuthContext.tsx` - Authentication state management with login/logout/token handling
- `hooks/` - Custom React hooks for theme, authentication, and API data fetching
  - `useUsers.ts` - React Query hook for paginated user data from Bubble.io API
  - `useAuth.ts` - Authentication hook (exported from AuthContext)
  - `useThemeColor.ts` - Theme-aware color selection hook
- `services/` - API clients and business logic services
  - `auth.ts` - Authentication service with Bubble.io login/logout workflows
  - `bubbleAPI.ts` - Comprehensive API client with TypeScript types, pagination, and error handling
- `assets/images/` - Static image assets
  - `black-logo.png` - Custom logo for login screen branding
- `constants/Colors.ts` - Professional indigo/amber theme system for light/dark modes

### Platform Differences
- iOS: Uses SF Symbols via `IconSymbol.ios.tsx` and blur effects
- Other platforms: Fallback implementations in base component files
- Path alias `@/*` maps to project root for clean imports

### Key Technologies
- **Expo SDK 53** with new architecture enabled
- **React Native 0.79** with React 19
- **Expo Router 5** for file-based navigation with authentication-protected routes
- **TypeScript** with strict mode enabled and comprehensive API type definitions
- **TanStack Query (React Query)** for data fetching, caching, and synchronization
- **Axios** for HTTP client with automatic Bearer token injection
- **Bubble.io API** for complete authentication and user management backend
- **Expo SecureStore** for secure authentication token storage
- **React Context API** for global authentication state management
- **Reanimated & Gesture Handler** for animations and haptic feedback
- **ESLint** with Expo flat config

## Development Notes

### Authentication System
The app features a complete authentication system with Bubble.io backend integration:

#### Authentication Flow
- **Unauthenticated State**: Users are automatically redirected to the professional login screen
- **Login Process**: Credentials are validated against Bubble.io API with secure token storage
- **Protected Routes**: Tab navigation is only accessible to authenticated users
- **Logout Process**: Includes server-side logout call and local token cleanup
- **Token Management**: Uses Expo SecureStore for secure token persistence across app sessions

#### Environment Variables
Configure these variables in your `.env` file:
```
EXPO_PUBLIC_BUBBLE_BASE_URL=https://tiddlecampaigns.com/version-test/api/1.1/obj
EXPO_PUBLIC_BUBBLE_WF_BASE=https://tiddlecampaigns.com/version-test/api/1.1/wf
```

#### Authentication Context
- **Global State**: `AuthContext` provides authentication state throughout the app
- **Hook Usage**: Access via `useAuth()` hook for login/logout/token management
- **Automatic Token Injection**: API client automatically includes Bearer tokens in requests
- **Error Handling**: Graceful handling of expired tokens and authentication failures

### Theme System
The app uses a professional indigo/amber color scheme with automatic theme detection:
- **Dynamic Colors**: `useColorScheme` hook with React Navigation's theme provider
- **Custom Palette**: Professional indigo (#6366f1) and amber (#f59e0b) brand colors
- **Dark Mode**: Optimized color variants for excellent dark mode experience
- **Theme Hook**: `useThemeColor` for component-level theme-aware styling

### API Integration with Bubble.io
Complete backend integration with comprehensive error handling:
- **API Client**: Located in `services/bubbleAPI.ts` with full TypeScript support
- **Authentication Service**: `services/auth.ts` handles login/logout workflows
- **Data Fetching**: Uses React Query via `useUsers` hook for caching and synchronization
- **Auto-retry Logic**: Built-in retry logic for failed requests with exponential backoff
- **Type Safety**: Complete TypeScript types for API responses and data models
- **Error Normalization**: Consistent error handling across all API endpoints

### Data Fetching Patterns
- **React Query Integration**: All API calls use TanStack Query for intelligent caching
- **Custom Hooks**: Domain-specific hooks like `useUsers` encapsulate query logic
- **Stale Time**: 30-second stale time configured for optimal user experience
- **Background Updates**: Automatic refetching when app comes into focus
- **Pull-to-Refresh**: Native refresh controls with branded styling

### TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive type checking
- **Base Config**: Uses Expo's optimized TypeScript configuration
- **Path Alias**: `@/*` mapping for clean root imports throughout the app
- **Typed Routes**: Enabled via experiments flag for type-safe navigation
- **API Types**: Complete type definitions for Bubble.io API responses in `services/bubbleAPI.ts`
- **Component Types**: Strongly typed props and state throughout all React components

### User Interface Components
- **UserAvatar**: Intelligent avatar component with image loading and fallback to initials
- **Professional Login**: Branded login screen with custom logo and theme integration
- **Pull-to-Refresh**: Native refresh controls with loading states and error handling
- **Theme-Aware**: All components automatically adapt to light/dark mode preferences
- **Haptic Feedback**: iOS haptic feedback integration for enhanced user experience