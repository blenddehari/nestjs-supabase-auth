-- Get the ID of the test user we just created
WITH test_user AS (
    SELECT id FROM auth.users WHERE email = 'test-manual@example.com'
)

-- Check if the user exists in the public.User table
SELECT 'User table' as table_name, * FROM public."User" 
WHERE email = 'test-manual@example.com';

-- Check if the profile exists in the public.Profile table
SELECT 'Profile table' as table_name, * FROM public."Profile" p
JOIN public."User" u ON p.user_id = u.id
WHERE u.email = 'test-manual@example.com'; 