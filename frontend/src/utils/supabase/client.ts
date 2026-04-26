import { createBrowserClient } from "@supabase/ssr";

// Vite requires VITE_ prefix, but we'll check for NEXT_PUBLIC_ as a fallback 
// to help with different deployment environment defaults.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "MISSING SUPABASE CREDENTIALS: Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "are set in your deployment environment variables."
    );
  }

  return createBrowserClient(
    supabaseUrl || "",
    supabaseKey || "",
  );
};
