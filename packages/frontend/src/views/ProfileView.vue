<template>
	<div class="profile">
		<h1>Profile</h1>
		<div class="profile-info">
			<div class="info-group">
				<label>Email</label>
				<p>{{ email }}</p>
			</div>
			<div class="info-group">
				<label>Member Since</label>
				<p>{{ memberSince }}</p>
			</div>
		</div>
		<div class="actions">
			<button @click="handleLogout" class="logout-button">Logout</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ProfileView',
	data() {
		return {
			email: 'user@example.com', // TODO: Get from auth state
			memberSince: new Date().toLocaleDateString() // TODO: Get from auth state
		}
	},
	methods: {
		async handleLogout() {
			try {
				// TODO: Implement logout logic
				console.log('Logout attempt')
			} 
			catch (error) {
				console.error('Logout error:', error)
			}
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
</style> 