// services/bubbleAPI.ts
import axios, { AxiosError } from "axios";
import { getAuthToken } from "./auth";

/**
 * Base config
 * - Change to live base when ready.
 * - You can override via EXPO_PUBLIC_BUBBLE_BASE_URL.
 */
const BASE_URL =
  process.env.EXPO_PUBLIC_BUBBLE_BASE_URL ??
  "https://tiddlecampaigns.com/version-test/api/1.1/obj";

const WF_BASE =
  process.env.EXPO_PUBLIC_BUBBLE_WF_BASE ??
  "https://tiddlecampaigns.com/version-test/api/1.1/wf";

/** Core Bubble list/thing shapes */
export type BubbleThing = { _id: string; CreatedDate?: string; ModifiedDate?: string };

type BubbleListResponse<T> = {
  response?: {
    results?: (BubbleThing & T)[];
    cursor?: number;
    remaining?: number;
    count?: number;
  };
};

type BubbleGetResponse<T> = { response: BubbleThing & T };

/** Your current User shape (extend as you use more fields) */
export type AppUser = {
  username?: string;
  image?: string; // URL
  authentication?: {
    email?: {
      email?: string;
      email_confirmed?: boolean | null;
    };
  };
  // add fields as needed, e.g. role?: string; managerId?: string;
};

/** BrandDeal shape for displaying user's branddeals */
export type BrandDeal = {
  title?: string;
  image?: string; // URL to branddeal image
  "kaban-status"?: string; // Current status in kanban workflow (matches API response)
  "created by"?: string; // User ID reference (matches Bubble field name)
  brandname?: string; // Denormalized brand name for instant display
  "user-list"?: string[]; // Array of user IDs associated with this branddeal
  // add more fields as needed from your Bubble branddeal datatype
};

/** Instance0963 shape for individual video instances created by creators */
export type Instance0963 = {
  username?: string; // Creator's username
  price?: number; // Price for this instance
  rate?: number; // Rate/pricing rate
  platform?: string; // Platform where video will be posted (e.g., TikTok, Instagram)
  "instance-status"?: string; // Status of this specific instance
  user?: string; // User ID reference to get full user details
  notes?: string; // Notes for this instance
  // add more fields as needed from your Bubble instance0963 datatype
};

/** Brand shape for displaying user's brands */
export type Brand = {
  brandname?: string; // Brand name
  legalname?: string; // Legal entity name
  image?: string; // URL to brand logo
  niche?: string[]; // Brand industry/category (list of texts)
  classification?: 'direct' | 'agency' | 'music'; // Brand classification
  notes?: string; // Brand description
  "contact-count"?: number; // Denormalized contact count for quick display
  "created-by"?: string; // User ID reference (matches Bubble field name)
  
  // Agency relationship fields (Option A - using existing Bubble structure)
  "agency-brands"?: string[]; // For agencies: array of brand IDs they manage
  "parent-agency"?: string; // For brands: ID of parent agency (derived from agency-brands)
  "brandContacts"?: string[]; // Array of contact IDs associated with this brand
  
  // Basic contact information
  website?: string; // Agency/brand website
  phone?: string; // Primary phone number
  "founded-date"?: string; // When agency/brand was founded
  
  // Agency-specific business information
  "employee-count"?: number; // Number of employees
  "annual-revenue"?: number; // Annual revenue
  "commission-rate"?: number; // Agency commission percentage
  
  // Billing & Payment fields
  "stripe-customer-id"?: string; // Stripe customer ID
  "stripe-account-id"?: string; // Stripe connected account ID
  "payment-method"?: string; // Default payment method
  "billing-email"?: string; // Billing contact email
  "billing-address"?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }; // Billing address object
  "tax-id"?: string; // Tax identification number
  "invoice-prefix"?: string; // Custom invoice prefix
  "payment-terms"?: string; // NET-30, NET-60, etc.
  
  // Computed helper fields
  "brand-count"?: number; // For agencies: count of managed brands
  "is-agency"?: boolean; // Helper flag for quick agency identification
  // add more fields as needed from your Bubble brand datatype
};

