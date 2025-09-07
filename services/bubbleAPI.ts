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
