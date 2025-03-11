<template>
	<div class="profile">
		<h1>My Profile</h1>
		<div v-if="loading" class="loading">Loading...</div>
		<div v-else>
			<div class="profile-tabs">
				<button 
					:class="{ active: activeTab === 'info' }" 
					@click="activeTab = 'info'"
				>
					Basic Info
				</button>
				<button 
					:class="{ active: activeTab === 'edit' }" 
					@click="activeTab = 'edit'"
				>
					Edit Profile
				</button>
			</div>

			<!-- View Profile Info -->
			<div v-if="activeTab === 'info'" class="profile-info">
				<div class="profile-header">
					<div class="profile-avatar">
						<img 
							:src="profileData.avatar_url || 'https://via.placeholder.com/150'" 
							alt="Profile Avatar"
						/>
					</div>
					<div class="profile-headline">
						<h2>{{ profileData.full_name || 'Your Name' }}</h2>
						<p class="headline">{{ profileData.headline || 'Your Professional Headline' }}</p>
						<p class="status-badge" :class="profileData.status">
							{{ getStatusLabel(profileData.status) }}
						</p>
					</div>
				</div>

				<div class="profile-section">
					<h3>About Me</h3>
					<p>{{ profileData.bio || 'No bio added yet.' }}</p>
				</div>

				<div class="profile-section">
					<h3>Experience</h3>
					<div v-if="profileData.experience && profileData.experience.length">
						<div v-for="(exp, index) in profileData.experience" :key="index" class="experience-item">
							<h4>{{ exp.title }} at {{ exp.company }}</h4>
							<p class="experience-date">{{ exp.start_date }} - {{ exp.end_date || 'Present' }}</p>
							<p>{{ exp.description }}</p>
							<div class="tags">
								<span v-for="(tag, tagIndex) in exp.tags" :key="tagIndex" class="tag">
									{{ tag }}
								</span>
							</div>
						</div>
					</div>
					<p v-else>No experience added yet.</p>
				</div>

				<div class="profile-section">
					<h3>Skills</h3>
					<div class="tags" v-if="profileData.skills && profileData.skills.length">
						<span v-for="(skill, index) in profileData.skills" :key="index" class="tag">
							{{ skill }}
						</span>
					</div>
					<p v-else>No skills added yet.</p>
				</div>

				<div class="profile-section">
					<h3>Contact Information</h3>
					<p><strong>Email:</strong> {{ user?.email }}</p>
					<p v-if="profileData.phone"><strong>Phone:</strong> {{ profileData.phone }}</p>
					<p v-if="profileData.linkedin"><strong>LinkedIn:</strong> <a :href="profileData.linkedin" target="_blank">{{ profileData.linkedin }}</a></p>
					<p v-if="profileData.github"><strong>GitHub:</strong> <a :href="profileData.github" target="_blank">{{ profileData.github }}</a></p>
				</div>
			</div>

			<!-- Edit Profile Form -->
			<div v-if="activeTab === 'edit'" class="profile-edit">
				<form @submit.prevent="saveProfile">
					<div v-if="updateError" class="error-message">{{ updateError }}</div>
					<div v-if="updateSuccess" class="success-message">Profile updated successfully!</div>

					<div class="form-section">
						<h3>Basic Information</h3>
						<div class="form-group">
							<label for="avatar">Profile Picture</label>
							<div class="avatar-upload">
								<img 
									:src="avatarPreview || profileData.avatar_url || 'https://via.placeholder.com/150'" 
									alt="Avatar Preview"
								/>
								<input 
									type="file" 
									id="avatar" 
									@change="handleAvatarChange" 
									accept="image/*"
								/>
							</div>
						</div>

						<div class="form-group">
							<label for="fullName">Full Name</label>
							<input 
								type="text" 
								id="fullName" 
								v-model="profileForm.full_name" 
								placeholder="Your full name"
							/>
						</div>

						<div class="form-group">
							<label for="headline">Professional Headline</label>
							<input 
								type="text" 
								id="headline" 
								v-model="profileForm.headline" 
								placeholder="e.g. Senior Software Engineer"
							/>
						</div>

						<div class="form-group">
							<label for="status">Current Status</label>
							<select id="status" v-model="profileForm.status">
								<option value="looking">Actively Looking for Jobs</option>
								<option value="open">Open to Opportunities</option>
								<option value="hiring">Hiring</option>
								<option value="freelancing">Looking for Freelance Work</option>
								<option value="consulting">Available for Consulting</option>
								<option value="not_looking">Not Looking</option>
							</select>
						</div>

						<div class="form-group">
							<label for="bio">About Me</label>
							<textarea 
								id="bio" 
								v-model="profileForm.bio" 
								rows="5" 
								placeholder="Tell us about yourself"
							></textarea>
						</div>
					</div>

					<div class="form-section">
						<h3>Contact Information</h3>
						<div class="form-group">
							<label for="phone">Phone (optional)</label>
							<input 
								type="tel" 
								id="phone" 
								v-model="profileForm.phone" 
								placeholder="Your phone number"
							/>
						</div>

						<div class="form-group">
							<label for="linkedin">LinkedIn (optional)</label>
							<input 
								type="url" 
								id="linkedin" 
								v-model="profileForm.linkedin" 
								placeholder="Your LinkedIn profile URL"
							/>
						</div>

						<div class="form-group">
							<label for="github">GitHub (optional)</label>
							<input 
								type="url" 
								id="github" 
								v-model="profileForm.github" 
								placeholder="Your GitHub profile URL"
							/>
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
							/>
						</div>
					</div>

					<div class="form-section">
						<h3>Experience</h3>
						<div v-for="(exp, index) in profileForm.experience" :key="index" class="experience-form">
							<div class="form-group">
								<label :for="'title-' + index">Job Title</label>
								<input 
									:id="'title-' + index" 
									v-model="exp.title" 
									placeholder="e.g. Software Engineer"
								/>
							</div>

							<div class="form-group">
								<label :for="'company-' + index">Company</label>
								<input 
									:id="'company-' + index" 
									v-model="exp.company" 
									placeholder="Company name"
								/>
							</div>

							<div class="form-row">
								<div class="form-group half">
									<label :for="'start-date-' + index">Start Date</label>
									<input 
										:id="'start-date-' + index" 
										v-model="exp.start_date" 
										placeholder="e.g. Jan 2020"
									/>
								</div>

								<div class="form-group half">
									<label :for="'end-date-' + index">End Date</label>
									<input 
										:id="'end-date-' + index" 
										v-model="exp.end_date" 
										placeholder="e.g. Dec 2022 or Present"
									/>
								</div>
							</div>

							<div class="form-group">
								<label :for="'description-' + index">Description</label>
								<textarea 
									:id="'description-' + index" 
									v-model="exp.description" 
									rows="3" 
									placeholder="Describe your role and achievements"
								></textarea>
							</div>

							<div class="form-group">
								<label :for="'tags-' + index">Tags (comma separated)</label>
								<input 
									:id="'tags-' + index" 
									v-model="experienceTagsInputs[index]" 
									placeholder="e.g. React, Frontend, UI/UX"
								/>
							</div>

							<button type="button" class="remove-button" @click="removeExperience(index)">
								Remove Experience
							</button>
						</div>

						<button type="button" class="add-button" @click="addExperience">
							Add Experience
						</button>
					</div>

					<div class="form-actions">
						<button type="submit" :disabled="saving">
							{{ saving ? 'Saving...' : 'Save Profile' }}
						</button>
					</div>
				</form>
			</div>

			<div class="actions">
				<button @click="handleLogout" class="logout-button" :disabled="loading">
					{{ loading ? 'Logging out...' : 'Logout' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

export default {
	name: 'ProfileView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()
		const loading = ref(true)
		const saving = ref(false)
		const activeTab = ref('info')
		const updateError = ref('')
		const updateSuccess = ref(false)
		const avatarPreview = ref(null)
		const avatarFile = ref(null)
		const skillsInput = ref('')
		const experienceTagsInputs = ref([])

		// Profile data from database
		const profileData = reactive({
			id: null,
			user_id: null,
			full_name: '',
			headline: '',
			bio: '',
			avatar_url: '',
			status: 'open',
			phone: '',
			linkedin: '',
			github: '',
			skills: [],
			experience: []
		})

		// Form data for editing
		const profileForm = reactive({
			full_name: '',
			headline: '',
			bio: '',
			status: 'open',
			phone: '',
			linkedin: '',
			github: '',
			skills: [],
			experience: []
		})

		const memberSince = computed(() => {
			if (!authStore.user?.created_at) return 'N/A'
			return new Date(authStore.user.created_at).toLocaleDateString()
		})

		// Load profile data
		async function loadProfile() {
			try {
				loading.value = true
				
				if (!authStore.user) {
					return
				}

				const { data, error } = await supabase
					.from('profiles')
					.select('*')
					.eq('user_id', authStore.user.id)
					.single()

				if (error && error.code !== 'PGRST116') {
					console.error('Error fetching profile:', error)
					return
				}

				// If profile exists, populate the data
				if (data) {
					Object.assign(profileData, data)
					
					// Initialize form with current data
					profileForm.full_name = data.full_name || ''
					profileForm.headline = data.headline || ''
					profileForm.bio = data.bio || ''
					profileForm.status = data.status || 'open'
					profileForm.phone = data.phone || ''
					profileForm.linkedin = data.linkedin || ''
					profileForm.github = data.github || ''
					profileForm.skills = [...(data.skills || [])]
					profileForm.experience = [...(data.experience || [])]
					
					// Initialize skills input
					skillsInput.value = profileForm.skills.join(', ')
					
					// Initialize experience tags inputs
					experienceTagsInputs.value = profileForm.experience.map(exp => 
						(exp.tags || []).join(', ')
					)
				} else {
					// Initialize empty experience tags inputs
					experienceTagsInputs.value = []
				}
			} catch (error) {
				console.error('Error in loadProfile:', error)
			} finally {
				loading.value = false
			}
		}

		// Handle avatar file selection
		function handleAvatarChange(event) {
			const file = event.target.files[0]
			if (file) {
				avatarFile.value = file
				const reader = new FileReader()
				reader.onload = e => {
					avatarPreview.value = e.target.result
				}
				reader.readAsDataURL(file)
			}
		}

		// Upload avatar to storage
		async function uploadAvatar() {
			if (!avatarFile.value) return null
			
			try {
				const fileExt = avatarFile.value.name.split('.').pop()
				const fileName = `${authStore.user.id}-${Date.now()}.${fileExt}`
				const filePath = `avatars/${fileName}`
				
				const { error: uploadError } = await supabase.storage
					.from('profiles')
					.upload(filePath, avatarFile.value)
				
				if (uploadError) throw uploadError
				
				return filePath
			} catch (error) {
				console.error('Error uploading avatar:', error)
				return null
			}
		}

		// Add new experience entry
		function addExperience() {
			profileForm.experience.push({
				title: '',
				company: '',
				start_date: '',
				end_date: '',
				description: '',
				tags: []
			})
			experienceTagsInputs.value.push('')
		}

		// Remove experience entry
		function removeExperience(index) {
			profileForm.experience.splice(index, 1)
			experienceTagsInputs.value.splice(index, 1)
		}

		// Save profile data
		async function saveProfile() {
			try {
				saving.value = true
				updateError.value = ''
				updateSuccess.value = false
				
				// Process skills from comma-separated string
				profileForm.skills = skillsInput.value
					.split(',')
					.map(skill => skill.trim())
					.filter(skill => skill)
				
				// Process experience tags
				profileForm.experience.forEach((exp, index) => {
					exp.tags = experienceTagsInputs.value[index]
						.split(',')
						.map(tag => tag.trim())
						.filter(tag => tag)
				})
				
				// Upload avatar if changed
				let avatarPath = null
				if (avatarFile.value) {
					avatarPath = await uploadAvatar()
				}
				
				// Prepare profile data
				const profileUpdateData = {
					...profileForm
				}
				
				if (avatarPath) {
					profileUpdateData.avatar_url = avatarPath
				}
				
				// Check if profile exists
				const { data: existingProfile } = await supabase
					.from('profiles')
					.select('id')
					.eq('user_id', authStore.user.id)
					.single()
				
				let result
				if (existingProfile) {
					// Update existing profile
					result = await supabase
						.from('profiles')
						.update(profileUpdateData)
						.eq('user_id', authStore.user.id)
				} else {
					// Insert new profile
					result = await supabase
						.from('profiles')
						.insert([{
							user_id: authStore.user.id,
							...profileUpdateData
						}])
				}
				
				if (result.error) throw result.error
				
				// Refresh profile data
				await loadProfile()
				updateSuccess.value = true
				
				// Switch to info tab after saving
				activeTab.value = 'info'
			} catch (error) {
				console.error('Error saving profile:', error)
				updateError.value = error.message || 'Failed to save profile'
			} finally {
				saving.value = false
			}
		}

		function getStatusLabel(status) {
			const statusMap = {
				looking: 'Actively Looking for Jobs',
				open: 'Open to Opportunities',
				hiring: 'Hiring',
				freelancing: 'Looking for Freelance Work',
				consulting: 'Available for Consulting',
				not_looking: 'Not Looking'
			}
			return statusMap[status] || 'Unknown Status'
		}

		async function handleLogout() {
			await authStore.logout()
			router.push('/login')
		}

		onMounted(() => {
			loadProfile()
		})

		return {
			user: authStore.user,
			loading,
			saving,
			activeTab,
			profileData,
			profileForm,
			memberSince,
			avatarPreview,
			skillsInput,
			experienceTagsInputs,
			updateError,
			updateSuccess,
			handleAvatarChange,
			addExperience,
			removeExperience,
			saveProfile,
			getStatusLabel,
			handleLogout
		}
	}
}
</script>

<style scoped>
.profile {
	max-width: 800px;
	margin: 40px auto;
	padding: 20px;
}

h1, h2, h3, h4 {
	color: #2c3e50;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
}

.loading {
	text-align: center;
	padding: 20px;
	font-style: italic;
	color: #666;
}

.profile-tabs {
	display: flex;
	justify-content: center;
	margin-bottom: 30px;
	border-bottom: 1px solid #eee;
}

.profile-tabs button {
	background: none;
	border: none;
	padding: 10px 20px;
	margin: 0 5px;
	font-size: 16px;
	cursor: pointer;
	color: #666;
	border-bottom: 3px solid transparent;
}

.profile-tabs button.active {
	color: #42b983;
	border-bottom: 3px solid #42b983;
}

/* Profile Info Styles */
.profile-info {
	text-align: left;
}

.profile-header {
	display: flex;
	margin-bottom: 30px;
}

.profile-avatar {
	width: 150px;
	height: 150px;
	margin-right: 30px;
}

.profile-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
	border: 3px solid #eee;
}

