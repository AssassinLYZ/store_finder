<template>
  <aside class="stores-page__sidebar">
    <div class="city-selector">
      <h3 class="city-selector__title">{{ $t('store.selectCity') }}</h3>
      <div class="city-list">
        <button
          v-for="city in storeStore.popularCities"
          :key="city.name"
          :class="['city-item', { 'city-item__active': storeStore.selectedCity === city.name }]"
          @click="selectCity(city.name)"
        >
          <span class="city-item__name">{{ capitalize(city.name) }}</span>
          <span class="city-item__count">{{ city.count }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { capitalize } from '../../utils/helper';
  const storeStore = useStoreStore();
  const selectCity = (cityName: string) => {
    storeStore.filterByCity(cityName);
  };
</script>
<style scoped>
  .stores-page__sidebar {
    border: 1px solid var(--color-gray-300);
    height: fit-content;
    border-radius: var(--border-radius-xl);
    padding: 2rem;
    min-width: 250px;
  }
  .city-selector__title {
    white-space: nowrap;
    font-size: 1.5rem;
    color: var(--color-dark);
    margin-bottom: 1rem;
  }

  .city-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .city-item {
    font-family: var(--font-family-primary);
    padding: 0.5rem 0rem;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;

    &:hover {
      color: var(--color-gray-600);
    }
  }
  .city-item__active {
    text-decoration: underline;
  }
</style>
