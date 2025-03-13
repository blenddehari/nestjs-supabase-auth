-- Insert a test user directly into the auth.users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',  -- instance_id
    gen_random_uuid(),                       -- id (generate a random UUID)
    'authenticated',                         -- aud
    'authenticated',                         -- role
    'test-manual@example.com',               -- email
    '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12', -- encrypted_password (dummy value)
    NOW(),                                   -- email_confirmed_at
    NULL,                                    -- recovery_sent_at
    NOW(),                                   -- last_sign_in_at
    '{"provider":"email","providers":["email"]}', -- raw_app_meta_data
    '{}',                                    -- raw_user_meta_data
    NOW(),                                   -- created_at
    NOW(),                                   -- updated_at
    '',                                      -- confirmation_token
    '',                                      -- email_change
    '',                                      -- email_change_token_new
    ''                                       -- recovery_token
); 