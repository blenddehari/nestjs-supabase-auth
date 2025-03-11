<template>
	<div class="login-container">
		<h1>Login</h1>
		<form @submit.prevent="handleLogin" class="login-form">
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					type="email" 
					id="email" 
					v-model="email" 
					required 
					placeholder="Enter your email"
				>
			</div>
			
			<div class="form-group">
				<label for="password">Password</label>
				<input 
					type="password" 
					id="password" 
					v-model="password" 
					required 
					placeholder="Enter your password"
				>
			</div>
			
			<div v-if="error" class="error-message">
				{{ error }}
			</div>
			
			<button type="submit" :disabled="loading" class="login-button">
				{{ loading ? 'Logging in...' : 'Login' }}
			</button>
			
			<div class="links">
				<router-link to="/register">Don't have an account? Register</router-link>
			</div>
		</form>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
	name: 'LoginView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()
		
		const email = ref('')
		const password = ref('')
		const error = ref('')
		const loading = ref(false)
		
		async function handleLogin() {
			if (!email.value || !password.value) {
				error.value = 'Please enter both email and password'
				return
			}
			
			loading.value = true
			error.value = ''
			
			try {
				const result = await authStore.login(email.value, password.value)
				
				if (result.success) {
					router.push('/profile')
				} else {
					error.value = result.error || 'Login failed. Please try again.'
				}
			} catch (err) {
				error.value = err.message || 'An unexpected error occurred'
				console.error('Login error:', err)
			} finally {
				loading.value = false
			}
		}
		
		return {
			email,
			password,
			error,
			loading,
			handleLogin
		}
	}
}
</script>

<style scoped>
.login-container {
	max-width: 400px;
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

.login-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

label {
	font-weight: 500;
	color: #555;
}

input {
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 16px;
}

input:focus {
	outline: none;
	border-color: #4f46e5;
}

.login-button {
	margin-top: 8px;
	padding: 12px;
	background-color: #4f46e5;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.login-button:hover {
	background-color: #4338ca;
}

.login-button:disabled {
	background-color: #a5a5a5;
	cursor: not-allowed;
}

.error-message {
	color: #dc2626;
	font-size: 14px;
	text-align: center;
}

.links {
	margin-top: 16px;
	text-align: center;
}

.links a {
	color: #4f46e5;
	text-decoration: none;
}

.links a:hover {
	text-decoration: underline;
}
</style> 