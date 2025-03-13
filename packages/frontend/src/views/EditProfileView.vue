<template>
	<div class="edit-profile-container">
		<h1>Edit Your Profile</h1>
		
		<div v-if="loading" class="loading">
			Loading profile...
		</div>
		
		<div v-else-if="error" class="error-message">
			{{ error }}
			<button @click="fetchProfile" class="retry-button">Retry</button>
		</div>
		
		<form v-else @submit.prevent="saveProfile" class="profile-form">
			<div class="form-section">
				<h3>Profile Picture</h3>
				<div class="avatar-upload">
					<div class="avatar-preview">
						<img 
							v-if="imagePreview" 
							:src="imagePreview" 
							alt="Profile avatar preview" 
							class="avatar"
						>
						<div v-else-if="profile.avatarUrl" class="avatar">
							<img 
								:src="profile.avatarUrl" 
								alt="Current profile avatar" 
							>
						</div>
						<div v-else class="avatar-placeholder">
							{{ getInitials(profile.fullName) }}
						</div>
					</div>
					
					<div class="upload-controls">
						<label for="avatar-upload" class="upload-button">
							Choose Image
							<input 
								type="file" 
								id="avatar-upload" 
								accept="image/*"
								@change="handleImageUpload" 
								class="hidden-input"
							>
						</label>
						<button 
							v-if="imageFile || profile.avatarUrl" 
							type="button" 
							@click="removeImage" 
							class="remove-button"
						>
							Remove Image
						</button>
					</div>
				</div>
			</div>
			
			<div class="form-section">
				<h3>Basic Information</h3>
				
				<div class="form-group">
					<label for="fullName">Full Name</label>
					<input 
						type="text" 
						id="fullName" 
						v-model="profile.fullName" 
						placeholder="Your full name"
					>
				</div>
				
				<div class="form-group">
					<label for="headline">Headline</label>
					<input 
						type="text" 
						id="headline" 
						v-model="profile.headline" 
						placeholder="Your professional headline"
					>
				</div>
				
				<div class="form-group">
					<label for="location">Location</label>
					<input 
						type="text" 
						id="location" 
						v-model="profile.location" 
						placeholder="Your location"
					>
				</div>
				
				<div class="form-group">
					<label for="website">Website</label>
					<input 
						type="url" 
						id="website" 
						v-model="profile.website" 
						placeholder="Your website URL"
					>
				</div>
				
				<div class="form-group">
					<label for="status">Status</label>
					<select id="status" v-model="profile.status">
						<option value="available">Available</option>
						<option value="looking">Actively Looking for Jobs</option>
						<option value="open">Open to Opportunities</option>
						<option value="hiring">Hiring</option>
						<option value="freelancing">Looking for Freelance Work</option>
						<option value="consulting">Available for Consulting</option>
						<option value="not_looking">Not Looking</option>
					</select>
				</div>
			</div>
			
			<div class="form-section">
				<h3>About</h3>
				<div class="form-group">
					<label for="bio">Bio</label>
					<textarea 
						id="bio" 
						v-model="profile.bio" 
						placeholder="Tell us about yourself"
						rows="5"
					></textarea>
				</div>
			</div>
			
			<div class="form-section">
				<h3>Skills</h3>
				<div class="form-group">
					<label for="skills">Skills (comma separated)</label>
					<input 
						type="text" 
						id="skills" 
						v-model="skillsInput" 
						placeholder="e.g. JavaScript, React, Node.js"
					>
					<div v-if="skillsArray.length > 0" class="skills-preview">
						<span 
							v-for="(skill, index) in skillsArray" 
							:key="index" 
							class="skill-tag"
						>
							{{ skill }}
							<button 
								type="button" 
								@click="removeSkill(index)" 
								class="remove-skill"
							>
								×
							</button>
						</span>
					</div>
				</div>
			</div>
			
			<div class="form-section">
				<h3>Experience</h3>
				<div 
					v-for="(exp, index) in profile.experiences" 
					:key="index" 
					class="experience-item"
				>
					<div class="experience-header">
						<h4>Experience #{{ index + 1 }}</h4>
						<button 
							type="button" 
							@click="removeExperience(index)" 
							class="remove-button"
						>
							Remove
						</button>
					</div>
					
					<div class="form-group">
						<label :for="'exp-title-' + index">Title</label>
						<input 
							:id="'exp-title-' + index" 
							v-model="exp.title" 
							placeholder="Job title"
						>
					</div>
					
					<div class="form-group">
						<label :for="'exp-company-' + index">Company</label>
						<input 
							:id="'exp-company-' + index" 
							v-model="exp.company" 
							placeholder="Company name"
						>
					</div>
					
					<div class="form-row">
						<div class="form-group half">
							<label :for="'exp-start-' + index">Start Date</label>
							<input 
								:id="'exp-start-' + index" 
								v-model="exp.startDate" 
								placeholder="MM/YYYY"
							>
						</div>
						
						<div class="form-group half">
							<label :for="'exp-end-' + index">End Date</label>
							<input 
								:id="'exp-end-' + index" 
								v-model="exp.endDate" 
								placeholder="MM/YYYY or 'Present'"
							>
						</div>
					</div>
					
					<div class="form-group">
						<label :for="'exp-desc-' + index">Description</label>
						<textarea 
							:id="'exp-desc-' + index" 
							v-model="exp.description" 
							placeholder="Describe your responsibilities and achievements"
							rows="3"
						></textarea>
					</div>
				</div>
				
				<button 
					type="button" 
					@click="addExperience" 
					class="add-button"
				>
					Add Experience
				</button>
			</div>
			
			<div class="form-section">
				<h3>Education</h3>
				<div 
					v-for="(edu, index) in profile.education" 
					:key="index" 
					class="education-item"
				>
					<div class="education-header">
						<h4>Education #{{ index + 1 }}</h4>
						<button 
							type="button" 
							@click="removeEducation(index)" 
							class="remove-button"
						>
							Remove
						</button>
					</div>
					
					<div class="form-group">
						<label :for="'edu-degree-' + index">Degree</label>
						<input 
							:id="'edu-degree-' + index" 
							v-model="edu.degree" 
							placeholder="Degree or certificate"
						>
					</div>
					
					<div class="form-group">
						<label :for="'edu-institution-' + index">Institution</label>
						<input 
							:id="'edu-institution-' + index" 
							v-model="edu.institution" 
							placeholder="School or university"
						>
					</div>
					
					<div class="form-row">
						<div class="form-group half">
							<label :for="'edu-start-' + index">Start Year</label>
							<input 
								:id="'edu-start-' + index" 
								v-model="edu.startYear" 
								placeholder="YYYY"
							>
						</div>
						
						<div class="form-group half">
							<label :for="'edu-end-' + index">End Year</label>
							<input 
								:id="'edu-end-' + index" 
								v-model="edu.endYear" 
								placeholder="YYYY or 'Present'"
							>
						</div>
					</div>
					
					<div class="form-group">
						<label :for="'edu-desc-' + index">Description</label>
						<textarea 
							:id="'edu-desc-' + index" 
							v-model="edu.description" 
							placeholder="Describe your studies and achievements"
							rows="3"
						></textarea>
					</div>
				</div>
				
				<button 
					type="button" 
					@click="addEducation" 
					class="add-button"
				>
					Add Education
				</button>
			</div>
			
			<div class="form-actions">
				<button type="button" @click="cancel" class="cancel-button">Cancel</button>
				<button type="submit" class="save-button" :disabled="saving">
					{{ saving ? 'Saving...' : 'Save Profile' }}
				</button>
			</div>
		</form>
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
	name: 'EditProfileView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()
		
		const profile = ref({
			fullName: '',
			headline: '',
			bio: '',
			location: '',
			website: '',
			avatarUrl: '',
			status: 'available',
			skills: [],
			experiences: [],
			education: []
		})
		
		const loading = ref(true)
		const saving = ref(false)
		const error = ref(null)
		const skillsInput = ref('')
		const imageFile = ref(null)
		const imagePreview = ref(null)
		
		// Computed property to convert comma-separated skills to array
		const skillsArray = computed(() => {
			return profile.value.skills || []
		})
		
		// Fetch the user's profile
		async function fetchProfile() {
			if (!authStore.isAuthenticated) {
				router.push('/login')
				return
			}
			
			loading.value = true
			error.value = null
			
			try {
				// Fetch profile from API
				const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profiles/me`, {
					headers: {
						'Authorization': `Bearer ${authStore.session?.access_token}`
					}
				})
				
				if (!response.ok) {
					if (response.status === 401) {
						// Handle unauthorized error
						authStore.logout()
						router.push('/login')
						throw new Error('Your session has expired. Please log in again.')
					}
					throw new Error(`Failed to fetch profile: ${response.statusText}`)
				}
				
				const data = await response.json()
				
				// Initialize profile with fetched data
				profile.value = {
					...profile.value,
					...data,
					// Ensure arrays are initialized
					skills: data.skills || [],
					experiences: data.experiences || [],
					education: data.education || []
				}
				
				// Initialize skills input
				skillsInput.value = profile.value.skills.join(', ')
			} catch (err) {
				console.error('Error fetching profile:', err)
				error.value = err.message || 'Failed to load profile. Please try again.'
			} finally {
				loading.value = false
			}
		}
		
		// Handle image upload
		function handleImageUpload(event) {
			const file = event.target.files[0]
			if (!file) return
			
			// Validate file type
			if (!file.type.match('image.*')) {
				error.value = 'Please select an image file'
				return
			}
			
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				error.value = 'Image size should be less than 5MB'
				return
			}
			
			imageFile.value = file
			
			// Create preview
			const reader = new FileReader()
			reader.onload = e => {
				imagePreview.value = e.target.result
			}
			reader.readAsDataURL(file)
		}
		
		// Remove image
		function removeImage() {
			imageFile.value = null
			imagePreview.value = null
			profile.value.avatarUrl = null
		}
		
		// Upload image to Supabase Storage
		async function uploadImage() {
			if (!imageFile.value) return null
			
			try {
				// Use the backend API for uploads (S3-based)
				return await uploadViaBackend()
			} catch (err) {
				console.error('Error uploading image via backend:', err)
				
				// Fall back to direct Supabase upload if backend fails
				try {
					const userId = authStore.user.id
					const fileExt = imageFile.value.name.split('.').pop()
					const fileName = `${userId}-${Date.now()}.${fileExt}`
					const filePath = `avatars/${fileName}`
					
					// Upload the file
					const { data, error: uploadError } = await supabase.storage
						.from('profile-avatars')
						.upload(filePath, imageFile.value, {
							upsert: true,
							cacheControl: '3600'
						})
					
					if (uploadError) {
						console.error('Error uploading image directly:', uploadError)
						throw uploadError
					}
					
					// Get the public URL
					const { data: urlData } = supabase.storage
						.from('profile-avatars')
						.getPublicUrl(filePath)
					
					return urlData.publicUrl
				} catch (directErr) {
					console.error('Error with direct upload fallback:', directErr)
					throw new Error('Failed to upload image. Please try again.')
				}
			}
		}
		
		// Upload image via backend API
		async function uploadViaBackend() {
			if (!imageFile.value) return null
			
			try {
				// Create a FormData object
				const formData = new FormData()
				formData.append('avatar', imageFile.value)
				
				// Upload via backend API
				const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profiles/upload-avatar`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${authStore.session?.access_token}`
					},
					body: formData
				})
				
				if (!response.ok) {
					throw new Error(`Failed to upload image: ${response.statusText}`)
				}
				
				const data = await response.json()
				return data.avatarUrl
			} catch (err) {
				console.error('Error uploading image via backend:', err)
				throw new Error('Failed to upload image. Please try again.')
			}
		}
		
		// Add a new experience
		function addExperience() {
			profile.value.experiences.push({
				title: '',
				company: '',
				startDate: '',
				endDate: '',
				description: ''
			})
		}
		
		// Remove an experience
		function removeExperience(index) {
			profile.value.experiences.splice(index, 1)
		}
		
		// Add a new education
		function addEducation() {
			profile.value.education.push({
				degree: '',
				institution: '',
				startYear: '',
				endYear: '',
				description: ''
			})
		}
		
		// Remove an education
		function removeEducation(index) {
			profile.value.education.splice(index, 1)
		}
		
		// Remove a skill
		function removeSkill(index) {
			profile.value.skills.splice(index, 1)
			skillsInput.value = profile.value.skills.join(', ')
		}
		
		// Save the profile
		async function saveProfile() {
			if (!authStore.isAuthenticated) {
				router.push('/login')
				return
			}
			
			saving.value = true
			error.value = null
			
			try {
				// Process skills from input
				if (skillsInput.value) {
					profile.value.skills = skillsInput.value
						.split(',')
						.map(skill => skill.trim())
						.filter(skill => skill)
				} else {
					profile.value.skills = []
				}
				
				// Upload image if there's a new one
				if (imageFile.value) {
					profile.value.avatarUrl = await uploadImage()
				}
				
				// Save profile to API
				const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profiles/me`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authStore.session?.access_token}`
					},
					body: JSON.stringify(profile.value)
				})
				
				if (!response.ok) {
					if (response.status === 401) {
						// Handle unauthorized error
						authStore.logout()
						router.push('/login')
						throw new Error('Your session has expired. Please log in again.')
					}
					throw new Error(`Failed to save profile: ${response.statusText}`)
				}
				
				// Navigate back to profile view
				router.push('/profile')
			} catch (err) {
				console.error('Error saving profile:', err)
				error.value = err.message || 'Failed to save profile. Please try again.'
				saving.value = false
			}
		}
		
		// Cancel editing
		function cancel() {
			router.push('/profile')
		}
		
		// Get initials for avatar placeholder
		function getInitials(name) {
			if (!name) return '?'
			
			return name
				.split(' ')
				.map(part => part.charAt(0).toUpperCase())
				.slice(0, 2)
				.join('')
		}
		
		onMounted(() => {
			fetchProfile()
		})
		
		return {
			profile,
			loading,
			saving,
			error,
			skillsInput,
			skillsArray,
			imageFile,
			imagePreview,
			fetchProfile,
			handleImageUpload,
			removeImage,
			addExperience,
			removeExperience,
			addEducation,
			removeEducation,
			removeSkill,
			saveProfile,
			cancel,
			getInitials
		}
	}
}
</script>

<style scoped>
.edit-profile-container {
	max-width: 800px;
	margin: 40px auto;
	padding: 20px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
	text-align: center;
	margin-bottom: 24px;
	color: #333;
}

.loading, .error-message {
	text-align: center;
	padding: 40px 0;
	color: #666;
}

.error-message {
	color: #dc2626;
}

.retry-button {
	margin-top: 16px;
	padding: 8px 16px;
	background-color: #4f46e5;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.form-section {
	margin-bottom: 32px;
	border-top: 1px solid #eee;
	padding-top: 24px;
}

.form-section h3 {
	margin-top: 0;
	margin-bottom: 16px;
	color: #333;
}

.form-group {
	margin-bottom: 16px;
}

.form-row {
	display: flex;
	gap: 16px;
}

.form-group.half {
	flex: 1;
}

label {
	display: block;
	margin-bottom: 8px;
	font-weight: 500;
	color: #4b5563;
}

input, textarea, select {
	width: 100%;
	padding: 10px;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	font-size: 16px;
}

textarea {
	resize: vertical;
}

.hidden-input {
	display: none;
}

.avatar-upload {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
}

.avatar-preview {
	margin-right: 24px;
}

.avatar, .avatar-placeholder {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	object-fit: cover;
}

.avatar-placeholder {
	background-color: #4f46e5;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36px;
	font-weight: bold;
}

.upload-controls {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.upload-button, .remove-button, .add-button {
	padding: 8px 16px;
	background-color: #4f46e5;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	text-align: center;
}

.remove-button {
	background-color: #ef4444;
}

.skills-preview {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 8px;
}

.skill-tag {
	background-color: #f3f4f6;
	padding: 6px 12px;
	border-radius: 16px;
	font-size: 14px;
	display: flex;
	align-items: center;
}

.remove-skill {
	background: none;
	border: none;
	color: #6b7280;
	font-size: 16px;
	margin-left: 4px;
	cursor: pointer;
	padding: 0 4px;
}

.experience-item, .education-item {
	margin-bottom: 24px;
	padding: 16px;
	background-color: #f9fafb;
	border-radius: 8px;
}

.experience-header, .education-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.experience-header h4, .education-header h4 {
	margin: 0;
	color: #333;
}

.form-actions {
	display: flex;
	justify-content: center;
	gap: 16px;
	margin-top: 32px;
}

.save-button, .cancel-button {
	padding: 12px 24px;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.save-button {
	background-color: #4f46e5;
	color: white;
}

.save-button:hover {
	background-color: #4338ca;
}

.save-button:disabled {
	background-color: #9ca3af;
	cursor: not-allowed;
}

.cancel-button {
	background-color: #f3f4f6;
	color: #4b5563;
}

.cancel-button:hover {
	background-color: #e5e7eb;
}
</style> 