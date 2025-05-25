<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/admin/drinks" class="text-gray-500 hover:text-gray-700">
              <i class="pi pi-arrow-left mr-2"></i>
              Retour aux boissons
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Catégories de boissons</h1>
        <Button 
          label="Nouvelle catégorie" 
          icon="pi pi-plus" 
          severity="success"
          @click="showCreateDialog"
        />
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner />
      </div>

      <!-- Error state -->
      <Message v-if="error.categories" severity="error" class="mb-4">
        {{ error.categories }}
      </Message>

      <!-- Categories list -->
      <div v-if="!loading && !error.categories" class="bg-white shadow rounded-lg overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="category in categories" :key="category.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.description }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-pencil" 
                  severity="secondary"
                  @click="showEditDialog(category)"
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  @click="confirmDelete(category)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog 
      v-model:visible="categoryDialog.visible" 
      :header="categoryDialog.isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'"
      :modal="true"
      class="p-fluid"
    >
      <div class="space-y-4">
        <div class="field">
          <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            id="name"
            v-model="categoryDialog.data.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          label="Annuler" 
          severity="secondary" 
          @click="categoryDialog.visible = false" 
        />
        <Button 
          :label="categoryDialog.isEdit ? 'Enregistrer' : 'Créer'"
          @click="saveCategory"
          :loading="categoryDialog.loading"
        />
      </template>
    </Dialog>

    <!-- Delete confirmation dialog -->
    <Dialog 
      v-model:visible="deleteDialog.visible" 
      header="Confirmer la suppression" 
      :modal="true"
    >
      <p class="mb-4">
        Êtes-vous sûr de vouloir supprimer la catégorie "{{ deleteDialog.category?.name }}" ?
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
          @click="deleteCategory"
          :loading="deleteDialog.loading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDrinks, type DrinkCategory } from '../../../../composables/drinks/drinks'

const { categories, fetchDrinkCategories, addDrinkCategory, deleteDrinkCategory, loading, error } = useDrinks()
const authStore = useAuthStore()

const categoryDialog = ref({
  visible: false,
  isEdit: false,
  loading: false,
  data: {
    documentId: '',
    name: '',
  }
})

const deleteDialog = ref({
  visible: false,
  category: null as DrinkCategory | null,
  loading: false
})

onMounted(async () => {
  await fetchDrinkCategories()
})

const showCreateDialog = () => {
  categoryDialog.value = {
    visible: true,
    isEdit: false,
    loading: false,
    data: {
      documentId: '',
      name: '',
    }
  }
}

const showEditDialog = (category: DrinkCategory) => {
  categoryDialog.value = {
    visible: true,
    isEdit: true,
    loading: false,
    data: {
      documentId: category.documentId,
      name: category.name,
    }
  }
}

const saveCategory = async () => {
  categoryDialog.value.loading = true
  const config = useRuntimeConfig()

  try {
    const url = categoryDialog.value.isEdit
      ? `${config.public.strapiUrl}/api/drink-categories/${categoryDialog.value.data.documentId}`
      : `${config.public.strapiUrl}/api/drink-categories`

    let newDrinkCategory: any = {
      data: {
        name: categoryDialog.value.data.name,
      }
    }

    await addDrinkCategory(newDrinkCategory);

    categoryDialog.value.visible = false
  } catch (e) {
    console.error('Error saving category:', e)
  } finally {
    categoryDialog.value.loading = false
  }
}

const confirmDelete = (category: DrinkCategory) => {
  deleteDialog.value = {
    visible: true,
    category: category,
    loading: false
  }
}

const deleteCategory = async () => {
  if (!deleteDialog.value.category?.documentId) return

  deleteDialog.value.loading = true

  try {
    await deleteDrinkCategory(deleteDialog.value.category.documentId);

    deleteDialog.value.visible = false
  } catch (e) {
    console.error('Error deleting category:', e)
  } finally {
    deleteDialog.value.loading = false
  }
}

// Add route middleware
definePageMeta({
  middleware: ['auth']
})
</script>