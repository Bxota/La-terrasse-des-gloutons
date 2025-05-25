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
        <h1 class="text-2xl font-bold text-gray-900">Gestion des événements</h1>
        <Button 
          label="Nouvel événement" 
          icon="pi pi-plus" 
          severity="success"
          @click="navigateTo('/admin/events/new')"
        />
      </div>
  
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner />
      </div>
  
      <!-- Error state -->
      <Message v-if="Object.values(error).some(err => err)" severity="error" :closable="false">
        <ul>
          <li v-for="[key, err] in Object.entries(error)" :key="key" v-if="error">{{ err }}</li>
        </ul>
      </Message>
  
      <!-- Events list -->
      <div v-if="!loading && !Object.values(error).some(err => err)" class="bg-white shadow rounded-lg overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="event in sortedEvents" :key="event.id" class="p-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-12 w-12">
                  <img 
                    v-if="event.image?.data?.attributes?.url" 
                    :src="getImageUrl(event.image.data.attributes.url)"
                    :alt="event.name"
                    class="h-12 w-12 rounded-lg object-cover"
                  />
                  <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <i class="pi pi-calendar text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ event.name }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(event.date) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Button 
                  icon="pi pi-pencil" 
                  severity="secondary"
                  @click="navigateTo(`/admin/events/${event.documentId}`)"
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  @click="confirmDelete(event)"
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
        Êtes-vous sûr de vouloir supprimer l'événement "{{ deleteDialog.event?.name }}" ?
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
          @click="deleteEventAsync"
          :loading="deleteDialog.loading"
        />
      </template>
    </Dialog>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useEvents, type EventDataType } from '../../../composables/events/events'

  const { events, fetchEvents, deleteEvent, loading, error } = useEvents()

  const deleteDialog = ref({
    visible: false,
    event: null as EventDataType | null,
    loading: false
  })

  const sortedEvents = computed(() => {
    return [...events.value].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  onMounted(async () => {
    await fetchEvents()
  })

  const confirmDelete = (event: EventDataType) => {
    deleteDialog.value = {
      visible: true,
      event: event,
      loading: false
    }
  }

  const deleteEventAsync = async () => {
    if (!deleteDialog.value.event?.documentId) return;

    deleteDialog.value.loading = true;

    try {
      await deleteEvent(deleteDialog.value.event.documentId)

      deleteDialog.value.visible = false;
    } catch (e) {
      console.error('Error deleting event:', e);
    } finally {
      deleteDialog.value.loading = false;
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return ''
    const config = useRuntimeConfig()
    return url.startsWith('http') ? url : `${config.public.strapiUrl}${url}`
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }
    
  // Add route middleware
  definePageMeta({
    middleware: ['auth']
  })
</script>