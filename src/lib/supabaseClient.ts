import { createClient } from '@supabase/supabase-js';

// Replace these with your actual keys from Supabase Dashboard -> Settings -> API
const supabaseUrl = 'https://txanefidfaqdjismzmvv.supabase.co';
const supabaseKey = 'sb_publishable_cmBVoJmMl74szIUsWFSrhQ_NBpDZcRU';

export const supabase = createClient(supabaseUrl, supabaseKey);