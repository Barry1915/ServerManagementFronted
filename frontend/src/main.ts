import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAppStore } from './stores/app'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
useAppStore().init()
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
