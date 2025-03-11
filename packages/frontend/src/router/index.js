import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import HomeView from '../views/HomeView.vue'

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
			component: () => import('../views/LoginView.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue')
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			meta: { requiresAuth: true }
		}
	]
})

router.beforeEach(async (to, from, next) => {
	const { data: { session } } = await supabase.auth.getSession()
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (requiresAuth && !session) {
		next('/login')
	} else if (session && (to.path === '/login' || to.path === '/register')) {
		next('/profile')
	} else {
		next()
	}
})

export default router 