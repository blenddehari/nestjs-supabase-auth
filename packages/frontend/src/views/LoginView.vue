<template>
	<div class="login">
		<h1>Login</h1>
		<form @submit.prevent="handleSubmit" class="login-form">
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
			<button type="submit">Login</button>
		</form>
		<p class="register-link">
			Don't have an account? <router-link to="/register">Register</router-link>
		</p>
	</div>
</template>

<script>
export default {
	name: 'LoginView',
	data() {
		return {
			email: '',
			password: ''
		}
	},
	methods: {
		async handleSubmit() {
			try {
				// TODO: Implement login logic
				console.log('Login attempt with:', { email: this.email })
			} 
			catch (error) {
				console.error('Login error:', error)
			}
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
</style> 