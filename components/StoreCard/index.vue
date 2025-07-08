<template>
  <div class="store-card" role="button" tabIndex="0" @click="handleClick" @keydown="handleKeydown">
    <div>
      <h3 class="store-card__name">{{ store.name }}</h3>
      <p v-if="store?.location?.address" class="store-card__address">
        {{ store.location.address.street }}
        {{ store.location.address.houseNumber }},
        {{ store.location.address.city }}
      </p>

      <div v-if="store?.openingHours" class="hours">
        <div v-if="openingStatus.isOpen" class="store-card__status">
          <p class="open tag">{{ $t('store.nowOpen') }}</p>
          <p>{{ $t('store.until') }} {{ openingStatus.to }}</p>
        </div>
        <div v-else class="store-card__status">
          <p class="closed tag">{{ $t('store.closed') }}</p>
          <p>{{ $t('store.nextOpen') }} {{ openingStatus.tomorrowOpenTime }}</p>
        </div>
      </div>
    </div>
    <a
      v-if="store?.websiteURL"
      :href="store.websiteURL"
      target="_blank"
      class="website-link"
      @click.stop
    >
      &gt;
    </a>
  </div>
</template>

<script setup lang="ts">
  import { getOpeningStatus } from '@/utils/getOpeningStatus';
  import type { Store } from '@/types/store';
  import { computed } from 'vue';

  const props = defineProps<{ store: Store }>();

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  const openingStatus = computed(() => getOpeningStatus(props.store.openingHours));

  function handleClick() {
    emit('click');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLElement && e.target.closest('.website-link')) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }
</script>

<style scoped>
  .store-card {
    display: flex;
    align-items: start;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-gray-300);
    padding: 1rem 0rem;
    cursor: pointer;
    .store-card__name {
      font-size: 1.2rem;
      font-weight: 900;
    }
    .store-card__address {
      margin: 0.5rem 0rem;
    }
    .store-card__status {
      display: flex;
      font-size: 0.9rem;
      .tag {
        width: fit-content;
        padding: 0.1rem 0.2rem;
        border-radius: 0.3rem;
        color: var(--color-white);
        margin-right: 1rem;
      }
      .open {
        background-color: var(--color-success);
      }
      .closed {
        background-color: var(--color-error);
      }
    }
  }

  .website-link {
    color: var(--color-dark);
    display: inline-block;
    margin-top: 15px;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    &:hover {
      color: var(--color-gray-600);
    }
  }
</style>
