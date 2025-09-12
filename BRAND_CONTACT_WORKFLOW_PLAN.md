# Brand and Brand Contact Workflow Extension Plan

## Overview
This document outlines the plan to extend Tiddle.io's existing instance creation/editing workflows to support brands and brand contacts, following the established architectural patterns.

## Entity Relationships
```
Brand Deal → Brand (attached brand)
Brand Deal → Brand Contact (attached brand contact)
Brand → Brand Contacts (one-to-many relationship)
```

## Current Architecture Analysis

### Established Patterns to Follow

#### 1. Data Layer (`services/bubbleAPI.ts`)
- TypeScript interfaces with proper field mapping
- Axios client with automatic Bearer token injection
- CRUD functions with error normalization
- Bubble.io API integration for both object and workflow endpoints

**Current Example:**
```typescript
export type BrandDeal = {
  title?: string;
  image?: string;
  "kaban-status"?: string;
  "created by"?: string;
  brandname?: string;
  "user-list"?: string[];
};
```

#### 2. Business Logic (`hooks/`)
- Query hooks for data fetching (`useInstances`, `useBranddeal`, `useUsers`)
- Mutation hooks (`useCreateInstance`, `useUpdateInstance`)
- React Query integration with intelligent cache invalidation
- Loading states and error handling

**Current Example:**
```typescript
export function useCreateInstance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstance,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      queryClient.invalidateQueries({ queryKey: ['branddeal', variables.branddeal] });
    }
  });
}
```

#### 3. UI Components (`components/`)
- Card-based display components
- Modal forms for creation/editing
- List components with filtering and search
- Status-based color coding
- Mobile-optimized UX

#### 4. Screen Architecture (`app/`)
- Detail screens with dynamic routing
- Tab-based navigation
- Search and filter functionality
- Pull-to-refresh and loading states

## Proposed Brand and Brand Contact Extension

### 1. Data Layer Extensions

#### New TypeScript Interfaces
```typescript
// Add to services/bubbleAPI.ts

export type Brand = {
  name?: string;
  logo?: string; // URL to brand logo
  website?: string;
  industry?: string;
  status?: string; // Active, Inactive, etc.
  description?: string;
  "contact-list"?: string[]; // Array of brand contact IDs
  "created-by"?: string; // User ID reference
  // Additional fields as needed
};

export type BrandContact = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string; // Marketing Manager, Brand Manager, etc.
  brand?: string; // Brand ID reference
  "is-primary"?: boolean; // Primary contact for the brand
  avatar?: string; // URL to contact photo
  status?: string; // Active, Inactive, etc.
  notes?: string;
  // Additional fields as needed
};
```

#### Updated BrandDeal Interface
```typescript
export type BrandDeal = {
  title?: string;
  image?: string;
  "kaban-status"?: string;
  "created by"?: string;
  brandname?: string; // Keep for backward compatibility
  "user-list"?: string[];
  brand?: string; // Brand ID reference (new)
  "brand-contact"?: string; // Brand Contact ID reference (new)
  // Existing fields...
};
```

#### New API Functions
```typescript
// Brand CRUD operations
export async function listBrands(limit: number = 100, cursor: number = 0): Promise<{ results: (BubbleThing & Brand)[]; cursor: number; remaining: number; }>;
export async function getBrand(brandId: string): Promise<BubbleThing & Brand>;
export async function createBrand(brandData: Omit<Brand, keyof BubbleThing>): Promise<BubbleThing & Brand>;
export async function updateBrand(brandId: string, updates: Partial<Brand>): Promise<BubbleThing & Brand>;

// Brand Contact CRUD operations  
export async function listBrandContacts(limit: number = 100, cursor: number = 0, brandId?: string): Promise<{ results: (BubbleThing & BrandContact)[]; cursor: number; remaining: number; }>;
export async function getBrandContact(contactId: string): Promise<BubbleThing & BrandContact>;
export async function createBrandContact(contactData: Omit<BrandContact, keyof BubbleThing>): Promise<BubbleThing & BrandContact>;
export async function updateBrandContact(contactId: string, updates: Partial<BrandContact>): Promise<BubbleThing & BrandContact>;
```

### 2. Business Logic (Hooks)

#### Brand Hooks
```typescript
// hooks/useBrands.ts
export function useBrands(limit: number = 100);
export function useBrand(brandId: string);
export function useCreateBrand();
export function useUpdateBrand();

// hooks/useBrandContacts.ts  
export function useBrandContacts(limit: number = 100, brandId?: string);
export function useBrandContact(contactId: string);
export function useCreateBrandContact();
export function useUpdateBrandContact();
```

### 3. UI Components

