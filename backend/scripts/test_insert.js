import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing insert with key prefix:', supabaseServiceKey.substring(0, 10));
  
  const { data: conns } = await supabase.from('connections').select('*').limit(1);
  if (!conns || conns.length === 0) {
    console.log('No connections found');
    return;
  }
  
  const conn = conns[0];
  const connectionId = conn.id;
  const senderId = conn.user_a_id;
  
  console.log(`Using real connection ${connectionId} and sender ${senderId}`);
  
  const { data, error } = await supabase
    .from('messages')
    .insert([{
       connection_id: connectionId,
       sender_id: senderId,
       text: 'Test message with real IDs'
    }]);
    
  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success:', data);
  }
}

testInsert();
