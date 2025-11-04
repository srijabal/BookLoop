-- Fix: Create missing profile for existing user
-- Run this in Supabase SQL Editor

-- First, let's see if your profile exists
-- Replace 'your-email@iitr.ac.in' with your actual email
SELECT
  u.id as user_id,
  u.email,
  p.id as profile_id
FROM
  auth.users u
LEFT JOIN
  public.profiles p ON u.id = p.id
WHERE
  u.email = 'your-email@iitr.ac.in';

-- If profile_id is NULL, run this to create it:
-- Replace 'your-email@iitr.ac.in' and 'Your Name' with your details

INSERT INTO public.profiles (id, email, full_name, branch, year, institute_id)
SELECT
  id,
  email,
  'Your Name',  -- Replace with your name
  'Your Branch',  -- Replace with your branch
  1,  -- Replace with your year (1-5)
  'Your ID'  -- Replace with your institute ID
FROM auth.users
WHERE email = 'your-email@iitr.ac.in'
ON CONFLICT (id) DO NOTHING;

-- Verify the profile was created
SELECT * FROM public.profiles WHERE email = 'your-email@iitr.ac.in';
