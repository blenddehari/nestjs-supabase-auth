import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
	const user = ref(null)
	const session = ref(null)
	const loading = ref(false)
	const error = ref(null)
	const initialized = ref(false)

	const isAuthenticated = computed(() => !!user.value)

	// Initialize the store with the current session
	async function init() {
		loading.value = true
		
		try {
			const { data } = await supabase.auth.getSession()
			if (data?.session) {
				session.value = data.session
				user.value = data.session.user
			}
			initialized.value = true
		} catch (err) {
			error.value = err.message
			console.error('Error initializing auth store:', err)
		} finally {
			loading.value = false
		}
	}

	// Login with email and password
	async function login(email, password) {
		loading.value = true
		error.value = null
		
		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			})
			
			if (authError) throw authError
			
			session.value = data.session
			user.value = data.user
			
			return { success: true }
		} catch (err) {
			error.value = err.message
			console.error('Login error:', err)
			return { success: false, error: err.message }
		} finally {
			loading.value = false
		}
	}

	// Register with email and password
	async function register(email, password) {
		loading.value = true
		error.value = null
		
		try {
			const { data, error: authError } = await supabase.auth.signUp({
				email,
				password
			})
			
			if (authError) throw authError
			
			session.value = data.session
			user.value = data.user
			
			return { success: true }
		} catch (err) {
			error.value = err.message
			console.error('Registration error:', err)
			return { success: false, error: err.message }
		} finally {
			loading.value = false
		}
	}

	// Logout
	async function logout() {
		loading.value = true
		error.value = null
		
		try {
			await supabase.auth.signOut()
			session.value = null
			user.value = null
			
			return { success: true }
		} catch (err) {
			error.value = err.message
			console.error('Logout error:', err)
			return { success: false, error: err.message }
		} finally {
			loading.value = false
		}
	}

	// Reset password
	async function resetPassword(email) {
		loading.value = true
		error.value = null
		
		try {
			const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`
			})
			
			if (authError) throw authError
			
			return { success: true }
		} catch (err) {
			error.value = err.message
			console.error('Password reset error:', err)
			return { success: false, error: err.message }
		} finally {
			loading.value = false
		}
	}

	return {
		user,
		session,
		loading,
		error,
		initialized,
		isAuthenticated,
		init,
		login,
		register,
		logout,
		resetPassword
	}
}) 