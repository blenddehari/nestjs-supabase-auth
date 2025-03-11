<template>
	<div class="profile">
		<h1>Profile</h1>
		<div v-if="loading" class="loading">Loading...</div>
		<div v-else class="profile-info">
			<div class="info-group">
				<label>Email</label>
				<p>{{ user?.email }}</p>
			</div>
			<div class="info-group">
				<label>Member Since</label>
				<p>{{ memberSince }}</p>
			</div>
		</div>
		<div class="actions">
			<button @click="handleLogout" class="logout-button" :disabled="loading">
				{{ loading ? 'Logging out...' : 'Logout' }}
			</button>
		</div>
	</div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
	name: 'ProfileView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()

		const memberSince = computed(() => {
			if (!authStore.user?.created_at) return 'N/A'
			return new Date(authStore.user.created_at).toLocaleDateString()
		})

		async function handleLogout() {
			await authStore.logout()
			router.push('/login')
		}

		return {
			user: authStore.user,
			loading: authStore.loading,
			memberSince,
			handleLogout
		}
	}
}
</script>

<style scoped>
.profile {
	max-width: 600px;
	margin: 40px auto;
	padding: 20px;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
}

.profile-info {
	background-color: #f8f9fa;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 30px;
}

.info-group {
	margin-bottom: 20px;
}

.info-group:last-child {
	margin-bottom: 0;
}

label {
	display: block;
	font-weight: bold;
	margin-bottom: 8px;
	color: #476582;
}

p {
	margin: 0;
	font-size: 16px;
}

.actions {
	text-align: center;
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

.loading {
	text-align: center;
	padding: 20px;
	font-style: italic;
	color: #666;
}
</style> 