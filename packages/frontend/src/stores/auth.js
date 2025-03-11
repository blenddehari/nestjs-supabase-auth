import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
	const user = ref(null)
	const loading = ref(true)

	async function loadUser() {
		try {
			const { data: { user: currentUser } } = await supabase.auth.getUser()
			user.value = currentUser
		} catch (error) {
			console.error('Error loading user:', error)
		} finally {
			loading.value = false
		}
	}

	async function login(email, password) {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			})

			if (error) throw error
			user.value = data.user
			return { data, error: null }
		} catch (error) {
			console.error('Login error:', error)
			return { data: null, error }
		}
	}

	async function register(email, password) {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password
			})

			if (error) throw error
			return { data, error: null }
		} catch (error) {
			console.error('Registration error:', error)
			return { data: null, error }
		}
	}

	async function logout() {
		try {
			const { error } = await supabase.auth.signOut()
			if (error) throw error
			user.value = null
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	return {
		user,
		loading,
		loadUser,
		login,
		register,
		logout
	}
}) 