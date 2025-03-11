<template>
	<div class="profile-container">
		<h1>Your Profile</h1>
		
		<div v-if="loading" class="loading">
			Loading profile...
		</div>
		
		<div v-else-if="error" class="error-message">
			{{ error }}
			<button @click="fetchProfile" class="retry-button">Retry</button>
		</div>
		
		<div v-else-if="profile" class="profile-content">
			<div class="profile-header">
				<div class="avatar-container">
					<img 
						v-if="profile.avatarUrl" 
						:src="profile.avatarUrl" 
						alt="Profile avatar" 
						class="avatar"
					>
					<div v-else class="avatar-placeholder">
						{{ getInitials(profile.fullName) }}
					</div>
				</div>
				
				<div class="profile-info">
					<h2>{{ profile.fullName || 'No name provided' }}</h2>
					<p class="headline">{{ profile.headline || 'No headline provided' }}</p>
					<p class="location" v-if="profile.location">
						<span class="icon">📍</span> {{ profile.location }}
					</p>
					<p class="status">
						Status: <span class="status-badge">{{ profile.status || 'Available' }}</span>
					</p>
				</div>
			</div>
			
			<div class="profile-section">
				<h3>About</h3>
				<p v-if="profile.bio">{{ profile.bio }}</p>
				<p v-else class="empty-section">No bio provided yet.</p>
			</div>
			
			<div class="profile-section">
				<h3>Skills</h3>
				<div v-if="profile.skills && profile.skills.length > 0" class="skills-list">
					<span v-for="(skill, index) in profile.skills" :key="index" class="skill-tag">
						{{ skill }}
					</span>
				</div>
				<p v-else class="empty-section">No skills listed yet.</p>
			</div>
			
			<div class="profile-section">
				<h3>Experience</h3>
				<div v-if="profile.experiences && profile.experiences.length > 0" class="experiences-list">
					<div v-for="(exp, index) in profile.experiences" :key="index" class="experience-item">
						<h4>{{ exp.title }} at {{ exp.company }}</h4>
						<p class="experience-period">{{ exp.startDate }} - {{ exp.endDate || 'Present' }}</p>
						<p class="experience-description">{{ exp.description }}</p>
					</div>
				</div>
				<p v-else class="empty-section">No experience listed yet.</p>
			</div>
			
			<div class="profile-section">
				<h3>Education</h3>
				<div v-if="profile.education && profile.education.length > 0" class="education-list">
					<div v-for="(edu, index) in profile.education" :key="index" class="education-item">
						<h4>{{ edu.degree }} - {{ edu.institution }}</h4>
						<p class="education-period">{{ edu.startYear }} - {{ edu.endYear || 'Present' }}</p>
						<p class="education-description">{{ edu.description }}</p>
					</div>
				</div>
				<p v-else class="empty-section">No education listed yet.</p>
			</div>
			
			<div class="profile-actions">
				<button @click="editProfile" class="edit-button">Edit Profile</button>
			</div>
		</div>
		
		<div v-else class="empty-profile">
			<p>You haven't created a profile yet.</p>
			<button @click="createProfile" class="create-button">Create Profile</button>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
	name: 'ProfileView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()
		
		const profile = ref(null)
		const loading = ref(true)
		const error = ref(null)
		
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
					throw new Error(`Failed to fetch profile: ${response.statusText}`)
				}
				
				const data = await response.json()
				profile.value = data
			} catch (err) {
				console.error('Error fetching profile:', err)
				error.value = 'Failed to load profile. Please try again.'
			} finally {
				loading.value = false
			}
		}
		
		function getInitials(name) {
			if (!name) return '?'
			
			return name
				.split(' ')
				.map(part => part.charAt(0).toUpperCase())
				.slice(0, 2)
				.join('')
		}
		
		function editProfile() {
			router.push('/profile/edit')
		}
		
		function createProfile() {
			router.push('/profile/create')
		}
		
		onMounted(() => {
			fetchProfile()
		})
		
		return {
			profile,
			loading,
			error,
			fetchProfile,
			getInitials,
			editProfile,
			createProfile
		}
	}
}
</script>

<style scoped>
.profile-container {
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

.loading, .error-message, .empty-profile {
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

.profile-header {
	display: flex;
	align-items: center;
	margin-bottom: 32px;
}

.avatar-container {
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

.profile-info {
	flex: 1;
}

.profile-info h2 {
	margin: 0 0 8px 0;
	font-size: 24px;
}

.headline {
	font-size: 18px;
	color: #666;
	margin: 0 0 8px 0;
}

.location {
	color: #666;
	margin: 0 0 8px 0;
}

.icon {
	margin-right: 4px;
}

.status-badge {
	background-color: #4f46e5;
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 14px;
}

.profile-section {
	margin-bottom: 32px;
	border-top: 1px solid #eee;
	padding-top: 24px;
}

.profile-section h3 {
	margin-top: 0;
	margin-bottom: 16px;
	color: #333;
}

.empty-section {
	color: #888;
	font-style: italic;
}

.skills-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.skill-tag {
	background-color: #f3f4f6;
	padding: 6px 12px;
	border-radius: 16px;
	font-size: 14px;
}

.experience-item, .education-item {
	margin-bottom: 24px;
}

.experience-item h4, .education-item h4 {
	margin: 0 0 8px 0;
	color: #333;
}

.experience-period, .education-period {
	color: #666;
	font-size: 14px;
	margin: 0 0 8px 0;
}

.profile-actions {
	display: flex;
	justify-content: center;
	margin-top: 32px;
}

.edit-button, .create-button {
	padding: 12px 24px;
	background-color: #4f46e5;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.edit-button:hover, .create-button:hover {
	background-color: #4338ca;
}
</style> 