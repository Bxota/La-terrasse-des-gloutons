<template>
  <div v-if="authStore.hydrated" class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">Administration</h1>
            </div>
          </div>
          <div class="flex items-center" v-if="authStore.user">
            <span class="text-gray-600 mr-4">{{ authStore.user.username }}</span>
            <Button label="Déconnexion" severity="secondary" @click="authStore.logout" />
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Cartes d'administration -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-calendar mr-2"></i>
                Événements
              </div>
            </template>
            <template #content>
              <p class="mb-4">Gérer les événements du restaurant</p>
              <div class="flex justify-between">
                <Button label="Voir tous" icon="pi pi-list" @click="navigateTo('/admin/events')" />
                <Button label="Ajouter" icon="pi pi-plus" severity="success" @click="navigateTo('/admin/events/new')" />
              </div>
            </template>
          </Card>
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-glass mr-2"></i>
                Boissons
              </div>
            </template>
            <template #content>
              <p class="mb-4">Gérer les boissons et leurs catégories</p>
              <div class="flex justify-between">
                <Button label="Voir tous" icon="pi pi-list" @click="navigateTo('/admin/drinks')" />
                <Button label="Ajouter" icon="pi pi-plus" severity="success" @click="navigateTo('/admin/drinks/new')" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <!-- Affichage d'un loader pendant l'hydratation -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <p>Chargement...</p>
  </div>
</template>
  
<script setup lang="ts">
  const authStore = useAuthStore()
  
  onMounted(() => {
    authStore.checkAuth()
  })
  
  definePageMeta({
    middleware: ['auth']
  })
</script>