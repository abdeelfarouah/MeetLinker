import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://dtflzvuhfvkvftjhyqay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Zmx6dnVoZnZrdmZ0amh5cWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NTg1MDYsImV4cCI6MjA1NDMzNDUwNn0.b06q8JGR5Ntw0yKP9SMI5zPgLPT0x6lfUuqAL42BZeg';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
