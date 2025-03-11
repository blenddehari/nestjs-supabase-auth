<template>
	<div class="home">
		<h1>Welcome to Supabase Auth Demo</h1>
		<nav>
			<router-link to="/login">Login</router-link> |
			<router-link to="/register">Register</router-link>
		</nav>
	</div>
</template>

<script>
export default {
	name: 'HomeView'
}
</script>

<style scoped>
.home {
	padding: 2rem;
	text-align: center;
}

nav {
	margin-top: 1rem;
}

nav a {
	margin: 0 0.5rem;
	color: #2c3e50;
	text-decoration: none;
}

nav a:hover {
	color: #42b983;
}
</style> 