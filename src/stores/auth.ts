import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  name: string
  email: string
  role_id: number
  role?: Role
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user_data') || 'null'))
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role?.name || '')

  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/login', credentials)

      const data = response.data

      token.value = data.token
      user.value = data.user

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))

      return true
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Invalid credentials or connection error.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch (err) {
      console.error('Backend failed to revoke token:', err)
    } finally {
      token.value = null
      user.value = null
      error.value = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout
  }
})
