<template>
  <div class="google-map">
    <div id="store-map" ref="mapContainer" class="google-map__container"></div>
    <!-- Loading state -->
    <div v-if="loading" class="google-map__loading">
      <div class="spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="google-map__error">
      <Icon name="heroicons:exclamation-triangle" size="32" />
      <p>{{ error }}</p>
      <button class="btn btn--sm btn--outline" @click="initializeMap">
        {{ $t('common.retry') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';

  // Declare google as any to avoid TypeScript errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare const google: any;

  interface Props {
    latitude: number;
    longitude: number;
    storeName: string;
    address: string;
    zoom?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    zoom: 15,
  });

  const config = useRuntimeConfig();
  // Refs
  const mapContainer = ref<HTMLElement>();
  const loading = ref(true);
  const error = ref<string | null>(null);

  // State
  let map: google.maps.Map | null = null;
  let marker: google.maps.Marker | null = null;
  let infoWindow: google.maps.InfoWindow | null = null;

  // Global loader to avoid multiple instances
  let globalLoader: Loader | null = null;

  // Methods
  const initializeMap = async () => {
    if (!mapContainer.value) {
      error.value = 'Map container not found';
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      // Use global loader or create new one
      if (!globalLoader) {
        globalLoader = new Loader({
          apiKey: config.public.googleMapsApiKey, // Use the  API key from .env
          version: 'weekly',
          libraries: ['marker'],
        });
      }

      await globalLoader.load();

      // Create map (without mapId for now to avoid issues)
      map = new google.maps.Map(mapContainer.value, {
        center: { lat: props.latitude, lng: props.longitude },
        zoom: props.zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: 'store-map',
      });

      // Create traditional marker (will show deprecation warning but works)
      marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: props.latitude, lng: props.longitude },
        map: map,
        title: props.storeName,
      });

      // Create info window
      infoWindow = new google.maps.InfoWindow({
        maxWidth: 250,
        content: `
        <div style="padding: 8px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${props.storeName}</h3>
          <p style="margin: 0; font-size: 14px; color: #525252; line-height: 1.4;">${props.address}</p>
        </div>
      `,
      });

      if (marker && infoWindow && map) {
        // Add click listener to marker
        marker?.addListener('click', () => {
          if (infoWindow && map) {
            infoWindow.open(map, marker!);
          }
        });
        infoWindow.open(map, marker);
      }

      // Open info window by default
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
      error.value = err instanceof Error ? err.message : 'Failed to load map';
    } finally {
      loading.value = false;
    }
  };

  // Lifecycle
  onMounted(() => {
    initializeMap();
  });

  onUnmounted(() => {
    // Cleanup
    if (marker) {
      marker.setMap(null);
    }
    if (infoWindow) {
      infoWindow.close();
    }
    map = null;
    marker = null;
    infoWindow = null;
  });
</script>

<style lang="scss" scoped>
  .google-map {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 200px;

    &__container {
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }

    &__loading,
    &__error {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--color-background-secondary);
      color: var(--color-gray-600);
      text-align: center;
      padding: var(--spacing-lg);

      p {
        margin: var(--spacing-md) 0;
        font-size: var(--font-size-sm);
      }
    }

    &__error {
      color: var(--color-error);
    }
  }

  :deep(.gm-style-iw-ch) {
    padding: 10px !important;
    max-height: none !important;

    :deep(button) {
      position: absolute !important;
    }
  }

  :deep(.gm-style-iw-chr) {
    display: block !important;
    padding: 0 !important;
  }

  :deep(.gm-ui-hover-effect) {
    position: absolute !important;
    right: 0px;
    top: -5px;
  }
</style>
