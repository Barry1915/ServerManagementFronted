import { defineStore } from 'pinia'

const DARK_KEY = 'sm_dark'
const COLLAPSE_KEY = 'sm_sidebar_collapse'

function applyDark(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

export const useAppStore = defineStore('app', {
  state: () => ({
    isDark: localStorage.getItem(DARK_KEY) === '1',
    sidebarCollapsed: localStorage.getItem(COLLAPSE_KEY) === '1',
  }),
  actions: {
    init() {
      applyDark(this.isDark)
    },
    toggleDark() {
      this.isDark = !this.isDark
      localStorage.setItem(DARK_KEY, this.isDark ? '1' : '0')
      applyDark(this.isDark)
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem(COLLAPSE_KEY, this.sidebarCollapsed ? '1' : '0')
    },
  },
})

