-- Create Users table (if not exists already in Supabase Auth)
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Profiles table
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

-- Create index on user_id
CREATE INDEX IF NOT EXISTS "Profile_user_id_idx" ON "Profile"("user_id");

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Get the user ID from the newly created auth.users record
  new_user_id := NEW.id;
  
  -- Insert into our custom User table
  INSERT INTO "User" ("id", "email", "created_at", "updated_at")
  VALUES (new_user_id, NEW.email, NEW.created_at, NEW.updated_at);
  
  -- Create an empty profile
  INSERT INTO "Profile" ("user_id")
  VALUES (new_user_id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW; -- Still return NEW to not block user creation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 