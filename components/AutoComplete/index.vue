<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="search-autocomplete">
    <div class="search-input-wrapper">
      <input
        ref="searchInput"
        v-model="storeStore.searchText"
        type="text"
        :placeholder="$t('search.placeholder')"
        class="search-input"
        autocomplete="off"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="showSuggestions"
        :aria-activedescendant="
          activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined
        "
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Clear button -->
      <button
        v-if="storeStore.searchText"
        class="clear-btn"
        type="button"
        :title="$t('search.clear')"
        @click="clearSearch"
      >
        <Icon name="heroicons:x-mark" />
      </button>

      <!-- Search icon -->
      <div class="search-icon">
        <Icon name="heroicons:magnifying-glass" size="20" />
      </div>
    </div>

    <!-- Autocomplete dropdown -->
    <div v-if="showSuggestions" class="suggestions-dropdown" @mousedown.prevent>
      <div class="suggestions-header">
        <span>{{ $t('search.suggestions') }}</span>
        <span class="suggestions-count">{{ suggestions.length }}</span>
      </div>

      <ul class="suggestions-list">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          :class="[
            'suggestion-item',
            { 'suggestion-item--active': index === activeSuggestionIndex },
          ]"
          @click="selectSuggestion(suggestion)"
          @mouseenter="activeSuggestionIndex = index"
        >
          <div class="suggestion-content">
            <span
              class="suggestion-text"
              v-html="highlightMatch(storeStore.searchText, suggestion.text)"
            ></span>
            <div class="suggestion-meta">
              <span v-if="suggestion.type !== 'Store'" class="suggestion-type">
                {{ $t(`search.${suggestion.type.toLocaleLowerCase()}`) }}</span
              >
              <span v-if="suggestion.count && suggestion.type !== 'Store'" class="suggestion-count">
                {{ $t('search.storeCount', { count: suggestion.count }) }}
              </span>
              <span v-if="suggestion.count && suggestion.type === 'Store'" class="suggestion-count">
                {{ $t(`search.${suggestion.type.toLocaleLowerCase()}`) }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <!-- No results -->
      <div v-if="storeStore.searchText && suggestions.length === 0" class="no-suggestions">
        <Icon name="heroicons:magnifying-glass" size="20" />
        <span>{{ $t('search.noSuggestions') }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useStoreStore } from '../../stores/store';
  import type { Suggestion } from '../../types/store';
  import { useDebouncedWatch } from '../../composables/useDebounceWatch';
  import { getSuggestions } from '../../utils/searchHelper';
  import { highlightMatch } from '../../utils/helper';

  const suggestions = ref<Suggestion[]>([]);
  const storeStore = useStoreStore();
  const searchInput = ref<HTMLInputElement>();
  const showSuggestions = ref(false);
  const activeSuggestionIndex = ref(-1);

  useDebouncedWatch(
    () => storeStore.searchText,
    (newQuery: string) => {
      const query = newQuery.trim();
      if (query.length < 1) {
        showSuggestions.value = false;
        suggestions.value = [];
        return;
      } else {
        suggestions.value = getSuggestions(query, storeStore.stores);
      }
    },
    300,
    { immediate: true },
  );

  function handleInput() {
    if (storeStore.searchText.length > 1) {
      showSuggestions.value = true;
    }
    activeSuggestionIndex.value = -1;
  }

  function handleFocus() {
    if (suggestions.value.length > 0) showSuggestions.value = true;
  }

  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget?.classList?.contains('clear-btn')) {
      return;
    }
    showSuggestions.value = false;
    activeSuggestionIndex.value = -1;
  }

  function selectSuggestion(suggestion: Suggestion) {
    storeStore.searchText = suggestion.text;
    storeStore.select(suggestion);
    showSuggestions.value = false;
    activeSuggestionIndex.value = -1;
  }

  function clearSearch() {
    showSuggestions.value = false;
    activeSuggestionIndex.value = -1;
    storeStore.clearSearch();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showSuggestions.value || suggestions.value.length === 0) return;

    const listContainer = document.querySelector('.suggestions-list') as HTMLElement;
    const activeItem = listContainer?.children[activeSuggestionIndex.value] as HTMLElement;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeSuggestionIndex.value = Math.min(
          activeSuggestionIndex.value + 1,
          suggestions.value.length - 1,
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        activeSuggestionIndex.value = Math.max(activeSuggestionIndex.value - 1, 0);
        break;
      case 'Enter':
        event.preventDefault();
        if (activeSuggestionIndex.value >= 0) {
          selectSuggestion(suggestions.value[activeSuggestionIndex.value]);
        }
        break;
      case 'Escape':
        showSuggestions.value = false;
        activeSuggestionIndex.value = -1;
        break;
    }

    if (activeItem && listContainer && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      const containerHeight = listContainer.clientHeight;
      const itemHeight = activeItem.clientHeight;
      const itemOffset = activeItem.offsetTop - listContainer.offsetTop;

      const scrollTarget = itemOffset - containerHeight + itemHeight * 2;

      listContainer.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
    }
  }
</script>
<style lang="scss" scoped>
  .search-autocomplete {
    position: relative;
    width: 100%;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 3rem;
    font-size: 1rem;
    border: var(--primary-border);
    border-radius: 4rem;
    background-color: var(--color-white);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }

    &::placeholder {
      color: var(--color-gray-500);
    }
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 1rem;
    color: var(--color-gray-400);
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-gray-200);
    border: none;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-dark);
      color: var(--color-gray-200);
    }
  }

  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin-top: var(--spacing-sm);
    background: white;
    border: var(--primary-border);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .suggestions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    background: var(--color-gray-200);
    border-bottom: var(--primary-border);
    font-size: var(--font-size-sm);
    font-weight: 500;

    .suggestions-count {
      background: #e5e7eb;
      padding: 0.125rem 0.5rem;
      border-radius: 12px;
    }
  }

  .suggestions-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
  }

  .suggestion-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover,
    &--active {
      background: #f3f4f6;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }
  }

  .suggestion-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .suggestion-text {
    font-weight: 500;

    :global(mark) {
      background-color: transparent;
      color: var(--color-primary);
    }
  }

  .suggestion-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .suggestion-type {
    border: var(--primary-border);
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .suggestion-count {
    color: var(--color-success);
    font-weight: 500;
  }

  .no-suggestions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem 1rem;
    color: var(--color-gray-500);
    font-size: 0.875rem;
  }

  // Mobile responsive
  @media (max-width: 640px) {
    .search-input {
      padding: 0.875rem 2.5rem 0.875rem 2.5rem;
      font-size: 0.875rem;
    }

    .suggestion-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .suggestion-meta {
      align-self: flex-end;
    }
  }
</style>
