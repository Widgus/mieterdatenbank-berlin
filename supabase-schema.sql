-- gutezeit – Supabase Schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.couples (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  couple_id    UUID REFERENCES public.couples(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activities (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id    UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT CHECK (category IN ('food','travel','home','sport','culture','other')),
  priority     TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  photo_url    TEXT,             -- reserved for future photo feature
  created_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER TABLE public.activities REPLICA IDENTITY FULL;
ALTER TABLE public.profiles   REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
-- (supabase_realtime publication already exists in Supabase)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- Private 2-person app → disable RLS, rely on app-level couple_id filtering.
-- If you later want proper auth, re-enable and add policies.
-- ============================================================

ALTER TABLE public.couples   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