/** Brand Contact shape for managing brand contacts */
export type BrandContact = {
  name?: string; // Contact full name
  email?: string; // Contact email address
  phone?: string; // Contact phone number
  role?: string; // Job role/title (Marketing Manager, etc.)
  title?: string; // Official job title
  
  // Relationship fields
  "brand-id"?: string; // Brand this contact belongs to
  "agency-id"?: string; // Agency this contact works for (if applicable)
  
  // Status and metadata
  status?: 'active' | 'inactive' | 'archived'; // Contact status
  "is-primary"?: boolean; // Primary contact flag
  avatar?: string; // URL to contact photo
  notes?: string; // Additional notes about contact
  "last-contacted"?: string; // Last contact date
  "created-by"?: string; // User ID reference
  // add more fields as needed from your Bubble brandcontact datatype
};

/** Axios client with dynamic Bearer token from SecureStore */
export const bubbleClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

bubbleClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Normalize Bubble/axios errors into a friendly Error */
function normalizeBubbleError(err: unknown): Error {
  const ax = err as AxiosError<any>;
  const msg =
    ax?.response?.data?.message ??
    ax?.response?.data?.status ??
    ax?.message ??
    "Unknown Bubble API error";
  return new Error(String(msg));
}

/** ===== USERS: minimal fetches you’ll use immediately ===== */

/**
 * List users with optional pagination.
 * Returns results plus cursor/remaining so you can build "Load more".
 */
