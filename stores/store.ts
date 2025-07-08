import { defineStore } from 'pinia';
import type { Store, Suggestion } from '@/types/store';
import { fetchStores } from '../composables/useStores';

export const useStoreStore = defineStore('store', {
  state: () => ({
    stores: [] as Store[],
    loading: false,
    error: null as string | null,
    fetched: false,
    currentPage: 1,
    pageSize: 10,
    searchText: '',
    selectedCity: '',
    selectedSuggestion: null as Suggestion | null,
  }),

  getters: {
    filteredStores(state): Store[] {
      if (state.selectedSuggestion) {
        return state.selectedSuggestion.data;
      }
      if (state.selectedCity) {
        return state.stores.filter((item) => item.location.address.city === this.selectedCity);
      }
      return state.stores;
    },

    pagedStores(state): Store[] {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return this.filteredStores.slice(start, end);
    },

    popularCities(state): { name: string; count: number }[] {
      const cityCount = new Map<string, number>();
      state.stores.forEach((store) => {
        const city = store.location.address.city;
        cityCount.set(city, (cityCount.get(city) || 0) + 1);
      });
      return Array.from(cityCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },

    maxPage(): number {
      return Math.ceil(this.filteredStores.length / this.pageSize);
    },
  },

  actions: {
    async fetchAllStores(): Promise<Store[]> {
      if (this.fetched) return this.stores;
      this.loading = true;
      this.error = null;

      try {
        const data = await fetchStores();
        // Ensure data is serializable by creating plain objects
        this.stores = data.stores ?? [];
        this.fetched = true;
        return this.stores;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        return [];
      } finally {
        this.loading = false;
      }
    },

    changeCurrentPage(page: number) {
      if (page < 1 || page > this.maxPage) return;
      this.currentPage = page;
    },

    filterByCity(city: string) {
      this.selectedCity = city;
      this.searchText = '';
      this.selectedSuggestion = null;
      this.currentPage = 1;
    },

    clearSearch() {
      this.searchText = '';
      this.selectedSuggestion = null;
      this.currentPage = 1;
    },

    select(suggestion: Suggestion) {
      this.selectedSuggestion = { ...suggestion };
      this.selectedCity = '';
      this.currentPage = 1;
    },
  },
});
