<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/admin/drinks" class="text-gray-500 hover:text-gray-700">
              <i class="pi pi-arrow-left mr-2"></i>
              Retour
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ route.params.id === "new" ? "Nouvelle boisson" : "Modifier la boisson" }}
        </h1>

        <form @submit.prevent="saveDrink" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="name"
              v-model="drinkData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="drinkData.description"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              id="category"
              v-model="drinkData.drink_category"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option v-for="category in categories" :key="category.documentId" :value="category">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Prix</label>
            <input
              id="price"
              v-model="drinkData.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Image (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="mt-1 block w-full"
            />
          </div>

          <Message v-if="error" severity="error" class="w-full">
            {{ error }}
          </Message>

          <div class="flex justify-end space-x-3">
            <Button
              type="button"
              label="Annuler"
              severity="secondary"
              @click="navigateTo('/admin/drinks')"
            />
            <Button
              type="submit"
              :label="route.params.id === 'new' ? 'Créer' : 'Enregistrer'"
              :loading="loading"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDrinks, type DrinkCategory } from '../../../composables/drinks/drinks'

  const route = useRoute()
  const { drinks, categories, fetchDrinks, fetchDrinkCategories, addDrink, updateDrink, addMedia } = useDrinks()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const drinkData = ref({
    documentId: '',
    name: '',
    description: '',
    price: 0,
    drink_category: null as DrinkCategory | null,
    image: null as File | null
  })

  // Load categories and existing drink data if editing
  onMounted(async () => {
    await fetchDrinkCategories()
    
    if (route.params.id !== 'new') {
      await fetchDrinks()
      const drink = drinks.value.find(d => d.id === parseInt(route.params.id as string))
      if (drink) {
        drinkData.value = {
          ...drink,
          drink_category: drink.drink_category,
          image: null
        }
      }
    }
  })

  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      drinkData.value.image = input.files[0]
    }
  }

  const saveDrink = async () => {
    loading.value = true
    error.value = null
    const config = useRuntimeConfig()

    try {
      let imageuploaded = null;
      if (drinkData.value.image) {
        imageuploaded = await addMedia(drinkData.value.image);
      }

      const url = route.params.id === 'new'
        ? `${config.public.strapiUrl}/api/drinks`
        : `${config.public.strapiUrl}/api/drinks/${route.params.id}`

      console.log(imageuploaded?.id )

      let newDrink: any = {
        data: {
          name: drinkData.value.name,
          description: drinkData.value.description,
          price: drinkData.value.price,
          drink_category: drinkData.value.drink_category?.documentId,
          image: imageuploaded ? imageuploaded?.id : null
        }
      }

      if (route.params.id === 'new') {
        await addDrink(newDrink)
      }
      else {
        await updateDrink(drinkData.value.documentId, newDrink)
      }

      navigateTo('/admin/drinks')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  // Add route middleware
  definePageMeta({
    middleware: ['auth']
  })
</script>