import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import EditProfileView from '../views/EditProfileView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView
		},
		{
			path: '/register',
			name: 'register',
			component: RegisterView
		},
		{
			path: '/profile',
			name: 'profile',
			component: ProfileView,
			meta: { requiresAuth: true }
		},
		{
			path: '/profile/edit',
			name: 'editProfile',
			component: EditProfileView,
			meta: { requiresAuth: true }
		},
		{
			path: '/professionals',
			name: 'professionals',
			component: () => import('../views/ProfessionalsView.vue'),
			meta: { requiresAuth: true }
		}
	]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()
	
	// Initialize auth store if not already done
	if (!authStore.initialized) {
		await authStore.init()
		authStore.initialized = true
	}
	
	// Check if route requires authentication
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// If not authenticated, redirect to login
		if (!authStore.isAuthenticated) {
			next({ name: 'login' })
		} else {
			next()
		}
	} else {
		// If route doesn't require auth, proceed
		next()
	}
})

export default router 