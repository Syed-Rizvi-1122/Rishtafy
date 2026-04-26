import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client with Service Role Key (Admin Access)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Security Handshake
console.log(`[Security] Backend initialized. Key prefix: ${supabaseServiceKey.substring(0, 10)}...`);
if (supabaseServiceKey.startsWith('sb_secret') || supabaseServiceKey.length > 50) {
  console.log('[Security] Verified: Using High-Privilege Secret Key.');
} else {
  console.log('[Security] WARNING: Backend appears to be using a Low-Privilege Anon Key!');
}

// Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role, candidateEmail } = req.body;

  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`[Backend] Registering user: ${email} with role: ${role}`);
    
    // Use auth.admin to create user without modifying the global client session
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role,
      },
    });

    let user = authData?.user;

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('[Backend] User exists in Auth, attempting to sync to DB...');
        // Find existing user via admin API
        const { data: usersData, error: searchError } = await supabase.auth.admin.listUsers();
        if (searchError) throw searchError;
        user = usersData.users.find(u => u.email === email);
      } else {
        console.error('[Backend] Supabase Auth Error:', authError.message);
        throw authError;
      }
    }

    if (!user) throw new Error('User creation/retrieval failed');

    // 2. Upsert into our public.users table (Self-Healing Sync)
    const { error: dbError } = await supabase
      .from('users')
      .upsert([
        {
          id: user.id,
          email: user.email,
          role: role.toLowerCase(),
        },
      ], { onConflict: 'id' });

    if (dbError) throw dbError;

    // 3. Upsert initial profile if role is candidate
    if (role.toLowerCase() === 'candidate') {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            user_id: user.id,
            full_name,
          },
        ], { onConflict: 'user_id' });
      if (profileError) console.error('Error syncing profile:', profileError);
    }

    // 4. Handle Guardian-Candidate link if provided
    if (role.toLowerCase() === 'guardian' && candidateEmail) {
      const { data: candidateData, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', candidateEmail)
        .eq('role', 'candidate')
        .single();

      if (candidateData) {
        const { error: linkError } = await supabase
          .from('guardian_links')
          .insert([
            {
              guardian_user_id: user.id,
              candidate_user_id: candidateData.id,
              status: 'pending',
            },
          ]);
        if (linkError) console.error('Error creating guardian link:', linkError);
      }
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: full_name,
        role: role,
      },
    });
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    // Create a temporary client just for verifying the password so we don't pollute the global service_role client
    const tempClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    
    const { data: authData, error: authError } = await tempClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error('Login failed');

    // Fetch user role using the global admin client
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('role, is_verified, is_active')
      .eq('id', user.id)
      .single();

    if (dbError) throw dbError;

    if (!userData.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Contact support.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name,
        role: userData.role,
        isVerified: userData.is_verified,
        isActive: userData.is_active,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Profile Update Route
app.put('/api/profiles/:userId', async (req, res) => {
  const { userId } = req.params;
  const profileData = req.body;

  try {
    const updatePayload = {
      user_id: userId,
      full_name: profileData.name,
      age: isNaN(parseInt(profileData.age)) ? null : parseInt(profileData.age),
      city: profileData.city || null,
      education: profileData.education || null,
      profession: profileData.profession || null,
      religious_values: profileData.religiousValues || null,
      bio: profileData.aboutMe || null,
      partner_pref_age_min: isNaN(parseInt(profileData.partnerAgeMin)) ? 18 : parseInt(profileData.partnerAgeMin),
      partner_pref_age_max: isNaN(parseInt(profileData.partnerAgeMax)) ? 70 : parseInt(profileData.partnerAgeMax),
      partner_pref_city: profileData.partnerCity || 'Any',
      partner_pref_education: profileData.partnerEducation || 'Any',
      updated_at: new Date().toISOString()
    };

    console.log('[Backend] Upserting profile for user:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .upsert(updatePayload, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('[Backend] DB Upsert Error:', error.message);
      throw error;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: data ? data[0] : null
    });
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search Profiles Route
app.get('/api/profiles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Send Interest Request
app.post('/api/interests', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'senderId and receiverId are required' });
  }

  try {
    // Check if receiver has a guardian
    let actualGuardianId = null;
    let initialStatus = 'pending_candidate';

    const { data: linkData, error: linkError } = await supabase
      .from('guardian_links')
      .select('guardian_user_id')
      .eq('candidate_user_id', receiverId)
      .eq('status', 'pending') // or accepted, assuming pending for simplicity in test
      .limit(1)
      .single();

    if (linkData) {
      actualGuardianId = linkData.guardian_user_id;
      initialStatus = 'pending_guardian';
    }

    const { error } = await supabase
      .from('interest_requests')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        guardian_id: actualGuardianId,
        status: initialStatus
      }]);

    if (error) {
      console.error('[Backend] Error creating interest:', error);
      throw error;
    }
    
    res.status(201).json({ message: 'Interest request sent' });
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get User Requests
app.get('/api/interests/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: requests, error } = await supabase
      .from('interest_requests')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId},guardian_id.eq.${userId}`);

    if (error) throw error;

    // Fetch all profiles involved
    const profileIds = new Set();
    requests.forEach(r => {
      if (r.sender_id) profileIds.add(r.sender_id);
      if (r.receiver_id) profileIds.add(r.receiver_id);
    });

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', Array.from(profileIds));

    if (profileError) throw profileError;

    const profilesMap = {};
    if (profiles) {
      profiles.forEach(p => profilesMap[p.user_id] = p);
    }

    const enrichedRequests = requests.map(r => ({
      ...r,
      sender: profilesMap[r.sender_id] || null,
      receiver: profilesMap[r.receiver_id] || null
    }));

    console.log(`[Backend] Found ${enrichedRequests.length} requests for user ${userId}`);
    res.status(200).json(enrichedRequests);
  } catch (error) {
    console.error('Fetch interests error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update Interest Request (Approve, Decline, Accept)
app.put('/api/interests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    console.log(`[Backend] Updating interest request ${id} to status: ${status}`);
    const { data: request, error: fetchError } = await supabase
      .from('interest_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[Backend] Fetch Error on interest request:', fetchError);
      throw fetchError;
    }

    const { error } = await supabase
      .from('interest_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[Backend] Update Error on interest request:', error);
      throw error;
    }

    // If accepted, create a connection
    if (status === 'accepted') {
      console.log(`[Backend] Match accepted! Creating connection for users: ${request.sender_id} & ${request.receiver_id}`);
      const { error: connError } = await supabase
        .from('connections')
        .upsert([{
          user_a_id: request.sender_id,
          user_b_id: request.receiver_id
        }], { onConflict: 'user_a_id,user_b_id' }); // Use upsert to prevent unique constraint crashes
      if (connError) {
        console.error('[Backend] Error creating connection in DB:', connError);
      }
    }

    res.status(200).json({ success: true, status });
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Get Active Connections
app.get('/api/connections/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: conns, error } = await supabase
      .from('connections')
      .select('*')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

    if (error) throw error;

    if (conns.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch partner profiles
    const partnerIds = conns.map(c => c.user_a_id === userId ? c.user_b_id : c.user_a_id);
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', partnerIds);

    if (profileError) throw profileError;

    const profileMap = {};
    profiles.forEach(p => profileMap[p.user_id] = p);

    const enriched = conns.map(c => ({
      ...c,
      partner: profileMap[c.user_a_id === userId ? c.user_b_id : c.user_a_id] || null
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Messages for a Connection
app.get('/api/messages/:connectionId', async (req, res) => {
  const { connectionId } = req.params;
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Message
app.post('/api/messages', async (req, res) => {
  const { connectionId, senderId, text } = req.body;
  try {
    const { error } = await supabase
      .from('messages')
      .insert([{ connection_id: connectionId, sender_id: senderId, text }]);

    if (error) {
      console.error('[Backend] Error inserting message:', error);
      throw error;
    }
    
    // We don't need the exact DB row back for the broadcast, just a success signal
    // We construct a mock object with the data we know for the frontend to broadcast
    const savedMsg = {
      id: crypto.randomUUID(), // Provide a temporary ID for React keys
      connection_id: connectionId,
      sender_id: senderId,
      text: text,
      created_at: new Date().toISOString()
    };

    res.status(201).json(savedMsg);
  } catch (error) {
    console.error('[Backend ERROR Detail]:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
