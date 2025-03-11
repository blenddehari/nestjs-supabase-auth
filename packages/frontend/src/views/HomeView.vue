<template>
	<div class="home">
		<h1>Welcome to Professional Network</h1>
		<div class="hero-section">
			<div class="hero-content">
				<h2>Connect with Professionals in Your Industry</h2>
				<p>
					Join our community of professionals to showcase your experience, 
					find opportunities, and connect with others in your field.
				</p>
				<div class="cta-buttons">
					<router-link to="/register" class="cta-button primary">Join Now</router-link>
					<router-link to="/login" class="cta-button secondary">Sign In</router-link>
				</div>
			</div>
		</div>

		<div class="features-section">
			<h2>What You Can Do</h2>
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">👤</div>
					<h3>Create Your Profile</h3>
					<p>Showcase your professional experience, skills, and achievements.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">🔍</div>
					<h3>Find Opportunities</h3>
					<p>Discover job opportunities or find professionals who are hiring.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">🤝</div>
					<h3>Connect with Others</h3>
					<p>Network with professionals in your industry or related fields.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">📢</div>
					<h3>Showcase Your Status</h3>
					<p>Let others know if you're looking for work, hiring, or open to opportunities.</p>
				</div>
			</div>
		</div>

		<div class="how-it-works">
			<h2>How It Works</h2>
			<div class="steps">
				<div class="step">
					<div class="step-number">1</div>
					<div class="step-content">
						<h3>Create an Account</h3>
						<p>Sign up with your email and password to join our community.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">2</div>
					<div class="step-content">
						<h3>Complete Your Profile</h3>
						<p>Add your professional details, experience, and skills.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">3</div>
					<div class="step-content">
						<h3>Connect and Discover</h3>
						<p>Find professionals and opportunities that match your interests.</p>
					</div>
				</div>
			</div>
		</div>
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
	max-width: 1200px;
	margin: 0 auto;
}

h1 {
	font-size: 2.5rem;
	color: #2c3e50;
	margin-bottom: 2rem;
}

h2 {
	font-size: 2rem;
	color: #2c3e50;
	margin-bottom: 1.5rem;
}

.hero-section {
	background-color: #f8f9fa;
	border-radius: 10px;
	padding: 3rem 2rem;
	margin-bottom: 3rem;
}

.hero-content {
	max-width: 800px;
	margin: 0 auto;
}

.hero-content p {
	font-size: 1.2rem;
	color: #495057;
	margin-bottom: 2rem;
	line-height: 1.6;
}

.cta-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.cta-button {
	display: inline-block;
	padding: 0.8rem 1.5rem;
	border-radius: 5px;
	font-weight: bold;
	text-decoration: none;
	transition: all 0.3s ease;
}

.cta-button.primary {
	background-color: #42b983;
	color: white;
}

.cta-button.primary:hover {
	background-color: #3aa876;
}

.cta-button.secondary {
	background-color: #e9ecef;
	color: #495057;
}

.cta-button.secondary:hover {
	background-color: #dee2e6;
}

.features-section {
	margin-bottom: 3rem;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	margin-top: 2rem;
}

.feature-card {
	background-color: #fff;
	border-radius: 8px;
	padding: 2rem;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
}

.feature-card:hover {
	transform: translateY(-5px);
}

.feature-icon {
	font-size: 2.5rem;
	margin-bottom: 1rem;
}

.feature-card h3 {
	color: #2c3e50;
	margin-bottom: 1rem;
}

.feature-card p {
	color: #6c757d;
}

.how-it-works {
	margin-bottom: 3rem;
}

.steps {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	max-width: 800px;
	margin: 0 auto;
}

.step {
	display: flex;
	align-items: flex-start;
	text-align: left;
}

.step-number {
	background-color: #42b983;
	color: white;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 1.2rem;
	margin-right: 1.5rem;
	flex-shrink: 0;
}

.step-content h3 {
	color: #2c3e50;
	margin-bottom: 0.5rem;
}

.step-content p {
	color: #6c757d;
}

@media (max-width: 768px) {
	.step {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	
	.step-number {
		margin-right: 0;
		margin-bottom: 1rem;
	}
}
</style> 