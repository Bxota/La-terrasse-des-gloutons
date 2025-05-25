import { ref } from 'vue';
import { useApi } from '../useApi';
import type { StrapiDefaultCollectionObject } from '../defaultInterface'

// Objet en lien avec la collection 'Event' en database
export interface EventDataType extends StrapiDefaultCollectionObject {
  name: string
  description: string
  date: string
  price: number
  image?: {
    data: {
      attributes: {
        url: string
      }
    }
  }
}

export const useEvents = () => {
  const { $socket } = useNuxtApp();
  
  const { fetchData, deleteData } = useApi();
  
  const activeRequests = ref(0);
  const loading = computed(() => activeRequests.value > 0);
  const error = ref<{ events?: string }>({});
  
  const events = ref<EventDataType[]>([]);

  // Mise en place des listeners via websocket
  if ($socket) {
    $socket.on('event.afterCreate', async (eventData) => {
      await fetchEvents();
    });

    $socket.on('event.afterUpdate', async (eventData) => {
      await fetchEvents();
    });

    $socket.on('event.afterDelete', async (eventId) => {
      await fetchEvents();
    });
  }

  // Récupérer tous les éléments
  const fetchEvents = async () => {
    activeRequests.value++;
    error.value.events = undefined;
    try {
      events.value = await fetchData('events?populate=*');
    } catch (e) {
      error.value.events = "Erreur lors du chargement des évènements";
    } finally {
      activeRequests.value--;
    }
  };

  // Suppression d'un élément
  const deleteEvent = async (documentId: string) => {
    activeRequests.value++;
    error.value.events = undefined;
    try {
      await deleteData('events', documentId);
    } catch (e) {
      error.value.events = "Erreur lors de la suppression de l'évènement : " + documentId;
    } finally {
      activeRequests.value--;
    }
  };
  
  return {
    events,
    fetchEvents,
    deleteEvent,
    loading,
    error
  };
};