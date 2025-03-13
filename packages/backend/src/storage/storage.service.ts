import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { 
	S3Client, 
	PutObjectCommand, 
	GetObjectCommand,
	HeadBucketCommand,
	NoSuchBucket
} from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'

@Injectable()
export class StorageService implements OnModuleInit {
	private s3Client: S3Client
	private supabase
	private bucketName = 'profile-avatars'
	private region = 'us-west-1' // Adjust based on your Supabase project region
	private readonly logger = new Logger(StorageService.name)
	private bucketExists = false

	constructor(private configService: ConfigService) {
		// Extract the project reference from the Supabase URL
		const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
		const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1]

		this.s3Client = new S3Client({
			forcePathStyle: true,
			region: this.region,
			endpoint: `${supabaseUrl}/storage/v1/s3`,
			credentials: {
				accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
			}
		})

		// Initialize Supabase client for bucket creation
		this.supabase = createClient(
			this.configService.get<string>('SUPABASE_URL'),
			this.configService.get<string>('SUPABASE_KEY')
		)
	}

	async onModuleInit() {
		// Check if bucket exists
		await this.checkBucketExists()
		
		if (!this.bucketExists) {
			this.logger.warn(`
=======================================================================
IMPORTANT: The '${this.bucketName}' bucket does not exist or is not accessible.

Please create it manually in the Supabase dashboard:
1. Go to https://app.supabase.com and select your project
2. Navigate to Storage > Buckets
3. Click "New Bucket"
4. Name it "${this.bucketName}"
5. Check "Public bucket" to make it publicly accessible
6. Click "Create bucket"

After creating the bucket, add these policies:
1. For uploads (INSERT):
   - Policy name: "Allow authenticated uploads"
   - For operation: INSERT
   - Policy definition: (auth.role() = 'authenticated')

2. For viewing images (SELECT):
   - Policy name: "Allow public access"
   - For operation: SELECT
   - Policy definition: true
=======================================================================
			`)
		}
	}

	/**
	 * Check if the bucket exists
	 */
	async checkBucketExists(): Promise<boolean> {
		try {
			this.logger.log(`Checking if bucket '${this.bucketName}' exists...`)
			
			// First try with S3 client
			try {
				const headCommand = new HeadBucketCommand({
					Bucket: this.bucketName
				})
				await this.s3Client.send(headCommand)
				this.logger.log(`Bucket '${this.bucketName}' exists and is accessible.`)
				this.bucketExists = true
				return true
			} catch (error) {
				// Try with Supabase client
				try {
					const { data, error: listError } = await this.supabase.storage.getBucket(this.bucketName)
					
					if (!listError && data) {
						this.logger.log(`Bucket '${this.bucketName}' exists and is accessible via Supabase client.`)
						this.bucketExists = true
						return true
					}
				} catch (supabaseError) {
					this.logger.log(`Supabase bucket check failed: ${supabaseError.message}`)
				}
				
				this.logger.warn(`Bucket '${this.bucketName}' does not exist or is not accessible.`)
				this.bucketExists = false
				return false
			}
		} catch (error) {
			this.logger.error(`Error checking if bucket exists: ${error.message}`)
			this.bucketExists = false
			return false
		}
	}

	/**
	 * Upload a file to Supabase Storage
	 * @param filePath Path where the file will be stored
	 * @param fileBuffer Buffer containing the file data
	 * @param contentType MIME type of the file
	 * @returns The public URL of the uploaded file
	 */
	async uploadFile(filePath: string, fileBuffer: Buffer, contentType: string): Promise<string> {
		// Check if bucket exists if we haven't confirmed it yet
		if (!this.bucketExists) {
			this.bucketExists = await this.checkBucketExists()
		}

		// Try S3 client first if bucket exists
		if (this.bucketExists) {
			try {
				this.logger.log(`Uploading file to '${this.bucketName}/${filePath}' via S3 client...`)
				const command = new PutObjectCommand({
					Bucket: this.bucketName,
					Key: filePath,
					Body: fileBuffer,
					ContentType: contentType,
					ACL: 'public-read', // Make the file publicly accessible
				})

				await this.s3Client.send(command)

				// Construct the public URL
				const supabaseUrl = this.configService.get<string>('SUPABASE_URL')
				const publicUrl = `${supabaseUrl}/storage/v1/object/public/${this.bucketName}/${filePath}`
				this.logger.log(`File uploaded successfully via S3 client. URL: ${publicUrl}`)
				return publicUrl
			} catch (error) {
				this.logger.error(`S3 client upload failed: ${error.message}`)
				// Fall through to Supabase client
			}
		}

		// Try Supabase client as fallback
		try {
			this.logger.log(`Uploading file to '${this.bucketName}/${filePath}' via Supabase client...`)
			const { data, error: uploadError } = await this.supabase.storage
				.from(this.bucketName)
				.upload(filePath, fileBuffer, {
					contentType,
					upsert: true
				})

			if (uploadError) {
				if (uploadError.message.includes('bucket') || uploadError.statusCode === 404) {
					throw new Error(`Bucket '${this.bucketName}' does not exist. Please create it manually in the Supabase dashboard.`)
				}
				throw uploadError
			}

			// Get the public URL
			const { data: urlData } = this.supabase.storage
				.from(this.bucketName)
				.getPublicUrl(filePath)

			this.logger.log(`File uploaded successfully via Supabase client. URL: ${urlData.publicUrl}`)
			return urlData.publicUrl
		} catch (supabaseError) {
			this.logger.error(`Supabase client upload failed: ${supabaseError.message}`)
			throw new Error(`Failed to upload file: ${supabaseError.message}. Please ensure the '${this.bucketName}' bucket exists and has proper permissions.`)
		}
	}

	/**
	 * Generate a unique file path for an avatar
	 * @param userId User ID
	 * @param fileExt File extension
	 * @returns A unique file path
	 */
	generateAvatarPath(userId: string, fileExt: string): string {
		return `avatars/${userId}-${Date.now()}.${fileExt}`
	}
} 