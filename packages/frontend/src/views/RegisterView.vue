<template>
	<div class="register">
		<h1>Register</h1>
		<form @submit.prevent="handleSubmit" class="register-form">
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
			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					v-model="confirmPassword"
					required
					placeholder="Confirm your password"
				/>
			</div>
			<button type="submit" :disabled="loading">
				{{ loading ? 'Registering...' : 'Register' }}
			</button>
		</form>
		<p class="login-link">
			Already have an account? <router-link to="/login">Login</router-link>
		</p>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
	name: 'RegisterView',
	setup() {
		const router = useRouter()
		const authStore = useAuthStore()

		const email = ref('')
		const password = ref('')
		const confirmPassword = ref('')
		const error = ref('')
		const loading = ref(false)

		async function handleSubmit() {
			try {
				loading.value = true
				error.value = ''

				if (password.value !== confirmPassword.value) {
					error.value = 'Passwords do not match'
					return
				}

				const { error: registerError } = await authStore.register(
					email.value,
					password.value
				)

				if (registerError) {
					error.value = registerError.message
					return
				}

				router.push('/login')
			} catch (err) {
				error.value = 'An error occurred during registration'
				console.error('Registration error:', err)
			} finally {
				loading.value = false
			}
		}

		return {
			email,
			password,
			confirmPassword,
			error,
			loading,
			handleSubmit
		}
	}
}
</script>

<style scoped>
.register {
	max-width: 400px;
	margin: 40px auto;
	padding: 20px;
}

h1 {
	text-align: center;
	margin-bottom: 30px;
}

.register-form {
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

.login-link {
	text-align: center;
	margin-top: 20px;
}

.login-link a {
	color: #476582;
	text-decoration: none;
}

.login-link a:hover {
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