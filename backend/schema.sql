-- Create users table that extends Supabase auth.users
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('candidate', 'guardian', 'admin')) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table for candidate details
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER,
    city TEXT,
    education TEXT,
    profession TEXT,
    religious_values TEXT,
    bio TEXT,
    photo_path TEXT,
    partner_pref_age_min INTEGER,
    partner_pref_age_max INTEGER,
    partner_pref_city TEXT,
    partner_pref_education TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links Guardians to Candidates
CREATE TABLE public.guardian_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    candidate_user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'active')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_links ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies

-- Users: Read access for everyone (for search/display), update only own
CREATE POLICY "Users are viewable by everyone" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Profiles: Viewable by everyone, update by owner or linked guardian
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Candidates can update their own profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Guardians can update linked candidate profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.guardian_links
            WHERE guardian_user_id = auth.uid()
            AND candidate_user_id = public.profiles.user_id
        )
    );

-- Guardian Links: Visible to involved parties
CREATE POLICY "Guardian links visible to involved parties" ON public.guardian_links
    FOR SELECT USING (auth.uid() = guardian_user_id OR auth.uid() = candidate_user_id);
