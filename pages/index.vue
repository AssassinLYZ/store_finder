<script setup lang="ts">
  import { useStoreStore } from '@/stores/store';
  import type { Store } from '@/types/store';

  useHead({
    title: 'Jumbo search store application',
    meta: [
      { name: 'description', content: 'A list of stores' },
      { name: 'keywords', content: 'stores, jumbo' },
      { property: 'og:title', content: 'Jumbo stores' },
      {
        property: 'og:description',
        content:
          'A store finder application featuring Store search, store details, and multi-language support.',
      },
      { property: 'og:image', content: '/images/jumbo.svg' },
    ],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
  });

  const storeStore = useStoreStore();

  // Ensure data is serializable for SSR/prerender
  await useAsyncData('stores', async () => {
    try {
      const result = await storeStore.fetchAllStores();
      // Ensure we return a plain object that can be serialized
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  });

  function onChangePage(newPage: number) {
    storeStore.changeCurrentPage(newPage);
  }

  const selectedStore = ref<Store | null>(null);
  const isDrawerOpen = ref(false);

  const handleCardClick = (store: Store) => {
    selectedStore.value = store;
    isDrawerOpen.value = true;
  };

  const handleDrawerClose = () => {
    selectedStore.value = null;
    isDrawerOpen.value = false;
  };

  useBodyScrollLock(isDrawerOpen);
</script>

<template>
  <div class="main-page">
    <h1 class="main-page__title">{{ $t('homepage.title') }}</h1>
    <p class="main-page__description">{{ $t('homepage.subtitle') }}</p>

    <div class="main-page__content">
      <div class="main-page__stores">
        <AutoComplete />

        <UiLoading v-model="storeStore.loading" />

        <div v-if="storeStore.error" class="error">
          {{ $t('common.error') }}: {{ storeStore.error }}
        </div>
        <div v-if="!storeStore.loading && !storeStore.error && storeStore?.stores?.length > 0">
          <p class="main-page__filter_number">
            {{
              $t('search.resultsFound', {
                count: storeStore.filteredStores.length,
              })
            }}
          </p>
          <div class="stores-grid">
            <StoreCard
              v-for="store in storeStore.pagedStores"
              :key="store.storeId"
              :store="store"
              @click="() => handleCardClick(store)"
            />
          </div>
          <UiPagination
            :current-page="storeStore.currentPage"
            :page-size="storeStore.pageSize"
            :total-items="storeStore.filteredStores.length"
            @change-page="onChangePage"
          />
        </div>
      </div>
      <div v-if="!storeStore.loading && !storeStore.error" class="main-page__city">
        <CityFilter />
      </div>
      <StoreDetailDrawer
        v-if="!!selectedStore"
        :is-open="!!selectedStore"
        :store="selectedStore"
        @close="handleDrawerClose"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .main-page {
    margin-top: 30px;
    .main-page__title {
      font-weight: bolder;
    }
    .main-page__description {
      margin-top: 5px;
      margin-bottom: var(--spacing-xl);
      color: var(--color-gray-600);
    }
    .main-page__content {
      .main-page__stores {
        width: 60%;
      }
      .main-page__city {
        width: 35%;
      }
      .main-page__filter_number {
        color: var(--color-gray-600);
        border-bottom: var(--primary-border);
        padding-bottom: var(--spacing-md);
        margin-top: var(--spacing-md);
      }
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    @media (max-width: 768px) {
      .main-page__content {
        flex-direction: column;
        .main-page__stores {
          width: 100%;
        }

        .main-page__city {
          margin-top: 4rem;
          width: 100%;
        }
      }
    }
  }
  .error {
    color: var(--color-error);
    margin-top: 4rem;
    text-align: center;
  }
  .loading {
    color: var(--color-error);
    margin-top: 4rem;
    text-align: center;
  }
</style>
