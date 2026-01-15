import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    public?: boolean
    icon?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录', public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '概览' },
        },
        {
          path: 'servers',
          name: 'servers',
          component: () => import('@/views/Servers.vue'),
          meta: { title: '服务器' },
        },
        {
          path: 'servers/new',
          name: 'server-new',
          component: () => import('@/views/ServerEdit.vue'),
          meta: { title: '新增服务器' },
        },
        {
          path: 'servers/:id',
          name: 'server-detail',
          component: () => import('@/views/ServerDetail.vue'),
          meta: { title: '服务器详情' },
        },
        {
          path: 'servers/:id/edit',
          name: 'server-edit',
          component: () => import('@/views/ServerEdit.vue'),
          meta: { title: '编辑服务器' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings.vue'),
          meta: { title: '设置' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面不存在', public: true },
    },
  ],
})

router.beforeEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Server Console'
  document.title = to.meta.title ? `${to.meta.title} - ${appName}` : appName

  if (to.meta.public) return true
  const auth = useAuthStore()
  if (auth.isAuthenticated) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router

