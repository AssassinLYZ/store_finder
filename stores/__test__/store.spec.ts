import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useStoreStore } from '../../stores/store';
import type { Store, Suggestion } from '../../types/store';
import { mockedStores } from '../../test/mockedData';
import { fetchStores } from '../../composables/useStores';

// Mock the fetchStores function
vi.mock('../../composables/useStores', () => ({
  fetchStores: vi.fn(),
}));

const mockStores: Store[] = mockedStores;
const mockSuggestion: Suggestion = {
  text: 'Test Suggestion',
  data: [mockedStores[0]] as Store[],
  id: '',
  type: ''
};

describe('useStoreStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const store = useStoreStore();
    expect(store.stores).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.fetched).toBe(false);
    expect(store.currentPage).toBe(1);
    expect(store.pageSize).toBe(10);
    expect(store.searchText).toBe('');
    expect(store.selectedCity).toBe('');
    expect(store.selectedSuggestion).toBeNull();
  });

  describe('fetchAllStores', () => {
    it('should fetch stores and update state', async () => {
      const mockFetchStores = vi.fn().mockResolvedValue({ stores: mockStores });
      vi.mocked(fetchStores).mockImplementation(mockFetchStores);
      const store = useStoreStore();
      await store.fetchAllStores();
      expect(mockFetchStores).toHaveBeenCalled();
      expect(store.stores).toEqual(mockStores);
      expect(store.fetched).toBe(true);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle errors', async () => {
      const mockError = new Error('Failed to fetch');
      vi.mocked(fetchStores).mockRejectedValue(mockError);
      const store = useStoreStore();
      await store.fetchAllStores();
      expect(store.error).toEqual(mockError.message);
      expect(store.loading).toBe(false);
      expect(store.stores).toEqual([]);
    });

    it('should not fetch again if already fetched', async () => {
      const mockFetchStores = vi.fn().mockResolvedValue({ stores: mockStores });
      vi.mocked(fetchStores).mockImplementation(mockFetchStores);
      const store = useStoreStore();
      store.fetched = true;
      const result = await store.fetchAllStores();
      expect(mockFetchStores).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      const store = useStoreStore();
      store.stores = mockStores;
      store.fetched = true;
    });

    describe('filteredStores', () => {
      it('should return all stores when no filters applied', () => {
        const store = useStoreStore();
        expect(store.filteredStores).toEqual(mockStores);
      });

      it('should filter by selected city', () => {
        const store = useStoreStore();
        store.selectedCity = 'New York';
        expect(store.filteredStores).toEqual([]);
      });

      it('should return suggestion data when selected', () => {
        const store = useStoreStore();
        store.selectedSuggestion = mockSuggestion;
        expect(store.filteredStores).toEqual(mockSuggestion.data);
      });
    });

    describe('pagedStores', () => {
      it('should return first page of results', () => {
        const store = useStoreStore();
        store.pageSize = 2;
        expect(store.pagedStores).toEqual([
          mockStores[0],
          mockStores[1],
        ]);
      });

      it('should handle filtered results', () => {
        const store = useStoreStore();
        store.selectedCity = 'ST. OEDENRODE';
        store.pageSize = 1;
        store.currentPage = 2;
        expect(store.pagedStores.length).toEqual(1);
      });
    });

    describe('popularCities', () => {
      it('should return cities sorted by store count', () => {
        const store = useStoreStore();
        expect(store.popularCities).toEqual([
          { name: 'ST. OEDENRODE', count: 2 },
          { name: 'NUENEN', count: 1 },
        ]);
      });
    });

    it('should calculate max page count', () => {
      const store = useStoreStore();
      store.pageSize = 2;
      expect(store.maxPage).toBe(2);
    });

  });

  describe('actions', () => {
    beforeEach(() => {
      const store = useStoreStore();
      store.stores = mockStores;
      store.fetched = true;
    });

    describe('changeCurrentPage', () => {
      it('should not change if page is less than 1', () => {
        const store = useStoreStore();
        store.changeCurrentPage(0);
        expect(store.currentPage).toBe(1);
      });
      it('should not change if page exceeds max page', () => {
        const store = useStoreStore();
        store.pageSize = 10;
        store.changeCurrentPage(100);
        expect(store.currentPage).toBe(1);
      });
    });

    describe('filterByCity', () => {
      it('should set selected city and reset other filters', () => {
        const store = useStoreStore();
        store.searchText = 'test';
        store.selectedSuggestion = mockSuggestion;
        store.currentPage = 3;
        store.filterByCity('New York');
        expect(store.selectedCity).toBe('New York');
        expect(store.searchText).toBe('');
        expect(store.selectedSuggestion).toBeNull();
        expect(store.currentPage).toBe(1);
      });
    });

    describe('clearSearch', () => {
      it('should clear search text and suggestion', () => {
        const store = useStoreStore();
        store.searchText = 'test';
        store.selectedSuggestion = mockSuggestion;
        store.currentPage = 3;
        store.clearSearch();
        expect(store.searchText).toBe('');
        expect(store.selectedSuggestion).toBeNull();
        expect(store.currentPage).toBe(1);
      });
    });

    describe('select', () => {
      it('should set suggestion and reset city filter', () => {
        const store = useStoreStore();
        store.selectedCity = 'New York';
        store.currentPage = 3;
        store.select(mockSuggestion);
        expect(store.selectedSuggestion).toEqual(mockSuggestion);
        expect(store.selectedCity).toBe('');
        expect(store.currentPage).toBe(1);
      });
    });
  });
});