-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Log the event for debugging
  RAISE NOTICE 'Trigger handle_new_user executed for user ID: %', NEW.id;
  
  -- Create a new user record in the public schema
  INSERT INTO public."User" (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  -- Log successful user creation
  RAISE NOTICE 'Created User record with ID: %', new_user_id;
  
  -- Create a profile for the new user
  INSERT INTO public."Profile" (
    user_id, 
    full_name, 
    headline, 
    bio, 
    location, 
    website, 
    avatar_url, 
    status, 
    skills, 
    experiences, 
    education, 
    created_at, 
    updated_at
  )
  VALUES (
    new_user_id, 
    '', -- empty full_name
    '', -- empty headline
    '', -- empty bio
    '', -- empty location
    '', -- empty website
    '', -- empty avatar_url
    'available', -- default status
    '{}', -- empty skills array
    '[]', -- empty experiences JSON
    '[]', -- empty education JSON
    NOW(), 
    NOW()
  );
  
  -- Log successful profile creation
  RAISE NOTICE 'Created Profile record for user ID: %', new_user_id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop the trigger if it already exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 