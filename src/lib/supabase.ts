import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMDAwMCwiZXhwIjoxOTI2NjM0Njc0fQ.EjOpM_aCJECmStAX5GZGarYVWPkiF9T5QVX_p5RR7wk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
