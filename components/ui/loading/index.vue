<template>
  <div v-if="visible" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
  const visible = defineModel<boolean>({ default: false });
</script>

<style scoped>
  .loading-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-loading);
  }

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid var(--color-gray-300);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
