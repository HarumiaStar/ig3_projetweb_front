import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@oruga-ui/theme-bulma/dist/bulma.css'

import { User } from './utils/user'
const app = createApp(App)

app.use(router)
app.use(Oruga, {
    ...bulmaConfig,
    iconPack: 'fas'
})

User.loadFromStorage()

app.mount('#app')
