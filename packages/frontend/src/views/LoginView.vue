<template>
	<div class="login">
		<h1>Login</h1>
		<form @submit.prevent="handleSubmit" class="login-form">
			<div v-if="error" class="error-message">
				{{ error }}
			</div>
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					v-model="email"
					required
					placeholder="Enter your email"
				/>
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					v-model="password"
					required
					placeholder="Enter your password"
				/>
			</div>
			<button type="submit" :disabled="loading">
				{{ loading ? 'Logging in...' : 'Login' }}
			</button>
		</form>
		<p class="register-link">
			Don't have an account? <router-link to="/register">Register</router-link>
		</p>
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

		async function handleSubmit() {
			try {
				loading.value = true
				error.value = ''

				const { error: loginError } = await authStore.login(
					email.value,
					password.value
				)

				if (loginError) {
					error.value = loginError.message
					return
				}

				router.push('/profile')
			} catch (err) {
				error.value = 'An error occurred during login'
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
			handleSubmit
		}
	}
}
</script>

<style scoped>
.login {
	max-width: 400px;
	margin: 40px auto;
	padding: 20px;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

label {
	font-weight: bold;
}

input {
	padding: 8px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 16px;
}

button {
	background-color: #476582;
	color: white;
	padding: 12px;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s;
}

button:hover {
	background-color: #2c3e50;
}

.register-link {
	text-align: center;
	margin-top: 20px;
}

.register-link a {
	color: #476582;
	text-decoration: none;
}

.register-link a:hover {
	text-decoration: underline;
}

.error-message {
	color: #dc3545;
	background-color: #dc35451a;
	padding: 10px;
	border-radius: 4px;
	margin-bottom: 20px;
	text-align: center;
}

button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style> 