import { ref } from 'vue'

export const useApi = () => {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (config.public.strapiToken) {
    headers['Authorization'] = `Bearer ${config.public.strapiToken}`;
  }
  
  const options: RequestInit = {
    headers,
  };

  const fetchData = async (endpoint: string): Promise<any[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${config.public.strapiUrl}/api/${endpoint}`, options)
      const data = await response.json()
      return data.data
    } catch (e) {
      error.value = `Erreur lors du chargement des données de ${endpoint}`
      return []
    } finally {
      loading.value = false
    }
  }

  const deleteData = async (endpoint: string, id: string, imageId?: string): Promise<boolean> => {
    loading.value = true
    error.value = null
  
    try {
      if (imageId) {
        deleteMedia(imageId)
      }
      const response = await fetch(`${config.public.strapiUrl}/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${config.public.strapiToken}`
        }
      })
  
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de l'élément ${id} de ${endpoint}`)
      }
  
      return true
    } catch (e) {
      error.value = `Erreur lors de la suppression de ${endpoint}`
      return false
    } finally {
      loading.value = false
    }
  }

  const addData = async (endpoint: string, data: StrapiDefaultCollectionObject): Promise<any> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${config.public.strapiUrl}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.public.strapiToken}`
        },
        body: JSON.stringify(data)
      })  

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout de l'élément ${data.documentId} de ${endpoint}`)
      }

      return response
    } catch (e) {
      error.value = `Erreur lors de l'ajout de ${endpoint}`
      return null
    } finally {
      loading.value = false
    }
  }

  const addMedia = async (file: File): Promise<StrapiDefaultImageObject | null> => {
    loading.value = true;
    error.value = null;
  
    try {
      const formData = new FormData();
  
      formData.append("files", file);
  
      const response = await fetch(`${config.public.strapiUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.public.strapiToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout de l'image`);
      }
  
      const result = await response.json();
      console.log("Strapi Upload Response:", result);

      return result[0] || null;
    } catch (e) {
      error.value = `Erreur lors de l'ajout de l'image`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteMedia = async (imageId: string): Promise<any> => {
    loading.value = true;
    error.value = null;
  
    try {
      const imageDeleteResponse = await fetch(`${config.public.strapiUrl}/api/upload/files/${imageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${config.public.strapiToken}`,
        },
      });

      if (!imageDeleteResponse.ok) {
        throw new Error(`Erreur lors de la suppression de l'image ${imageId}`);
      }
    } catch (e) {
      error.value = `Erreur lors de l'ajout de l'image`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateData = async (endpoint: string, documentId: string, data: StrapiDefaultCollectionObject): Promise<any> => {
    loading.value = true
    error.value = null
    
    try {
      console.log(JSON.stringify(data))

      const response = await fetch(`${config.public.strapiUrl}/api/${endpoint}/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.public.strapiToken}`
        },
        body: JSON.stringify(data)
      })  

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'élément ${data.documentId} de ${endpoint}`)
      }

      return response
    } catch (e) {
      error.value = `Erreur lors de la mise à jour de ${endpoint}`
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchData,
    deleteData,
    addData,
    updateData,
    addMedia,
  }
}
