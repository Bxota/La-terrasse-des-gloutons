<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Nos Boissons</h1>

    <!-- Loading et Error states -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>
    
    <Message v-if="Object.values(error).some(err => err)" severity="error" :closable="false">
      <ul>
        <li v-for="[key, err] in Object.entries(error)" :key="key" v-if="error">{{ err }}</li>
      </ul>
    </Message>

    <!-- Menu Content -->
    <div v-if="!loading && !Object.values(error).some(err => err)">
      <TabView>
        <TabPanel v-for="category in categories" :key="category.id" :header="category.name">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card v-for="item in getItemsByCategory(category.name)" 
                  :key="item.id" 
                  class="shadow-lg">
                  {{ item }}
              <template #header>
                <img v-if="item.image?.formats" 
                  :src="getImageUrl(item.image.formats.large?.url || item.image.formats.medium?.url || item.image.formats.small?.url || item.image.formats.thumbnail?.url)" 
                  :alt="item.name"
                  class="w-full h-48 object-cover">
                
                <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <i class="pi pi-image text-4xl text-gray-400"></i>
                </div>
              </template>
              <template #title>
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-semibold">{{ item.name }}</h3>
                  <span class="text-lg font-bold text-primary">{{ formatPrice(item.price) }}</span>
                </div>
              </template>
              <template #content>
                <p class="text-gray-600">{{ item.description }}</p>
              </template>
            </Card>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDrinks } from '../composables/drinks/drinks'

const { drinks, categories, fetchDrinks, fetchDrinkCategories, loading, error } = useDrinks()

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([fetchDrinks(), fetchDrinkCategories()])
})

// Helpers
const getItemsByCategory = (categoryName: string) => {
  return drinks.value.filter(item => item.drink_category.name === categoryName)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

const getImageUrl = (url: string) => {
  const config = useRuntimeConfig()
  return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
}
</script>