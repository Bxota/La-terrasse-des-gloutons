import { ref } from 'vue';
import { useApi } from '../useApi';
import type { StrapiDefaultCollectionObject, StrapiDefaultImageObject } from '../defaultInterface'

export interface DrinkDataType extends StrapiDefaultCollectionObject {
    name: string;
    description: string;
    price: number;
    drink_category: DrinkCategory;
    image: StrapiDefaultImageObject
}

export interface DrinkCategory extends StrapiDefaultCollectionObject {
    name: string;
    description: string;
}

export const useDrinks = () => {
    const { $socket } = useNuxtApp();

    const { fetchData, deleteData, addData, updateData, addMedia } = useApi();
    
    const activeRequests = ref(0);
    const loading = computed(() => activeRequests.value > 0);
    const error = ref<{ drinks?: string; categories?: string }>({});
    
    const drinks = ref<DrinkDataType[]>([]);
    const categories = ref<DrinkCategory[]>([]);

    // Mise en place des listeners via websocket
    if ($socket) {
        $socket.on('drink.afterCreate', async (eventData) => {
            await fetchDrinks();
        });
    
        $socket.on('drink.afterUpdate', async (eventData) => {
            await fetchDrinks();
        });
    
        $socket.on('drink.afterDelete', async (eventId) => {
            await fetchDrinks();
        });

        $socket.on('drink-category.afterCreate', async (eventData) => {
            await fetchDrinkCategories();
        });
    
        $socket.on('drink-category.afterUpdate', async (eventData) => {
            await fetchDrinkCategories();
        });
    
        $socket.on('drink-category.afterDelete', async (eventId) => {
            await fetchDrinkCategories();
        });
    }

    const fetchDrinks = async () => {
        activeRequests.value++;
        error.value.drinks = undefined;
        try {
            drinks.value = await fetchData('drinks?populate=*');
        } catch (e) {
            error.value.drinks = "Erreur lors du chargement des boissons";
        } finally {
            activeRequests.value--;
        }
    };

    const fetchDrinkCategories = async () => {
        activeRequests.value++;
        error.value.categories = undefined;
        try {
            categories.value = await fetchData('drink-categories');
        } catch (e) {
            error.value.categories = "Erreur lors du chargement des catégories de boissons";
        } finally {
            activeRequests.value--;
        }
    };

    const deleteDrink = async (documentId: string, imageId?: string) => {
        activeRequests.value++;
        error.value.drinks = undefined;

        try {
            await deleteData('drinks', documentId, imageId);
        } catch (e) {
            error.value.drinks = "Erreur lors de la suppression de la boisson : " + documentId;
        } finally {
            activeRequests.value--;
        }
    };

    const deleteDrinkCategory = async (documentId: string) => {
        activeRequests.value++;
        error.value.drinks = undefined;
        try {
            await deleteData('drink-categories', documentId);
        } catch (e) {
            error.value.drinks = "Erreur lors de la suppression de la catégorie des boissons : " + documentId;
        } finally {
            activeRequests.value--;
        }
    };

    const addDrink = async (data: any) => {
        activeRequests.value++;
        error.value.drinks = undefined;
        try {
            await addData('drinks', data);
        } catch (e) {
            error.value.drinks = "Erreur lors de l'ajout de la boisson";
        } finally {
            activeRequests.value--;
        }
    };

    const addDrinkCategory = async (data: any) => {
        activeRequests.value++;
        error.value.categories = undefined;
        try {
            await addData('drink-categories', data);
        } catch (e) {
            error.value.categories = "Erreur lors de l'ajout de la catégorie";
        } finally {
            activeRequests.value--;
        }
    };

    const updateDrink = async (documentId: string, data: any) => {
        activeRequests.value++;
        error.value.drinks = undefined;
        try {
            console.log(data)
            await updateData('drinks', documentId, data);
        } catch (e) {
            error.value.drinks = "Erreur lors de la mise à jour de la boisson";
        } finally {
            activeRequests.value--;
        }
    };

    return {
        drinks,
        categories,
        fetchDrinks,
        fetchDrinkCategories,
        deleteDrink,
        deleteDrinkCategory,
        addDrink,
        addDrinkCategory,
        updateDrink,
        addMedia,
        loading,
        error
    };
};