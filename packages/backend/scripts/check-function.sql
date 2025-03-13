-- Check if the handle_new_user function exists
SELECT 
    proname AS function_name,
    pronamespace::regnamespace AS schema_name,
    pg_get_functiondef(oid) AS function_definition
FROM pg_proc
WHERE proname = 'handle_new_user'; 