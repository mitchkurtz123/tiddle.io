# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Tiddle.io**, a professional Expo React Native application with complete authentication and API integration. Built with file-based routing using Expo Router, the app features:

- **Complete Authentication System** - Secure login/logout with Bubble.io backend integration
- **Protected Routes** - Authentication-gated navigation with automatic redirects
- **Professional UI/UX** - Custom branded login screen with modern design system
- **User Management** - Full user listing with profile images and pull-to-refresh
- **Brand Deal Management** - Complete campaign workflow with instance tracking and creator management
- **Real-time Data Sync** - React Query mutations with automatic cache invalidation
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
  - `index.tsx` - Home tab with brand deal list and campaign management
  - `explore.tsx` - Explore tab
  - `users.tsx` - Users management with profile images, pull-to-refresh, and logout
  - `_layout.tsx` - Tab layout with haptic feedback, blur effects, and user tab
- `app/brand-deal/[id].tsx` - Dynamic brand deal detail screen with instance management
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
  - `campaign/` - Campaign and brand deal components
    - `CampaignCard.tsx` - Brand deal list item with navigation
    - `CampaignHeader.tsx` - Campaign list header with filtering
  - `brand-deal/` - Brand deal detail screen components
    - `BrandDealHeader.tsx` - Campaign header with image, title, status, and navigation
    - `InstanceCard.tsx` - Individual instance display with user data, pricing, and platform
    - `InstanceList.tsx` - List component for displaying video instances
    - `AddCreatorSheet.tsx` - Bottom sheet modal for adding creators with currency inputs
  - `common/` - Common utility components
    - `SearchBar.tsx` - Search input with clear functionality
    - `EmptyState.tsx` - Empty state display component
- `contexts/` - React Context providers for global state
  - `AuthContext.tsx` - Authentication state management with login/logout/token handling
- `hooks/` - Custom React hooks for theme, authentication, and API data fetching
  - `useUsers.ts` - React Query hook for paginated user data from Bubble.io API
  - `useBranddeals.ts` - React Query hook for brand deals list with filtering
  - `useBranddeal.ts` - Single brand deal fetching with caching
  - `useInstances.ts` - Instance data management for brand deal details
  - `useUser.ts` - Individual user data fetching with profile information
  - `useCreateInstance.ts` - Mutation hook for creating instances with cache invalidation
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
- **React Native SVG** for scalable platform icons and vector graphics
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
- **Data Fetching**: Uses React Query for caching and synchronization across multiple data types
- **Auto-retry Logic**: Built-in retry logic for failed requests with exponential backoff
- **Type Safety**: Complete TypeScript types for API responses and data models
- **Error Normalization**: Consistent error handling across all API endpoints

#### Data Types and Endpoints
- **User Management**: `AppUser` type with profile images and authentication data
- **Brand Deals**: `BrandDeal` type with status, images, and user associations
- **Instances**: `Instance0963` type for video instances with creator details and pricing
- **Object Endpoints**: `/user`, `/branddeal`, `/instance0963` for data retrieval
- **Workflow Endpoints**: `/create-instance` for creating new video instances

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

### Brand Deal Management System
The app features a complete brand deal and campaign management workflow:

#### Brand Deal List (Home Tab)
- **Campaign Overview**: List of all brand deals with filtering by status (roster, waiting, in-progress, invoiced, complete, canceled)
- **Search Functionality**: Real-time search across campaign titles and brand names
- **Status-based Filtering**: Professional filter dropdown with color-coded status badges
- **Pull-to-Refresh**: Native refresh controls with branded styling
- **Navigation**: Tap any campaign to view detailed information

#### Brand Deal Detail Screen (`/brand-deal/[id]`)
- **Dynamic Routing**: File-based routing with brand deal ID parameter
- **Campaign Header**: Large campaign image, title, brand name, status badge, and creator count
- **Back Navigation**: Proper navigation with fallback to home screen
- **Instance Management**: Complete list of video instances (creator submissions) with advanced filtering
- **Search & Filter System**: Real-time search by username/platform with comprehensive status filtering
- **Mobile-Optimized Search**: Auto-scroll search bar to top when keyboard appears for better mobile UX
- **Dynamic Instance Counts**: Shows filtered vs total counts (e.g., "3 of 8 instances")
- **Real-time Updates**: Automatic refresh after creating or updating instances