export async function listUsers(
  limit: number = 100,
  cursor: number = 0
): Promise<{
  results: (BubbleThing & AppUser)[];
  cursor: number;
  remaining: number;
  count: number;
}> {
  try {
    const res = await bubbleClient.get<BubbleListResponse<AppUser>>("/user", {
      params: { limit, cursor },
    });
    const r = res.data?.response ?? {};
    return {
      results: r.results ?? [],
      cursor: r.cursor ?? 0,
      remaining: r.remaining ?? 0,
      count: r.count ?? (r.results?.length ?? 0),
    };
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** Convenience helper if you only care about the array (no pagination meta) */
export async function listUsersSimple(limit = 100, cursor = 0) {
  const { results } = await listUsers(limit, cursor);
  return results;
}

/** Get a single user by Bubble unique id */
export async function getUserById(id: string): Promise<BubbleThing & AppUser> {
  try {
    const res = await bubbleClient.get<BubbleGetResponse<AppUser>>(`/user/${id}`);
    return res.data.response;
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** Safely extract the primary email from your nested structure */
export function getUserEmail(u: AppUser | (BubbleThing & AppUser) | undefined) {
  return u?.authentication?.email?.email;
}

/** (Optional) Very basic "name contains" search using Bubble constraints (AND logic only).
 * For OR logic (e.g., name OR email), call twice and merge client-side.
 */
type Constraint = {
  key: string;
  constraint_type:
    | "equals"
    | "not equal"
    | "greater than"
    | "less than"
    | "text contains"
    | "text not contain"
    | "empty"
    | "not empty"
    | "in"
    | "not in";
  value?: any;
};

function encodeConstraints(constraints?: Constraint[]) {
  if (!constraints || constraints.length === 0) return undefined;
  return encodeURIComponent(JSON.stringify(constraints));
}

export async function searchUsersByName(term: string, limit = 50, cursor = 0) {
  try {
    const res = await bubbleClient.get<BubbleListResponse<AppUser>>("/user", {
      params: {
        limit,
        cursor,
        constraints: encodeConstraints([
          { key: "username", constraint_type: "text contains", value: term },
        ]),
      },
    });
    const r = res.data?.response ?? {};
    return {
      results: r.results ?? [],
      cursor: r.cursor ?? 0,
      remaining: r.remaining ?? 0,
      count: r.count ?? (r.results?.length ?? 0),
    };
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** ===== BRANDDEALS: fetch branddeals created by current user ===== */

/**
 * List branddeals created by a specific user.
 * Clean, simple version that matches Postman request.
 */
export async function listBranddeals(
  createdByUserId: string
): Promise<{
  results: (BubbleThing & BrandDeal)[];
  cursor: number;
  remaining: number;
  count: number;
}> {
  try {
    // Create simple axios instance (no headers, no auth - matches Postman)
    const simpleClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      // No headers at all - just like Postman
    });
    
    // Build constraints for filtering by "created by" field
    const constraints = encodeConstraints([
      { key: "created by", constraint_type: "equals", value: createdByUserId },
    ]);
    
    // Manually construct full URL - bypass axios params handling
    const fullURL = `/branddeal?constraints=${constraints}`;
    
    const res = await simpleClient.get<BubbleListResponse<BrandDeal>>(fullURL);
    
    const r = res.data?.response ?? {};
    return {
      results: r.results ?? [],
      cursor: r.cursor ?? 0,
      remaining: r.remaining ?? 0,
      count: r.count ?? (r.results?.length ?? 0),
    };
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** Convenience helper if you only care about the array (no pagination meta) */
export async function listBranddealsSimple(createdByUserId: string) {
  const { results } = await listBranddeals(createdByUserId);
  return results;
}

/** Get a single branddeal by Bubble unique id */
export async function getBranddealById(id: string): Promise<BubbleThing & BrandDeal> {
  try {
    const res = await bubbleClient.get<BubbleGetResponse<BrandDeal>>(`/branddeal/${id}`);
    return res.data.response;
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** ===== INSTANCES: fetch instance0963 objects for a brand deal ===== */

/**
 * List instances (instance0963 objects) by providing an array of instance IDs.
 * This fetches the instances from a brand deal's user-list field directly by ID.
 */
export async function listInstances(
  instanceIds: string[]
): Promise<{
  results: (BubbleThing & Instance0963)[];
  cursor: number;
  remaining: number;
  count: number;
}> {
  try {
    console.log('listInstances called with instanceIds:', instanceIds);
    
    // If no instance IDs provided, return empty results
    if (!instanceIds || instanceIds.length === 0) {
      console.log('No instance IDs provided, returning empty results');
      return {
        results: [],
        cursor: 0,
        remaining: 0,
        count: 0,
      };
    }

    // Create simple axios instance (no headers, no auth - matches Postman)
    const simpleClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      // No headers at all - just like Postman
    });
    
    // Fetch each instance by ID directly
    console.log('Fetching instances by IDs...');
    const instancePromises = instanceIds.map(id => 
      simpleClient.get<BubbleGetResponse<Instance0963>>(`/instance0963/${id}`)
        .then(res => res.data.response)
        .catch(err => {
          console.error(`Failed to fetch instance ${id}:`, err);
          return null; // Return null for failed fetches
        })
    );
    
    const instances = await Promise.all(instancePromises);
    
    // Filter out null results (failed fetches)
    const validInstances = instances.filter((instance): instance is BubbleThing & Instance0963 => 
      instance !== null
    );
    
    console.log('Successfully fetched instances:', validInstances);
    
    return {
      results: validInstances,
      cursor: 0,
      remaining: 0,
      count: validInstances.length,
    };
  } catch (e) {
    console.error('Error in listInstances:', e);
    throw normalizeBubbleError(e);
  }
}

/** Convenience helper if you only care about the array (no pagination meta) */
export async function listInstancesSimple(userIds: string[]) {
  const { results } = await listInstances(userIds);
  return results;
}

/** Get a single instance by Bubble unique id */
export async function getInstanceById(id: string): Promise<BubbleThing & Instance0963> {
  try {
    const res = await bubbleClient.get<BubbleGetResponse<Instance0963>>(`/instance0963/${id}`);
    return res.data.response;
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** ===== CREATE INSTANCE: workflow endpoint for creating new instances ===== */

/**
 * Create a new instance using the workflow endpoint
 */
export async function createInstance({
  username,
  rate,
  price,
  platform,
  branddeal,
  notes,
}: {
  username: string;
  rate: number;
  price: number;
  platform: string;
  branddeal: string;
  notes?: string;
}): Promise<any> {
  try {
    console.log('Creating instance with data:', {
      username,
      rate,
      price,
      platform,
      branddeal,
      notes,
    });

    // Create simple axios instance (no headers, no auth)
    const simpleClient = axios.create({
      baseURL: WF_BASE,
      timeout: 15000,
    });

    const res = await simpleClient.post('/create-instance', {
      username,
      rate,
      price,
      platform,
      branddeal,
      notes,
    });

    console.log('Instance created successfully:', res.data);
    return res.data;
  } catch (e) {
    console.error('Error creating instance:', e);
    throw normalizeBubbleError(e);
  }
}

/** ===== UPDATE INSTANCE: workflow endpoint for updating existing instances ===== */

/**
 * Update an existing instance using the workflow endpoint
 */
export async function updateInstance({
  instance,
  rate,
  price,
  instanceStatus,
  platform,
  notes,
}: {
  instance: string;
  rate: number;
  price: number;
  instanceStatus: string;
  platform: string;
  notes?: string;
}): Promise<any> {
  try {
    console.log('Updating instance with data:', {
      instance,
      rate,
      price,
      instanceStatus,
      platform,
      notes,
    });

    // Create simple axios instance (no headers, no auth)
    const simpleClient = axios.create({
      baseURL: WF_BASE,
      timeout: 15000,
    });

    const res = await simpleClient.post('/update-instance', {
      instance,
      rate,
      price,
      "instance-status": instanceStatus,
      platform,
      notes,
    });

    console.log('Instance updated successfully:', res.data);
    return res.data;
  } catch (e) {
    console.error('Error updating instance:', e);
    throw normalizeBubbleError(e);
  }
}

/** ===== BRANDS: fetch brands created by current user ===== */

/**
 * List all brands without user filtering.
 * Clean, simple version that loads all available brands.
 */
export async function listBrands(
  limit: number = 100,
  cursor: number = 0
): Promise<{
  results: (BubbleThing & Brand)[];
  cursor: number;
  remaining: number;
  count: number;
}> {
  try {
    // Create simple axios instance (no headers, no auth - matches Postman)
    const simpleClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      // No headers at all - just like Postman
    });
    
    // Simple GET request to /brand endpoint without constraints
    const res = await simpleClient.get<BubbleListResponse<Brand>>("/brand", {
      params: { limit, cursor },
    });
    
    const r = res.data?.response ?? {};
    return {
      results: r.results ?? [],
      cursor: r.cursor ?? 0,
      remaining: r.remaining ?? 0,
      count: r.count ?? (r.results?.length ?? 0),
    };
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** Convenience helper if you only care about the array (no pagination meta) */
export async function listBrandsSimple(limit = 100, cursor = 0) {
  const { results } = await listBrands(limit, cursor);
  return enhanceBrandsWithAgencyData(results);
}

/** Get a single brand by Bubble unique id */
export async function getBrandById(id: string): Promise<BubbleThing & Brand> {
  try {
    const res = await bubbleClient.get<BubbleGetResponse<Brand>>(`/brand/${id}`);
    return res.data.response;
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** ===== BRAND CONTACTS: fetch and manage brand contacts ===== */

/**
 * List brand contacts with optional filtering by brand
 */
export async function listBrandContacts(
  limit: number = 100,
  cursor: number = 0,
  brandId?: string
): Promise<{
  results: (BubbleThing & BrandContact)[];
  cursor: number;
  remaining: number;
  count: number;
}> {
  try {
    const simpleClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
    });
    
    let constraints;
    if (brandId) {
      constraints = encodeConstraints([
        { key: "brand-id", constraint_type: "equals", value: brandId },
      ]);
    }
    
    const url = constraints ? `/brandcontact?constraints=${constraints}&limit=${limit}&cursor=${cursor}` : `/brandcontact?limit=${limit}&cursor=${cursor}`;
    const res = await simpleClient.get<BubbleListResponse<BrandContact>>(url);
    
    const r = res.data?.response ?? {};
    return {
      results: r.results ?? [],
      cursor: r.cursor ?? 0,
      remaining: r.remaining ?? 0,
      count: r.count ?? (r.results?.length ?? 0),
    };
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** Convenience helper if you only care about the array (no pagination meta) */
export async function listBrandContactsSimple(limit = 100, cursor = 0, brandId?: string) {
  const { results } = await listBrandContacts(limit, cursor, brandId);
  return results;
}

/** Get a single brand contact by Bubble unique id */
export async function getBrandContactById(id: string): Promise<BubbleThing & BrandContact> {
  try {
    const res = await bubbleClient.get<BubbleGetResponse<BrandContact>>(`/brandcontact/${id}`);
    return res.data.response;
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/** ===== AGENCY UTILITIES: helper functions for agency relationships ===== */

/**
 * Check if a brand is an agency based on classification and agency-brands field
 */
export function isAgency(brand: BubbleThing & Brand): boolean {
  // Check classification with case-insensitive comparison
  const isClassificationAgency = brand.classification?.toLowerCase() === 'agency';
  
  // Check if it has managed brands
  const hasManagedBrands = (brand["agency-brands"]?.length ?? 0) > 0;
  
  // Debug logging to understand what data we're getting
  if (brand.classification?.toLowerCase() === 'agency') {
    console.log('Found agency by classification:', brand.brandname, {
      classification: brand.classification,
      agencyBrands: brand["agency-brands"],
      isAgency: isClassificationAgency || hasManagedBrands
    });
  }
  
  return isClassificationAgency || hasManagedBrands;
}

/**
 * Get all brands managed by an agency
 */
export async function getAgencyBrands(agencyId: string): Promise<(BubbleThing & Brand)[]> {
  try {
    // First get the agency to get its managed brand IDs
    const agency = await getBrandById(agencyId);
    const brandIds = agency["agency-brands"] || [];
    
    if (brandIds.length === 0) {
      return [];
    }
    
    // Fetch each brand individually (similar to listInstances pattern)
    const simpleClient = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
    });
    
    const brandPromises = brandIds.map(id => 
      simpleClient.get<BubbleGetResponse<Brand>>(`/brand/${id}`)
        .then(res => res.data.response)
        .catch(err => {
          console.error(`Failed to fetch brand ${id}:`, err);
          return null;
        })
    );
    
    const brands = await Promise.all(brandPromises);
    
    // Filter out null results and add parent agency reference
    return brands
      .filter((brand): brand is BubbleThing & Brand => brand !== null)
      .map(brand => ({ ...brand, "parent-agency": agencyId }));
  } catch (e) {
    throw normalizeBubbleError(e);
  }
}

/**
 * Enhance brands list with agency relationship data
 */
export function enhanceBrandsWithAgencyData(brands: (BubbleThing & Brand)[]): (BubbleThing & Brand)[] {
  // Debug: Log first few items to understand data structure
  if (brands.length > 0) {
    console.log('Enhancing brands data - sample items:', {
      totalBrands: brands.length,
      sampleBrands: brands.slice(0, 3).map(brand => ({
        name: brand.brandname,
        classification: brand.classification,
        agencyBrands: brand["agency-brands"],
        isAgency: isAgency(brand)
      }))
    });
  }
  
  return brands.map(brand => {
    // Add helper flags
    const enhanced = {
      ...brand,
      "is-agency": isAgency(brand),
      "brand-count": brand["agency-brands"]?.length ?? 0,
    };
    
    return enhanced;
  });
}

