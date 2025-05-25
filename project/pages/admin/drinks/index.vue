<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700">
              <i class="pi pi-arrow-left mr-2"></i>
              Retour
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestion des boissons</h1>
        <div class="space-x-4">
          <Button 
            label="Gérer les catégories" 
            icon="pi pi-list" 
            severity="secondary"
            @click="navigateTo('/admin/drinks/categories')"
          />
          <Button 
            label="Nouvelle boisson" 
            icon="pi pi-plus" 
            severity="success"
            @click="navigateTo('/admin/drinks/new')"
          />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner />
      </div>

      <!-- Error state -->
      <Message v-if="error.drinks" severity="error" class="mb-4">
        {{ error.drinks }}
      </Message>

      <!-- Drinks list -->
      <div v-if="!loading && !error.drinks" class="bg-white shadow rounded-lg overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="drink in drinks" :key="drink.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-12 w-12">
                  <img 
                    v-if="drink.image" 
                    :src="getImageUrl(drink.image.url)"
                    :alt="drink.name"
                    class="h-12 w-12 rounded-lg object-cover"
                  >
                  <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <i class="pi pi-image text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ drink.name }}</h3>
                  <span class="text-md text-primary">{{ formatPrice(drink.price) }}</span>
                  <p class="text-sm text-gray-500">{{ drink.drink_category.name }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-pencil" 
                  severity="secondary"
                  @click="navigateTo(`/admin/drinks/${drink.id}`)"
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  @click="confirmDelete(drink)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Delete confirmation dialog -->
    <Dialog 
      v-model:visible="deleteDialog.visible" 
      header="Confirmer la suppression" 
      :modal="true"
    >
      <p class="mb-4">
        Êtes-vous sûr de vouloir supprimer la boisson "{{ deleteDialog.drink?.name }}" ?
        Cette action est irréversible.
      </p>
      <template #footer>
        <Button 
          label="Annuler" 
          severity="secondary" 
          @click="deleteDialog.visible = false" 
        />
        <Button 
          label="Supprimer" 
          severity="danger" 
          @click="deleteDrinkAsync"
          :loading="deleteDialog.loading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useDrinks, type DrinkDataType } from '../../../composables/drinks/drinks'

  const { drinks, fetchDrinks, deleteDrink, loading, error } = useDrinks()

  const deleteDialog = ref({
    visible: false,
    drink: null as DrinkDataType | null,
    loading: false
  })

  onMounted(async () => {
    await fetchDrinks()
  })

  const getImageUrl = (url: string) => {
    if (!url) return ''
    const config = useRuntimeConfig()
    return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
  }

  const confirmDelete = (drink: DrinkDataType) => {
    deleteDialog.value = {
      visible: true,
      drink: drink,
      loading: false
    }
  }

  const deleteDrinkAsync = async () => {
    if (!deleteDialog.value.drink?.documentId) return

    deleteDialog.value.loading = true

    const imageId = deleteDialog.value.drink?.image.id;

    try {
      await deleteDrink(deleteDialog.value.drink.documentId, imageId);

      deleteDialog.value.visible = false
    } catch (e) {
      console.error('Error deleting drink:', e)
    } finally {
      deleteDialog.value.loading = false
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
  }

  // Add route middleware
  definePageMeta({
    middleware: ['auth']
  })
</script>