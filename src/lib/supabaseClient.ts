import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://txanefidfaqdjismzmvv.supabase.co';
const supabaseAnonKey = 'sb_publishable_cmBVoJmMl74szIUsWFSrhQ_NBpDZcRU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage, // 👈 THE MAGIC LINE
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})


