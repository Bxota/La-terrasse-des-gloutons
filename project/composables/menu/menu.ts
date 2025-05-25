import { ref } from 'vue'
import { useApi } from '../useApi';

export interface MenuPlate extends StrapiDefaultCollectionObject {
    name: string;
    on_card: boolean;
    price: number;
    plate_category: PlateCategory;
    allergens: Allergens[];
    image: StrapiDefaultImageObject
}

export interface PlateCategory {
    id: number;
    name: string;
}

export interface Allergens {
    id: number;
    name: string;
}

export const useMenu = () => {
    const { fetchData } = useApi();
    const plates = ref<MenuPlate[]>([]);
    const categories = ref<PlateCategory[]>([]);
    const allergens = ref<Allergens[]>([]);
    const activeRequests = ref(0);
    const loading = computed(() => activeRequests.value > 0);
    const error = ref<{ plates?: string; categories?: string; allergens?:string }>({});

    const fetchPlates = async () => {
        activeRequests.value++;
        error.value.plates = undefined;
        try {
            plates.value = await fetchData('plates?populate=*');
        } catch (e) {
            error.value.plates = "Erreur lors du chargement des plats";
        } finally {
            activeRequests.value--;
        }
    };

    const fetchPlateCategories = async () => {
        activeRequests.value++;
        error.value.categories = undefined;
        try {
            categories.value = await fetchData('plate-categories?populate=*');
        } catch (e) {
            error.value.categories = "Erreur lors du chargement des catégories des plats";
        } finally {
            activeRequests.value--;
        }
    };

    const fetchAllergens = async () => {
        activeRequests.value++;
        error.value.allergens = undefined;
        try {
            allergens.value = await fetchData('allergens?populate=*');
        } catch (e) {
            error.value.allergens = "Erreur lors du chargement des allergènes";
        } finally {
            activeRequests.value--;
        }
    };

    return {
        plates,
        categories,
        allergens,
        fetchPlates,
        fetchPlateCategories,
        fetchAllergens,
        loading,
        error
    };
};  