#### Instance Management
- **Instance Cards**: Display creator username, platform, pricing (rate vs price), and status with click-to-edit functionality
- **User Data Integration**: Automatic fetching of creator profiles with avatars and username resolution
- **Platform Icons**: Visual indicators for TikTok, Instagram, YouTube
- **Status Tracking**: Color-coded status badges for complete instance workflow (None, Waiting for Product, No Submission, Brand Review, Revising, Ready to Post, Posted, Invoice Pending, Paid)
- **Advanced Filtering**: Filter instances by status with 10 workflow stages
- **Real-time Search**: Search instances by creator username and platform with instant results
- **Smart Empty States**: Context-aware empty states for different search/filter scenarios

#### Creator Addition & Editing Workflow
- **Professional Form**: iOS-style bottom sheet modal with 28px rounded corners and shadow effects
- **Dual Mode Support**: Create new instances or edit existing ones with pre-populated data
- **User Input**: Text field with automatic username resolution from instance data
- **Platform Selection**: Toggle buttons for TikTok, Instagram, YouTube
- **Status Selection**: Multi-row status selector with dynamic color coding matching instance badges
- **Currency Inputs**: Formatted rate and price fields with dollar signs and decimal validation
- **Dynamic Color System**: Status selector buttons use the same colors as instance status badges
- **Real-time Feedback**: Loading states, error handling, and immediate list updates
- **Smart Validation**: Different validation rules for create vs edit modes

#### Data Synchronization
- **React Query Mutations**: Proper cache invalidation across all related queries (create and update operations)
- **Optimistic Updates**: Immediate UI feedback while API calls process
- **Multi-layer Caching**: Invalidates instances, brand deals, and user queries after mutations
- **Error Recovery**: Graceful error handling with retry capabilities
- **Dual API Integration**: Uses both object endpoints (`/instance0963`) and workflow endpoints (`/create-instance`, `/update-instance`)
- **Status Management**: Complete instance status workflow with proper API field mapping

### Advanced Instance Management Features
The brand deal detail screen includes sophisticated instance management capabilities:

#### Search & Filter System
- **Multi-field Search**: Search instances by creator username and platform with real-time filtering
- **Comprehensive Status Filtering**: 10-stage instance workflow filter (None, Waiting for Product, No Submission, Brand Review, Revising, Ready to Post, Posted, Invoice Pending, Paid)
- **Dynamic Count Display**: Shows filtered vs total counts with context-aware messaging
- **Professional Filter UI**: Anchored dropdown modal with status-specific color coding
- **Smart Empty States**: Different messages for no results, no status matches, or no instances

#### Mobile UX Optimizations  
- **Auto-scroll Search**: Search bar automatically scrolls to top when focused to prevent keyboard overlay
- **Full-width Layout**: Search bar spans full container width matching instance cards
- **Touch-friendly Filters**: Large touch targets for filter buttons with proper spacing
- **iOS-style Interactions**: Smooth animations and haptic feedback for better mobile experience

#### Edit Instance Functionality
- **Click-to-Edit**: Tap any instance card to edit its details
- **Pre-populated Forms**: Edit mode automatically fills form with current instance data  
- **Username Resolution**: Fetches and displays proper username from user data with fallback
- **Status Color Matching**: Form status selector uses same colors as instance status badges
- **Dual API Operations**: Seamless create/update operations with different endpoints

### User Interface Components
- **UserAvatar**: Intelligent avatar component with image loading and fallback to initials
- **CampaignCard**: Professional campaign list item with status badges and navigation
- **InstanceCard**: Creator instance display with user data, pricing, and platform info
- **AddCreatorSheet**: Bottom sheet modal with currency-formatted inputs and validation
- **StatusBadges**: Color-coded status indicators with professional styling
- **Professional Login**: Branded login screen with custom logo and theme integration
- **Pull-to-Refresh**: Native refresh controls with loading states and error handling
- **Theme-Aware**: All components automatically adapt to light/dark mode preferences
- **Haptic Feedback**: iOS haptic feedback integration for enhanced user experience