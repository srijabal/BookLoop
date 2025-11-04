-- Fix: Create profiles for ALL existing users without profiles
-- Run this in Supabase SQL Editor

-- Step 1: Create profiles for all users that don't have one
INSERT INTO public.profiles (id, email, full_name)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User')
FROM
  auth.users u
LEFT JOIN
  public.profiles p ON u.id = p.id
WHERE
  p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Verify the trigger exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Check results
SELECT
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profiles
FROM
  auth.users u
LEFT JOIN
  public.profiles p ON u.id = p.id;

-- Step 4: Show any users still missing profiles (should be 0)
SELECT
  u.id,
  u.email,
  u.created_at
FROM
  auth.users u
LEFT JOIN
  public.profiles p ON u.id = p.id
WHERE
  p.id IS NULL;
