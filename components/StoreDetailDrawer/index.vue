<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div v-if="isOpen" class="store-drawer-overlay" @click="closeDrawer"></div>

    <!-- Drawer -->
    <div ref="drawerRef" :class="['store-drawer', { 'store-drawer--open': isOpen }]" tabindex="-1">
      <!-- Header -->
      <div class="store-drawer__header">
        <div class="store-drawer__title-section">
          <h2 class="store-drawer__title" @click="openStoreWebsite">
            <span>{{ store?.name || '' }}</span>
          </h2>
          <p class="store-drawer__address">
            📍 {{ store?.location?.address?.street || '' }}
            {{ store?.location?.address?.houseNumber || '' }} /
            {{ store?.location?.address?.postalCode || '' }}
            {{ store?.location?.address?.city || '' }}
          </p>
        </div>

        <button class="store-drawer__close" :title="$t('common.close')" @click="closeDrawer">
          <Icon name="heroicons:x-mark" size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="store-drawer__content">
        <!-- Map Section -->
        <div class="store-drawer__map-section">
          <h3 class="store-drawer__section-title">
            {{ $t('store.location') }}
          </h3>
          <div class="store-drawer__map">
            <GoogleMap
              v-if="store"
              :latitude="store.location.latitude"
              :longitude="store.location.longitude"
              :store-name="store.name"
              :address="`${store.location.address.street} ${store.location.address.houseNumber}, ${store.location.address.city}`"
              :zoom="16"
            />
          </div>

          <!-- Map Actions -->
          <button class="store-drawer__map-actions" @click="goDirection()">
            <Icon name="heroicons:map" size="16" />
            {{ $t('common.directions') }}
          </button>
        </div>

        <!-- Store Info Section -->
        <div class="store-drawer__info-section">
          <h3 class="store-drawer__section-title">
            {{ $t('store.information') }}
          </h3>

          <!-- Opening Hours -->
          <div v-if="store?.openingHours" class="store-drawer__hours">
            <h4 class="store-drawer__subsection-title">
              {{ $t('store.openingHours') }}
            </h4>

            <div class="opening-hours">
              <div
                v-for="(hours, day) in store.openingHours"
                :key="day"
                :class="['opening-hours__day', { 'opening-hours__day--today': isToday(day) }]"
              >
                <span class="opening-hours__day-name">{{ $t(`days.${day}`) }}</span>
                <span class="opening-hours__time">
                  {{
                    hours.opensAt && hours.closesAt
                      ? `${hours.opensAt.slice(0, 5)} - ${hours.closesAt.slice(0, 5)}`
                      : $t('store.closed')
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Facilities -->
          <div v-if="hasStoreFacilities(store)" class="store-drawer__facilities">
            <h4 class="store-drawer__subsection-title">
              {{ $t('store.facilities') }}
            </h4>
            <div class="facility-grid">
              <div v-if="store.facilities.parking === 'FREE'" class="facility-item">
                <Icon name="heroicons:truck" size="20" />
                <span>{{ $t('homepage.freeParking') }}</span>
              </div>
              <div v-if="store.facilities.wifi" class="facility-item">
                <Icon name="heroicons:wifi" size="20" />
                <span>WiFi</span>
              </div>
              <div v-if="store.facilities.pharmacy" class="facility-item">
                <Icon name="heroicons:heart" size="20" />
                <span>{{ $t('facilities.pharmacy') }}</span>
              </div>
              <div v-if="store.facilities.selfScan" class="facility-item">
                <Icon name="heroicons:device-phone-mobile" size="20" />
                <span>{{ $t('facilities.selfScan') }}</span>
              </div>
            </div>
          </div>

          <!-- Services -->
          <div v-if="hasStoreServices(store)" class="store-drawer__services">
            <h4 class="store-drawer__subsection-title">
              {{ $t('store.services') }}
            </h4>
            <div class="service-grid">
              <div v-if="store.commerce.homeDelivery?.available" class="service-item">
                <Icon name="heroicons:truck" size="20" />
                <span>{{ $t('commerce.homeDelivery') }}</span>
              </div>
              <div v-if="store.commerce.collection?.available" class="service-item">
                <Icon name="heroicons:shopping-bag" size="20" />
                <span>{{ $t('commerce.collection') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="store-drawer__actions">
          <button class="btn btn--primary btn--lg" @click="openStoreWebsite">
            <Icon name="heroicons:arrow-top-right-on-square" size="20" />
            &nbsp;
            {{ $t('homepage.visitStore') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import type { Store } from '@/types/store';
  import { ref, watch, nextTick } from 'vue';
  import { useFocusTrap } from '../../composables/useFocusTrap';
  interface Props {
    isOpen: boolean;
    store: Store;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    close: [];
  }>();

  const openStoreWebsite = () => {
    if (props.store?.websiteURL) {
      window.open(props.store.websiteURL, '_blank');
    }
  };

  const goDirection = () => {
    const address = `${props.store.location.address.street} ${props.store.location.address.houseNumber}, ${props.store.location.address.city}`;
    const mapUrl = getMapUrl(address);
    window.open(mapUrl, '_blank');
  };

  const isToday = (day: string) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return day.toLowerCase() === today;
  };

  const hasStoreFacilities = (store: Store) => {
    return (
      store?.facilities &&
      (store.facilities.parking === 'FREE' ||
        store.facilities.wifi ||
        store.facilities.pharmacy ||
        store.facilities.selfScan)
    );
  };
  const hasStoreServices = (store: Store) => {
    return (
      store?.commerce &&
      (store.commerce.homeDelivery?.available || store.commerce.collection?.available)
    );
  };

  const drawerRef = ref<HTMLElement>();
  watch(
    () => props.store,
    async (newVal) => {
      if (newVal) {
        await nextTick();
        setupFocusTrap();
      }
    },
    { immediate: true },
  );
  const { setupFocusTrap } = useFocusTrap(drawerRef);

  const closeDrawer = () => {
    emit('close');
  };
</script>

<style lang="scss" scoped>
  .store-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal);
    backdrop-filter: blur(4px);
  }

  .store-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background-color: var(--color-white);
    z-index: var(--z-modal);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-sm);

    &--open {
      transform: translateX(0);
    }

    &__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.5rem;
      border: 2rem;
    }

    &__title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-gray-800);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;

      &:hover {
        color: var(--color-gray-600);
      }
    }

    &__address {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-gray-600);
      line-height: 1.5;
    }

    &__close {
      width: 40px;
      height: 40px;
      background: var(--color-white);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        color: var(--color-dark);
      }
    }

    &__content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    &__section-title {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    &__subsection-title {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-gray-600);
    }

    &__map {
      height: 300px; // Set explicit height for the map
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    &__map-actions {
      display: flex;
      gap: 0.75rem;
      bor a {
        color: var(--color-dark);
      }
    }

    &__actions {
      padding-top: 1rem;
      border-top: 1px solid var(--color-gray-300);
    }
  }

  .opening-hours {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;

    &__day {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      &--today {
        span {
          color: var(--color-success);
        }
      }
    }
  }

  .facility-grid,
  .service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  .facility-grid {
    margin-bottom: 2rem;
  }

  .facility-item,
  .service-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: var(--primary-border);
    border-radius: 8px;
    font-size: 0.875rem;
  }

  // Mobile responsive
  @media (max-width: 640px) {
    .store-drawer {
      max-width: 100%;

      &__content {
        padding: 1rem;
      }

      &__header {
        padding: 1rem;
      }
    }

    .facility-grid,
    .service-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
