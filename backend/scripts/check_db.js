import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  console.log('--- PROFILES ---');
  const { data: profiles } = await supabase.from('profiles').select('user_id, full_name').order('created_at', { ascending: false }).limit(5);
  console.log(profiles);

  console.log('--- INTEREST REQUESTS ---');
  const { data: reqs } = await supabase.from('interest_requests').select('id, sender_id, receiver_id, guardian_id, status').order('created_at', { ascending: false }).limit(5);
  console.log(reqs);

  console.log('--- CONNECTIONS ---');
  const { data: conns } = await supabase.from('connections').select('*').order('created_at', { ascending: false }).limit(5);
  console.log(conns);
}
checkDb();