.profile-headline {
	flex: 1;
}

.profile-headline h2 {
	margin-top: 0;
	margin-bottom: 10px;
}

.headline {
	font-size: 18px;
	color: #666;
	margin-bottom: 15px;
}

.status-badge {
	display: inline-block;
	padding: 5px 10px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: bold;
}

.status-badge.looking {
	background-color: #28a745;
	color: white;
}

.status-badge.open {
	background-color: #17a2b8;
	color: white;
}

.status-badge.hiring {
	background-color: #dc3545;
	color: white;
}

.status-badge.freelancing {
	background-color: #fd7e14;
	color: white;
}

.status-badge.consulting {
	background-color: #6f42c1;
	color: white;
}

.status-badge.not_looking {
	background-color: #6c757d;
	color: white;
}

.profile-section {
	margin-bottom: 30px;
	padding: 20px;
	background-color: #f8f9fa;
	border-radius: 8px;
}

.profile-section h3 {
	margin-top: 0;
	margin-bottom: 15px;
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px;
}

.experience-item {
	margin-bottom: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid #eee;
}

.experience-item:last-child {
	border-bottom: none;
	margin-bottom: 0;
	padding-bottom: 0;
}

.experience-item h4 {
	margin-top: 0;
	margin-bottom: 5px;
}

