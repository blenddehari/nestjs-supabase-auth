<template>
	<div class="professionals">
		<h1>Professionals Directory</h1>
		
		<div class="search-filters">
			<div class="search-bar">
				<input 
					type="text" 
					v-model="searchQuery" 
					placeholder="Search by name, skills, or company..."
					@input="handleSearch"
				/>
			</div>
			
			<div class="filters">
				<div class="filter-group">
					<label>Status</label>
					<select v-model="statusFilter" @change="handleSearch">
						<option value="">All Statuses</option>
						<option value="looking">Actively Looking for Jobs</option>
						<option value="open">Open to Opportunities</option>
						<option value="hiring">Hiring</option>
						<option value="freelancing">Looking for Freelance Work</option>
						<option value="consulting">Available for Consulting</option>
					</select>
				</div>
				
				<div class="filter-group">
					<label>Skills</label>
					<select v-model="skillFilter" @change="handleSearch">
						<option value="">All Skills</option>
						<option v-for="skill in availableSkills" :key="skill" :value="skill">
							{{ skill }}
						</option>
					</select>
				</div>
			</div>
		</div>
		
		<div v-if="loading" class="loading">Loading professionals...</div>
		
		<div v-else-if="filteredProfessionals.length === 0" class="no-results">
			No professionals found matching your criteria.
		</div>
		
		<div v-else class="professionals-grid">
			<div 
				v-for="profile in filteredProfessionals" 
				:key="profile.id" 
				class="professional-card"
				@click="viewProfile(profile)"
			>
				<div class="card-avatar">
					<img 
						:src="getAvatarUrl(profile.avatar_url)" 
						:alt="`${profile.full_name}'s avatar`"
					/>
				</div>
				
				<div class="card-content">
					<h3>{{ profile.full_name }}</h3>
					<p class="headline">{{ profile.headline }}</p>
					
					<div class="status-badge" :class="profile.status">
						{{ getStatusLabel(profile.status) }}
					</div>
					
					<div class="skills">
						<span 
							v-for="(skill, index) in profile.skills.slice(0, 3)" 
							:key="index" 
							class="skill-tag"
						>
							{{ skill }}
						</span>
						<span v-if="profile.skills.length > 3" class="more-skills">
							+{{ profile.skills.length - 3 }} more
						</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Profile Modal -->
		<div v-if="selectedProfile" class="profile-modal">
			<div class="modal-content">
				<button class="close-button" @click="selectedProfile = null">×</button>
				
				<div class="modal-header">
					<div class="modal-avatar">
						<img 
							:src="getAvatarUrl(selectedProfile.avatar_url)" 
							:alt="`${selectedProfile.full_name}'s avatar`"
						/>
					</div>
					
					<div class="modal-headline">
						<h2>{{ selectedProfile.full_name }}</h2>
						<p class="headline">{{ selectedProfile.headline }}</p>
						<div class="status-badge" :class="selectedProfile.status">
							{{ getStatusLabel(selectedProfile.status) }}
						</div>
					</div>
				</div>
				
				<div class="modal-section">
					<h3>About</h3>
					<p>{{ selectedProfile.bio || 'No bio provided.' }}</p>
				</div>
				
				<div class="modal-section">
					<h3>Skills</h3>
					<div class="skills-list">
						<span 
							v-for="(skill, index) in selectedProfile.skills" 
							:key="index" 
							class="skill-tag"
						>
							{{ skill }}
						</span>
					</div>
				</div>
				
				<div class="modal-section">
					<h3>Experience</h3>
					<div v-if="selectedProfile.experience && selectedProfile.experience.length">
						<div 
							v-for="(exp, index) in selectedProfile.experience" 
							:key="index" 
							class="experience-item"
						>
							<h4>{{ exp.title }} at {{ exp.company }}</h4>
							<p class="experience-date">
								{{ exp.start_date }} - {{ exp.end_date || 'Present' }}
							</p>
							<p>{{ exp.description }}</p>
							<div class="tags">
								<span 
									v-for="(tag, tagIndex) in exp.tags" 
									:key="tagIndex" 
									class="tag"
								>
									{{ tag }}
								</span>
							</div>
						</div>
					</div>
					<p v-else>No experience listed.</p>
				</div>
				
				<div class="modal-section">
					<h3>Contact Information</h3>
					<p v-if="selectedProfile.email">
						<strong>Email:</strong> {{ selectedProfile.email }}
					</p>
					<p v-if="selectedProfile.phone">
						<strong>Phone:</strong> {{ selectedProfile.phone }}
					</p>
					<p v-if="selectedProfile.linkedin">
						<strong>LinkedIn:</strong> 
						<a :href="selectedProfile.linkedin" target="_blank">
							{{ selectedProfile.linkedin }}
						</a>
					</p>
					<p v-if="selectedProfile.github">
						<strong>GitHub:</strong> 
						<a :href="selectedProfile.github" target="_blank">
							{{ selectedProfile.github }}
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

