import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  documentId: String
  username: string
  email: string
  provider: string
  confirmed: boolean
  lastname: string
}

interface LoginCredentials {
  identifier: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    hydrated: false,
  }),  

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      try {
        const response = await fetch(`${config.public.strapiUrl}/api/auth/local`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error.message || 'Erreur lors de la connexion')
        }

        this.token = data.jwt
        this.user = data.user

        // Store token in localStorage
        if (import.meta.client) {
          localStorage.setItem('token', data.jwt)
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erreur lors de la connexion'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      navigateTo('/admin/login')
    },

    async checkAuth() {
      if (!this.hydrated) {
        if (import.meta.client) {
          const token = localStorage.getItem('token')
          const storedUser = localStorage.getItem('user')
            
          if (token) {
            try {
              const decoded = jwtDecode(token)
              const currentTime = Date.now() / 1000
                  
              if (decoded.exp && decoded.exp > currentTime) {
                this.token = token
                if (storedUser) {
                  this.user = JSON.parse(storedUser)
                } else {
                  await this.fetchUser()
                }
                this.hydrated = true
                return true
              } else {
                // Token expired
                this.logout()
              }
            } catch (e) {
              this.logout()
            }
          }
        }
        this.hydrated = true
      }
      return false
    },

    async fetchUser() {
      if (!this.token) return

      const config = useRuntimeConfig()
      try {
        const response = await fetch(`${config.public.strapiUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch user')
        
        const userData = await response.json()
        this.user = userData

        if (import.meta.client) {
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch (error) {
        this.logout()
      }
    }
  }
})