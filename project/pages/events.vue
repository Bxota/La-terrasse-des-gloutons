<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Nos Événements</h1>

    <!-- Loading et Error states -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>
    
    <Message v-if="Object.values(error).some(err => err)" severity="error" :closable="false">
      <ul>
        <li v-for="[key, err] in Object.entries(error)" :key="key" v-if="error">{{ err }}</li>
      </ul>
    </Message>

    <!-- Events Content -->
    <div v-if="!loading && !Object.values(error).some(err => err)" class="space-y-12">
      <!-- Événements à venir -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Événements à venir</h2>
        <div v-if="upcomingEvents.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
          <p class="text-gray-600">Aucun événement à venir pour le moment</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="event in upcomingEvents" 
                :key="event.id" 
                class="shadow-lg">
            <template #header>
              <img v-if="event.image?.data" 
                   :src="getImageUrl(event.image.data.attributes.url)" 
                   :alt="event.name"
                   class="w-full h-48 object-cover">
              <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                <i class="pi pi-calendar text-4xl text-gray-400"></i>
              </div>
            </template>
            <template #title>
              <h3 class="text-xl font-semibold">{{ event.name }}</h3>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex items-center text-gray-600">
                  <i class="pi pi-calendar mr-2"></i>
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="pi pi-clock mr-2"></i>
                  <span>{{ formatTime(event.date) }}</span>
                </div>
                <p class="text-gray-600">{{ event.description }}</p>
                <div v-if="event.price" class="text-lg font-semibold text-primary">
                  {{ formatPrice(event.price) }}
                </div>
              </div>
            </template>
          </Card>
        </div>
      </section>

      <!-- Événements passés -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Événements passés</h2>
        <div v-if="pastEvents.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
          <p class="text-gray-600">Aucun événement passé</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="event in pastEvents" 
                :key="event.id" 
                class="shadow-lg opacity-75">
            <template #header>
              <div class="relative">
                <img v-if="event.image?.data" 
                     :src="getImageUrl(event.image.data.attributes.url)" 
                     :alt="event.name"
                     class="w-full h-48 object-cover grayscale">
                <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <i class="pi pi-calendar text-4xl text-gray-400"></i>
                </div>
                <div class="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                  Terminé
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-xl font-semibold">{{ event.name }}</h3>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex items-center text-gray-600">
                  <i class="pi pi-calendar mr-2"></i>
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <p class="text-gray-600">{{ event.description }}</p>
              </div>
            </template>
          </Card>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useEvents } from '../composables/events/events'

  const { events, fetchEvents, loading, error } = useEvents()

  const upcomingEvents = computed(() => {
    return events.value
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const pastEvents = computed(() => {
    return events.value
      .filter(event => new Date(event.date) < new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  // Fetch events on component mount
  onMounted(async () => {
    await Promise.all([fetchEvents()])
  })

  // Helpers
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price)
  }

  const getImageUrl = (url: string) => {
    if (!url) return ''
    const config = useRuntimeConfig()
    return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
  }
</script>