export default {
	name: 'ProfessionalsView',
	setup() {
		const professionals = ref([])
		const loading = ref(true)
		const searchQuery = ref('')
		const statusFilter = ref('')
		const skillFilter = ref('')
		const selectedProfile = ref(null)
		
		// Load all professionals
		async function loadProfessionals() {
			try {
				loading.value = true
				
				const { data, error } = await supabase
					.from('profiles')
					.select('*, users(email)')
					.order('full_name')
				
				if (error) throw error
				
				// Process data to include email from users table
				professionals.value = data.map(profile => ({
					...profile,
					email: profile.users?.email || null
				}))
			} catch (error) {
				console.error('Error loading professionals:', error)
			} finally {
				loading.value = false
			}
		}
		
		// Get all unique skills from all professionals
		const availableSkills = computed(() => {
			const skillsSet = new Set()
			
			professionals.value.forEach(profile => {
				if (profile.skills && Array.isArray(profile.skills)) {
					profile.skills.forEach(skill => skillsSet.add(skill))
				}
			})
			
			return Array.from(skillsSet).sort()
		})
		
		// Filter professionals based on search and filters
		const filteredProfessionals = computed(() => {
			return professionals.value.filter(profile => {
				// Status filter
				if (statusFilter.value && profile.status !== statusFilter.value) {
					return false
				}
				
				// Skill filter
				if (skillFilter.value && (!profile.skills || !profile.skills.includes(skillFilter.value))) {
					return false
				}
				
				// Search query
				if (searchQuery.value) {
					const query = searchQuery.value.toLowerCase()
					
					// Search in name
					if (profile.full_name && profile.full_name.toLowerCase().includes(query)) {
						return true
					}
					
					// Search in headline
					if (profile.headline && profile.headline.toLowerCase().includes(query)) {
						return true
					}
					
					// Search in skills
					if (profile.skills && Array.isArray(profile.skills)) {
						if (profile.skills.some(skill => skill.toLowerCase().includes(query))) {
							return true
						}
					}
					
					// Search in experience
					if (profile.experience && Array.isArray(profile.experience)) {
						if (profile.experience.some(exp => 
							(exp.title && exp.title.toLowerCase().includes(query)) ||
							(exp.company && exp.company.toLowerCase().includes(query)) ||
							(exp.description && exp.description.toLowerCase().includes(query))
						)) {
							return true
						}
					}
					
					return false
				}
				
				return true
			})
		})
		
		// Handle search and filter changes
		function handleSearch() {
			// Debounce could be added here if needed
		}
		
		// View a professional's profile
		function viewProfile(profile) {
			selectedProfile.value = profile
		}
		
		// Get avatar URL
		function getAvatarUrl(avatarPath) {
			if (!avatarPath) {
				return 'https://via.placeholder.com/150'
			}
			
			// If it's already a full URL, return it
			if (avatarPath.startsWith('http')) {
				return avatarPath
			}
			
			// Otherwise, construct the URL from Supabase storage
			return `${supabase.storage.from('profiles').getPublicUrl(avatarPath).data.publicUrl}`
		}
		
		// Get status label
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
		
		onMounted(() => {
			loadProfessionals()
		})
		
		return {
			professionals,
			loading,
			searchQuery,
			statusFilter,
			skillFilter,
			selectedProfile,
			availableSkills,
			filteredProfessionals,
			handleSearch,
			viewProfile,
			getAvatarUrl,
			getStatusLabel
		}
	}
}
</script>

<style scoped>
.professionals {
	max-width: 1200px;
	margin: 40px auto;
	padding: 20px;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
	color: #2c3e50;
}

.search-filters {
	margin-bottom: 30px;
}

.search-bar {
	margin-bottom: 20px;
}

.search-bar input {
	width: 100%;
	padding: 12px 20px;
	font-size: 16px;
	border: 1px solid #ddd;
	border-radius: 4px;
}

.filters {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
}

.filter-group {
	flex: 1;
	min-width: 200px;
}

.filter-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: bold;
	color: #476582;
}

.filter-group select {
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 16px;
}

.loading, .no-results {
	text-align: center;
	padding: 40px;
	color: #666;
	font-style: italic;
}

.professionals-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
}

.professional-card {
	display: flex;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	cursor: pointer;
	transition: transform 0.2s, box-shadow 0.2s;
}

.professional-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-avatar {
	width: 100px;
	height: 100%;
}

.card-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.card-content {
	flex: 1;
	padding: 15px;
	text-align: left;
}

.card-content h3 {
	margin: 0 0 5px 0;
	color: #2c3e50;
}

.headline {
	font-size: 14px;
	color: #666;
	margin-bottom: 10px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.status-badge {
	display: inline-block;
	padding: 3px 8px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: bold;
	margin-bottom: 10px;
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

.skills {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.skill-tag {
	background-color: #e9ecef;
	color: #495057;
	padding: 3px 8px;
	border-radius: 20px;
	font-size: 12px;
}

.more-skills {
	font-size: 12px;
	color: #6c757d;
}

/* Modal Styles */
.profile-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background-color: #fff;
	border-radius: 8px;
	width: 90%;
	max-width: 800px;
	max-height: 90vh;
	overflow-y: auto;
	padding: 30px;
	position: relative;
	text-align: left;
}

.close-button {
	position: absolute;
	top: 15px;
	right: 15px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
}

.modal-header {
	display: flex;
	margin-bottom: 30px;
}

.modal-avatar {
	width: 120px;
	height: 120px;
	margin-right: 30px;
}

.modal-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
	border: 3px solid #eee;
}

.modal-headline {
	flex: 1;
}

.modal-headline h2 {
	margin-top: 0;
	margin-bottom: 10px;
	color: #2c3e50;
}

.modal-section {
	margin-bottom: 30px;
	padding: 20px;
	background-color: #f8f9fa;
	border-radius: 8px;
}

.modal-section h3 {
	margin-top: 0;
	margin-bottom: 15px;
	color: #2c3e50;
	border-bottom: 1px solid #ddd;
	padding-bottom: 10px;
}

.skills-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
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
	color: #2c3e50;
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
	gap: 5px;
}

.tag {
	background-color: #e9ecef;
	color: #495057;
	padding: 5px 10px;
	border-radius: 20px;
	font-size: 12px;
}

@media (max-width: 768px) {
	.modal-header {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.modal-avatar {
		margin-right: 0;
		margin-bottom: 20px;
	}
	
	.professionals-grid {
		grid-template-columns: 1fr;
	}
}
</style> 