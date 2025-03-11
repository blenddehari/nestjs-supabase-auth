<template>
	<div class="register">
		<h1>Register</h1>
		<form @submit.prevent="handleSubmit" class="register-form">
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
			<button type="submit">Register</button>
		</form>
		<p class="login-link">
			Already have an account? <router-link to="/login">Login</router-link>
		</p>
	</div>
</template>

<script>
export default {
	name: 'RegisterView',
	data() {
		return {
			email: '',
			password: '',
			confirmPassword: ''
		}
	},
	methods: {
		async handleSubmit() {
			try {
				if (this.password !== this.confirmPassword) {
					console.error('Passwords do not match')
					return
				}
				// TODO: Implement registration logic
				console.log('Registration attempt with:', { email: this.email })
			} 
			catch (error) {
				console.error('Registration error:', error)
			}
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
</style> 