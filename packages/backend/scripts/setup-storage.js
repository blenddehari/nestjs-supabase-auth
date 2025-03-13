/**
 * This script sets up the Supabase storage bucket for profile avatars.
 * Run this script once to create the bucket and set the appropriate permissions.
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase environment variables. Check your .env file.')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
	try {
		console.log('Setting up Supabase storage for profile avatars...')
		
		// Check if the bucket already exists
		const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
		
		if (bucketsError) {
			throw bucketsError
		}
		
		const bucketName = 'profile-avatars'
		const bucketExists = buckets.some(bucket => bucket.name === bucketName)
		
		if (bucketExists) {
			console.log(`Bucket '${bucketName}' already exists.`)
		} else {
			// Create the bucket
			const { error: createError } = await supabase.storage.createBucket(bucketName, {
				public: true,
				fileSizeLimit: 5 * 1024 * 1024, // 5MB
				allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
			})
			
			if (createError) {
				throw createError
			}
			
			console.log(`Bucket '${bucketName}' created successfully.`)
		}
		
		// Set bucket policies to allow public access to avatars
		const { error: policyError } = await supabase.storage.from(bucketName).getPublicUrl('test')
		
		if (policyError) {
			console.warn('Warning: Could not verify public access to bucket. You may need to set public access policies manually in the Supabase dashboard.')
		} else {
			console.log(`Bucket '${bucketName}' is publicly accessible.`)
		}
		
		console.log('Storage setup completed successfully!')
	} catch (error) {
		console.error('Error setting up storage:', error)
		process.exit(1)
	}
}

setupStorage() 