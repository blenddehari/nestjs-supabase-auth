-- Check for triggers in the database
SELECT 
    event_object_schema as schema_name,
    event_object_table as table_name,
    trigger_name,
    action_statement as definition
FROM information_schema.triggers
ORDER BY schema_name, table_name; 