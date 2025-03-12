-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the tables (in reverse order of dependencies)
DROP TABLE IF EXISTS "Profile";
DROP TABLE IF EXISTS "User";

-- Now you can run the migration.sql script to recreate everything 