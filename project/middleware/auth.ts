export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (authStore.loading || !authStore.hydrated) {
    return // attendre que l'authentification soit terminée avant de faire la redirection
  }

  // Check authentication status if not already hydrated
  if (!authStore.hydrated) {
    await authStore.checkAuth()
  }
  
  if (!authStore.loading && !authStore.isAuthenticated && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
  
  // Redirect to admin dashboard if already authenticated and trying to access login
  if (authStore.isAuthenticated && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})