// services/auth.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const WF_BASE =
  process.env.EXPO_PUBLIC_BUBBLE_WF_BASE ??
  "https://tiddlecampaigns.com/version-test/api/1.1/wf";

type LoginPayload = { email: string; password: string };

type LoginResponse = {
  status?: "success" | "error";
  response?: {
    user_id: string;
    token: string;
    expires_in?: number; // seconds
    // include any extra fields you return from Bubble, e.g. role
    role?: string;
  };
  message?: string; // Bubble may include this on errors
};

export async function signInWithBubble(email: string, password: string) {
  const url = `${WF_BASE}/login`;
  
  try {
    const res = await axios.post<LoginResponse>(url, { email, password } satisfies LoginPayload);

    if (res.data?.status !== "success" || !res.data?.response?.token) {
      throw new Error(res.data?.message ?? "Login failed");
    }

    const { token, user_id, expires_in } = res.data.response;

    // Persist for later API calls:
    await SecureStore.setItemAsync("bubble_token", token);
    await SecureStore.setItemAsync("bubble_user_id", user_id);
    if (expires_in) await SecureStore.setItemAsync("bubble_token_exp_s", String(expires_in));

    return { token, userId: user_id };
  } catch (error: any) {
    // Handle HTTP errors from axios
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Handle authentication failures (400/401) with user-friendly messages
      if (status === 400 || status === 401) {
        // Check if the error message indicates invalid credentials
        const message = data?.message?.toLowerCase() || '';
        if (message.includes('password') || message.includes('credential') || message.includes('invalid') || message.includes('authentication')) {
          throw new Error("Email or password is incorrect");
        }
        // For other 400/401 errors, still use the email/password incorrect message as it's most common
        throw new Error("Email or password is incorrect");
      }
      
      // Handle other HTTP errors
      if (status >= 500) {
        throw new Error("Server temporarily unavailable. Please try again.");
      }
      
      // Use Bubble.io's error message if available, otherwise generic message
      throw new Error(data?.message || `Request failed (${status})`);
    }
    
    // Handle network errors
    if (error.request) {
      throw new Error("Network connection failed. Please check your internet connection.");
    }
    
    // Handle other errors (parsing, etc.)
    throw new Error(error.message || "Login failed");
  }
}

export async function logoutFromBubble(userId: string) {
  const url = `${WF_BASE}/logout`;
  
  try {
    // Check if we have a valid token first
    const token = await getAuthToken();
    if (!token) {
      console.log('No auth token found, skipping server logout (user likely already logged out)');
      return null;
    }

    const res = await axios.post(url, { user_id: userId });
    console.log('Server logout successful:', res.data);
    return res.data;
  } catch (error: any) {
    // Handle 401 specifically - this means we're already logged out on the server
    if (error?.response?.status === 401) {
      console.log('Server logout: Already logged out (401) - this is normal');
      return null;
    }
    
    // Log other errors as actual problems
    console.error('Server logout failed with unexpected error:', error);
    // Don't throw - we still want to clear local tokens even if server logout fails
    return null;
  }
}

export async function signOut() {
  console.log('Starting logout process...');
  
  try {
    // Get user ID before clearing it
    const userId = await getUserId();
    console.log('Retrieved user ID for logout:', userId);
    
    // Call server logout first if we have a user ID
    if (userId) {
      console.log('Calling server logout...');
      await logoutFromBubble(userId);
    } else {
      console.log('No user ID found, skipping server logout');
    }
  } catch (error) {
    console.error('Error during server logout:', error);
    // Continue with local cleanup even if server logout fails
  }

  // Clear local tokens regardless of server logout result
  console.log('Clearing local tokens...');
  try {
    await SecureStore.deleteItemAsync("bubble_token");
    await SecureStore.deleteItemAsync("bubble_user_id");
    await SecureStore.deleteItemAsync("bubble_token_exp_s");
    console.log('Local tokens cleared successfully');
  } catch (error) {
    console.error('Error clearing local tokens:', error);
    throw error; // This is critical, so throw if it fails
  }
}

export async function getAuthToken() {
  return SecureStore.getItemAsync("bubble_token");
}
export async function getUserId() {
  return SecureStore.getItemAsync("bubble_user_id");
}
