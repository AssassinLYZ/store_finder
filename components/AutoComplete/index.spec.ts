/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import SearchAutocomplete from './index.vue';
import type { Store, Suggestion } from '../../types/store';
import { mockedStores } from '../../test/mockedData';

// Mock the getSuggestions function
vi.mock('../../utils/searchHelper', () => ({
  getSuggestions: vi.fn()
}));

// Mock the useDebouncedWatch composable
vi.mock('../../composables/useDebounceWatch', () => ({
  useDebouncedWatch: vi.fn()
}));

describe('SearchAutocomplete', () => {
  let mockGetSuggestions: any;
  let mockUseDebouncedWatch: any;
  let debounceCallback: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup getSuggestions mock
    const searchHelperModule = await import('../../utils/searchHelper');
    mockGetSuggestions = vi.mocked(searchHelperModule.getSuggestions);
    mockGetSuggestions.mockReturnValue([
      {
        id: 'city-amsterdam',
        text: 'Amsterdam',
        type: 'City',
        count: 1,
        data: [mockedStores[0]]
      }
    ] as Suggestion[]);

    // Setup useDebouncedWatch mock with better control
    const debounceModule = await import('../../composables/useDebounceWatch');
    mockUseDebouncedWatch = vi.mocked(debounceModule.useDebouncedWatch);
    mockUseDebouncedWatch.mockImplementation((getter: () => any, callback: (val: any) => void) => {
      debounceCallback = callback;
      // Call immediately on setup
      callback(getter());
      return { stop: vi.fn() };
    });
  });

  const createWrapper = (options = {}) => {
    return mount(SearchAutocomplete, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              store: {
                searchText: '',
                stores: mockedStores as Store[],
                select: vi.fn(),
                clearSearch: vi.fn()
              }
            }
          })
        ],
        components: {
          Icon: { template: '<svg />' }
        },
        mocks: {
          $t: (key: string) => key
        }
      },
      ...options
    });
  };

  describe('Component Rendering', () => {
    it('should render the search input', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.search-input').exists()).toBe(true);
    });

    it('should not show clear button initially', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.clear-btn').exists()).toBe(false);
    });

    it('should not show suggestions dropdown initially', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.suggestions-dropdown').exists()).toBe(false);
    });
  });

  describe('Input Functionality', () => {
    it('should have correct input attributes', () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      expect(input.attributes('type')).toBe('text');
      expect(input.attributes('autocomplete')).toBe('off');
      expect(input.attributes('aria-autocomplete')).toBe('list');
    });

    it('should update search text when input value changes', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      await input.setValue('test');
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.storeStore.searchText).toBe('test');
    });
  });

  describe('Clear Button', () => {
    it('should show clear button when search text exists', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Simulate user input
      await input.setValue('test');
      await nextTick();

      expect(wrapper.find('.clear-btn').exists()).toBe(true);
    });

    it('should call clearSearch when clear button is clicked', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      await input.setValue('test');
      await nextTick();

      await wrapper.find('.clear-btn').trigger('click');

      const vm = wrapper.vm as any;
      expect(vm.storeStore.clearSearch).toHaveBeenCalled();
    });
  });

  describe('Suggestions Display', () => {
    it('should show suggestions when input has value and is focused', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Simulate user input and focus
      await input.setValue('Ams');
      await input.trigger('focus');
      await nextTick();

      expect(wrapper.find('.suggestions-dropdown').exists()).toBe(true);
    });

    it('should display suggestion items correctly', async () => {
      const suggestions = [
        {
          id: 'city-amsterdam',
          text: 'Amsterdam',
          type: 'City',
          count: 1,
          data: [mockedStores[0]]
        },
        {
          id: 'store-test-store-1',
          text: 'Test Store 1',
          type: 'Store',
          count: 1,
          data: [mockedStores[0]]
        }
      ] as Suggestion[];

      mockGetSuggestions.mockReturnValue(suggestions);

      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback to ensure suggestions are set
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      const suggestionItems = wrapper.findAll('.suggestion-item');
      expect(suggestionItems).toHaveLength(2);
    });

    it('should show no suggestions message when no results', async () => {
      mockGetSuggestions.mockReturnValue([]);

      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      await input.setValue('nonexistent');
      await input.trigger('focus');
      await nextTick();

      expect(wrapper.find('.no-suggestions').exists()).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle ArrowDown key', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      await input.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.activeSuggestionIndex).toBe(0);
    });

    it('should handle ArrowUp key', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      // First go down
      await input.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      // Then go up
      await input.trigger('keydown', { key: 'ArrowUp' });
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.activeSuggestionIndex).toBe(0); // Should stay at 0 since it's the first item
    });

    it('should handle Enter key to select suggestion', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      // Navigate to first suggestion
      await input.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      // Select with Enter
      await input.trigger('keydown', { key: 'Enter' });
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.storeStore.select).toHaveBeenCalled();
    });

    it('should handle Escape key to close suggestions', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      await input.trigger('keydown', { key: 'Escape' });
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.showSuggestions).toBe(false);
      expect(vm.activeSuggestionIndex).toBe(-1);
    });
  });

  describe('Mouse Interaction', () => {
    it('should select suggestion when clicked', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      await wrapper.find('.suggestion-item').trigger('click');

      const vm = wrapper.vm as any;
      expect(vm.storeStore.select).toHaveBeenCalled();
    });

    it('should update active index on mouse enter', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      await wrapper.find('.suggestion-item').trigger('mouseenter');

      const vm = wrapper.vm as any;
      expect(vm.activeSuggestionIndex).toBe(0);
    });
  });

  describe('Focus and Blur', () => {
    it('should show suggestions on focus when suggestions exist', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input
      await input.setValue('test');
      await nextTick();

      await input.trigger('focus');
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.showSuggestions).toBe(true);
    });

    it('should hide suggestions on blur', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // Set up suggestions by input and focus
      await input.setValue('test');
      await input.trigger('focus');
      await nextTick();

      await input.trigger('blur');
      await nextTick();

      const vm = wrapper.vm as any;
      expect(vm.showSuggestions).toBe(false);
      expect(vm.activeSuggestionIndex).toBe(-1);
    });
  });

  describe('Debounced Search', () => {
    it('should call getSuggestions when search text changes', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      await input.setValue('test');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('test');
        await nextTick();
      }

      expect(mockGetSuggestions).toHaveBeenCalledWith('test', mockedStores);
    });

    it('should clear suggestions when search text is empty', async () => {
      const wrapper = createWrapper();
      const input = wrapper.find('.search-input');

      // First set some text
      await input.setValue('test');
      await nextTick();

      // Then clear it
      await input.setValue('');
      await nextTick();

      // Manually trigger the debounce callback
      if (debounceCallback) {
        debounceCallback('');
        await nextTick();
      }

      const vm = wrapper.vm as any;
      expect(vm.suggestions).toEqual([]);
      expect(vm.showSuggestions).toBe(false);
    });
  });
});