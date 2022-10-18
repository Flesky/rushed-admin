import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { supabase } from '@/composables/useSupabase'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth === true) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user)
      next()
    else
      next('/login')
  }
  else {
    next()
  }
})

export default router
