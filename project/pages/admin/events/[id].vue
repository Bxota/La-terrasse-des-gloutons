<template>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm mb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <NuxtLink to="/admin/events" class="text-gray-500 hover:text-gray-700">
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
            {{ route.params.id === 'new' ? "Nouvel événement" : "Modifier l'événement" }}
          </h1>
  
          <form @submit.prevent="saveEvent" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Titre</label>
              <input
                id="name"
                v-model="eventData.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
  
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="eventData.description"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              ></textarea>
            </div>
  
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700">Date et heure</label>
              <input
                id="date"
                v-model="eventData.date"
                type="datetime-local"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
                @click="navigateTo('/admin/events')"
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
  import { useEvents } from '../../../composables/events/events'

  const route = useRoute()
  const { events, fetchEvents } = useEvents()
    
  const loading = ref(false)
  const error = ref<string | null>(null)
  const eventData = ref({
    name: '',
    description: '',
    date: ''
  })
    
  onMounted(async () => {
    if (route.params.id !== 'new') {
      await fetchEvents()
      const event = events.value.find(e => e.id === parseInt(route.params.id as string))
      if (event) {
        eventData.value = {
          name: event.name,
          description: event.description,
          date: new Date(event.date).toISOString().slice(0, 16)
        }
      }
    }
  })
    
  const formatDate = (date: string | Date) => {
    if (!date) return new Date().toISOString()
    if (typeof date === "string" && date.length === 16) {
      date += ":00.000Z";
    }
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString()
  }
    
  const saveEvent = async () => {
    loading.value = true
    error.value = null
    const config = useRuntimeConfig()
    
    try {
      const payload = {
        data: {
          name: eventData.value.name,
          description: eventData.value.description,
          date: formatDate(eventData.value.date)
        }
      }
      
      const url = route.params.id === 'new'
        ? `${config.public.strapiUrl}/api/events`
        : `${config.public.strapiUrl}/api/events/${route.params.id}`

      const response = await fetch(url, {
        method: route.params.id === 'new' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 708fa5ed6bf74ab3de35622bbff08f0958d2b6fcd512c49125325911d35fed98c840bd5752420818f59a0a8d7570c74019223b54ee6bed50297b5fab1e1b7d7102eb2f0dce237ebcff2a865208b79cfe2a7853038840f43b6779a821cd2c03347beae7b13f3d0c60a1d6d0097f1f519fd730f66d6157b5ba6d54e7dc5e97b59a`
        },
        body: JSON.stringify(payload)
      })
    
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde')
    
      navigateTo('/admin/events')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }
    
  definePageMeta({
    middleware: ['auth']
  })
  </script>