#### Brand Components
```
components/brand/
├── BrandCard.tsx           # Brand list item (follows CampaignCard pattern)
├── BrandHeader.tsx         # Brand detail header (follows BrandDealHeader pattern)
├── BrandList.tsx           # Brand list with filtering
├── AddBrandSheet.tsx       # Brand creation/editing modal (follows AddCreatorSheet pattern)
└── BrandContactList.tsx    # Brand contacts within brand view
```

#### Brand Contact Components
```
components/brand-contact/
├── ContactCard.tsx         # Contact list item
├── ContactHeader.tsx       # Contact detail header
├── ContactList.tsx         # Contact list with filtering
└── AddContactSheet.tsx     # Contact creation/editing modal
```

### 4. Screen Architecture

#### Navigation Structure
```
app/(tabs)/
├── brands.tsx              # New brands tab (follows users.tsx pattern)
├── _layout.tsx             # Updated to include brands tab
├── index.tsx               # Updated brand deal cards to show brand info
└── users.tsx               # Existing users tab

app/brand/
└── [id].tsx                # Brand detail screen (follows brand-deal/[id].tsx pattern)

app/brand-contact/
└── [id].tsx                # Brand contact detail screen
```

#### Brands Tab (`app/(tabs)/brands.tsx`)
- List all brands with search and filtering
- Card-based layout showing brand logo, name, industry, contact count
- Pull-to-refresh functionality
- Navigation to brand detail screens

#### Brand Detail Screen (`app/brand/[id].tsx`)
- Brand header with logo, name, website, industry
- Brand contacts section (similar to instances in brand deal detail)
- Search and filter contacts
- Add/edit contact functionality
- Navigation to individual contact details

### 5. Integration Points

#### Updated Brand Deal Workflow
- Brand deal creation/editing should allow selecting existing brands
- Brand deal creation/editing should allow selecting brand contacts from the selected brand
- Brand deal cards should display brand logo and contact information
- Brand deal detail should show full brand and contact information

#### Enhanced Search and Filtering
- Global search across brands, contacts, and brand deals
- Filter brand deals by specific brands
- Filter contacts by brand, role, or status

### 6. Mobile UX Enhancements

#### Following Established Patterns
- Auto-scroll search functionality
- Haptic feedback for interactions
- Pull-to-refresh on all list screens
- Color-coded status indicators
- Professional card-based layouts
- iOS-style bottom sheet modals

### 7. Implementation Phases

#### Phase 1: Basic Brand Management
1. Add Brand TypeScript interfaces
2. Implement brand CRUD hooks
3. Create brand list screen and components
4. Add brand detail screen
5. Update navigation to include brands tab

#### Phase 2: Brand Contact Management
1. Add BrandContact TypeScript interfaces
2. Implement brand contact CRUD hooks
3. Create contact components and screens
4. Integrate contacts within brand detail screen
5. Add standalone contact detail screens

#### Phase 3: Brand Deal Integration
1. Update BrandDeal interface with brand/contact references
2. Modify brand deal creation to include brand/contact selection
3. Update brand deal displays to show brand information
4. Enhance filtering and search across entities

#### Phase 4: Advanced Features
1. Brand/contact relationship management
2. Advanced filtering and search
3. Bulk operations
4. Export/import functionality
5. Enhanced reporting and analytics

### 8. Cache Invalidation Strategy

Following the established pattern from instance management:
- Creating/updating brands invalidates brand lists and related brand deals
- Creating/updating contacts invalidates contact lists, brand details, and related brand deals
- Updating brand deals invalidates all related brand and contact caches

### 9. Status and Color Coding

#### Brand Statuses
- Active (green)
- Inactive (gray)
- Pending (yellow)
- Archived (red)

#### Contact Statuses  
- Active (green)
- Inactive (gray)
- Primary (blue)
- Secondary (gray)

### 10. Search and Filter Capabilities

#### Brand Filtering
- By status (Active, Inactive, etc.)
- By industry
- By contact count
- By creation date

#### Contact Filtering
- By brand
- By role
- By status
- By primary/secondary designation

#### Global Search
- Search across brand names, contact names, emails
- Search brand deals by associated brand or contact
- Unified search results with entity type indicators

## Technical Considerations

### Error Handling
- Follow existing error normalization patterns
- Graceful handling of missing brand/contact references
- Fallback displays for deleted or inaccessible entities

### Performance
- Implement proper pagination for large brand/contact lists
- Cache frequently accessed brand/contact data
- Optimize queries to avoid unnecessary API calls

### Data Integrity
- Handle orphaned brand deals when brands are deleted
- Manage contact reassignment when brands change
- Validate brand/contact relationships before operations

## Conclusion

This extension follows Tiddle.io's established architectural patterns and provides a comprehensive brand and brand contact management system that integrates seamlessly with the existing brand deal workflow. The phased implementation approach ensures minimal disruption to existing functionality while providing powerful new capabilities.