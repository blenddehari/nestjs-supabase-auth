require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

async function createTestUser() {
	try {
		// Create Supabase client
		const supabase = createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY
		)

		console.log('Creating test user...')

		// Create a test user using the auth API (not admin API since we might not have admin access)
		const { data, error } = await supabase.auth.signUp({
			email: `test-${Date.now()}@example.com`,
			password: 'password123',
			options: {
				emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
			}
		})

		if (error) {
			console.error('Error creating test user:', error)
			return
		}

		console.log('Test user created successfully:', data.user)

		// Wait a moment for the trigger to execute
		await new Promise(resolve => setTimeout(resolve, 2000))

		// Check if the user was created in the public.User table
		const { data: userData, error: userError } = await supabase
			.from('User')
			.select('*')
			.eq('id', data.user.id)
			.single()

		if (userError) {
			console.error('Error checking User record:', userError)
		} else {
			console.log('User record:', userData)
		}

		// Check if the profile was created in the public.Profile table
		const { data: profileData, error: profileError } = await supabase
			.from('Profile')
			.select('*')
			.eq('user_id', data.user.id)
			.single()

		if (profileError) {
			console.error('Error checking Profile record:', profileError)
		} else {
			console.log('Profile record:', profileData)
		}

	} catch (error) {
		console.error('Unexpected error:', error)
	}
}

createTestUser() 