.experience-date {
	color: #666;
	font-style: italic;
	margin-bottom: 10px;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
}

.tag {
	background-color: #e9ecef;
	color: #495057;
	padding: 5px 10px;
	border-radius: 20px;
	font-size: 14px;
	margin-right: 8px;
	margin-bottom: 8px;
}

/* Profile Edit Styles */
.profile-edit {
	text-align: left;
}

.form-section {
	margin-bottom: 30px;
	padding: 20px;
	background-color: #f8f9fa;
	border-radius: 8px;
}

.form-section h3 {
	margin-top: 0;
	margin-bottom: 20px;
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px;
}

.form-group {
	margin-bottom: 20px;
}

.form-row {
	display: flex;
	gap: 20px;
}

.form-group.half {
	flex: 1;
}

label {
	display: block;
	font-weight: bold;
	margin-bottom: 8px;
	color: #476582;
}

input, textarea, select {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 16px;
	font-family: inherit;
}

textarea {
	resize: vertical;
}

.avatar-upload {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar-upload img {
	width: 150px;
	height: 150px;
	object-fit: cover;
	border-radius: 50%;
	margin-bottom: 15px;
	border: 3px solid #eee;
}

.experience-form {
	margin-bottom: 30px;
	padding: 20px;
	background-color: #fff;
	border-radius: 8px;
	border: 1px solid #ddd;
}

.add-button, .remove-button {
	background-color: #6c757d;
	color: white;
	padding: 8px 16px;
	border: none;
	border-radius: 4px;
	font-size: 14px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.add-button {
	background-color: #28a745;
}

.add-button:hover {
	background-color: #218838;
}

.remove-button {
	background-color: #dc3545;
}

.remove-button:hover {
	background-color: #c82333;
}

.form-actions {
	text-align: center;
	margin-top: 30px;
}

.form-actions button {
	background-color: #42b983;
	color: white;
	padding: 12px 24px;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.form-actions button:hover {
	background-color: #3aa876;
}

.form-actions button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.error-message {
	color: #dc3545;
	background-color: #dc35451a;
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 20px;
	text-align: center;
}

.success-message {
	color: #28a745;
	background-color: #28a7451a;
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 20px;
	text-align: center;
}

.actions {
	text-align: center;
	margin-top: 40px;
}

.logout-button {
	background-color: #dc3545;
	color: white;
	padding: 12px 24px;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.logout-button:hover {
	background-color: #c82333;
}

.logout-button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style> 