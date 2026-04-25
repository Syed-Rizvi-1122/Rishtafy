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

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role, candidateEmail } = req.body;

  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(`[Backend] Registering user: ${email} with role: ${role}`);
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });

    if (authError) {
      console.error('[Backend] Supabase Auth Error:', authError.message);
      throw authError;
    }

    const user = authData.user;
    if (!user) throw new Error('User creation failed');

    // 2. Insert into our public.users table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          email: user.email,
          role: role.toLowerCase(),
        },
      ]);

    if (dbError) throw dbError;

    // 3. Create initial profile if role is candidate
    if (role.toLowerCase() === 'candidate') {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            full_name,
          },
        ]);
      if (profileError) console.error('Error creating profile:', profileError);
    }

    // 4. Handle Guardian-Candidate link if provided
    if (role.toLowerCase() === 'guardian' && candidateEmail) {
      // Find candidate by email
      const { data: candidateData, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', candidateEmail)
        .eq('role', 'candidate')
        .single();

      if (findError) {
        console.error('Candidate not found for linking:', findError);
        // We don't fail the whole registration if linking fails, but we log it
      } else if (candidateData) {
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error('Login failed');

    // Fetch user role from our public.users table
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
    // Create base payload
    const updatePayload = {
      full_name: profileData.name,
      age: profileData.age ? parseInt(profileData.age) : null,
      city: profileData.city || null,
      education: profileData.education || null,
      profession: profileData.profession || null,
      religious_values: profileData.religiousValues || null,
      bio: profileData.aboutMe || null,
      partner_pref_age_min: profileData.partnerAgeMin ? parseInt(profileData.partnerAgeMin) : 18,
      partner_pref_age_max: profileData.partnerAgeMax ? parseInt(profileData.partnerAgeMax) : 70,
      partner_pref_city: profileData.partnerCity || 'Any',
      partner_pref_education: profileData.partnerEducation || 'Any',
      updated_at: new Date().toISOString()
    };

    // Only add gender if it is truly needed and doesn't crash the cache
    // For now, we skip it to ensure Sprint 1 completes.
    
    console.log('[Backend] Attempting update for user:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[Backend] DB Update Error:', error.message);
      throw error;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: data
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
      .select('*, users(is_verified)')
      .limit(20);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
