import { createApp } from 'vue'
import { createClient } from '@supabase/supabase-js'
import App from './App.vue'
import router from '@/utils/router'

import './assets/main.css'

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)
app.provide('supabase-client', createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY))
//   {
//     global: {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
//       },
//     },
//   },
// ))
app.use(router)
app.mount('#app')
