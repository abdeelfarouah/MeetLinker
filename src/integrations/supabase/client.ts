import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtflzvuhfvkvftjhyqay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Zmx6dnVoZnZrdmZ0amh5cWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NTg1MDYsImV4cCI6MjA1NDMzNDUwNn0.b06q8JGR5Ntw0yKP9SMI5zPgLPT0x6lfUuqAL42BZeg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export a single instance to be used throughout the app
export default supabase;