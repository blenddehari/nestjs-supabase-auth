-- First, let's check if our tables exist and create them if they don't
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Profile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID UNIQUE NOT NULL,
  "full_name" TEXT,
  "headline" TEXT,
  "bio" TEXT,
  "location" TEXT,
  "website" TEXT,
  "avatar_url" TEXT,
  "status" TEXT DEFAULT 'available',
  "skills" TEXT[] DEFAULT '{}',
  "experiences" JSONB DEFAULT '[]'::jsonb,
  "education" JSONB DEFAULT '[]'::jsonb,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create index on user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS "Profile_user_id_idx" ON "Profile"("user_id");

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into our custom User table
  INSERT INTO "User" ("id", "email", "created_at", "updated_at")
  VALUES (NEW.id, NEW.email, NEW.created_at, NEW.updated_at)
  ON CONFLICT (id) DO NOTHING; -- Skip if user already exists
  
  -- Create an empty profile
  INSERT INTO "Profile" ("user_id")
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING; -- Skip if profile already exists
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW; -- Still return NEW to not block user creation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a function to handle existing users
-- This will create User and Profile records for users that already exist
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN SELECT id, email, created_at, updated_at FROM auth.users
  LOOP
    -- Insert into User table if not exists
    INSERT INTO "User" ("id", "email", "created_at", "updated_at")
    VALUES (auth_user.id, auth_user.email, auth_user.created_at, auth_user.updated_at)
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert into Profile table if not exists
    INSERT INTO "Profile" ("user_id")
    VALUES (auth_user.id)
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create profiles for existing users
SELECT public.create_missing_profiles(); 