// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkfcgrohoryaokwuxnox.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZmNncm9ob3J5YW9rd3V4bm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjU1ODQsImV4cCI6MjA2Njg0MTU4NH0.jyvBrgFl8KP08DOCi3mgAqvqkIiqvt2M2MCLq2kWhRw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});