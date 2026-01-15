import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'

type User = {
  username: string
  displayName?: string
}

const TOKEN_KEY = 'sm_token'
const USER_KEY = 'sm_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    user: ((): User | null => {
      const raw = localStorage.getItem(USER_KEY)
      if (!raw) return null
      try {
        return JSON.parse(raw) as User
      } catch {
        return null
      }
    })(),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      const res = await loginApi({ username, password })
      this.token = res.token
      this.user = res.user
      localStorage.setItem(TOKEN_KEY, this.token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.user))
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})

