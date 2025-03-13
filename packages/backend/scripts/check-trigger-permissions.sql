-- Check the permissions of the handle_new_user function
SELECT 
    p.proname AS function_name,
    p.prosecdef AS security_definer,
    p.proowner::regrole AS owner,
    p.proacl AS access_privileges
FROM 
    pg_proc p
WHERE 
    p.proname = 'handle_new_user';

-- Check if the trigger is properly registered
SELECT 
    t.tgname AS trigger_name,
    t.tgrelid::regclass AS table_name,
    t.tgenabled AS enabled,
    t.tgisinternal AS is_internal,
    p.proname AS function_name
FROM 
    pg_trigger t
JOIN 
    pg_proc p ON t.tgfoid = p.oid
WHERE 
    t.tgname = 'on_auth_user_created'; 