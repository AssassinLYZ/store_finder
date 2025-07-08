<template>
  <div class="pagination">
    <button v-if="currentPage > 1" @click="$emit('change-page', currentPage - 1)">
      {{ isMobile ? '<' : $t('pagination.previous') }}
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      class="pagination__page_button"
      :disabled="page === '...'"
      :class="{ active: page === currentPage }"
      @click="typeof page === 'number' && $emit('change-page', page)"
    >
      {{ page }}
    </button>

    <button v-if="currentPage < totalPages" @click="$emit('change-page', currentPage + 1)">
      {{ isMobile ? '>' : $t('pagination.next') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

  const props = defineProps({
    currentPage: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    totalItems: { type: Number, required: true },
  });

  defineEmits<{
    (e: 'change-page', page: number): void;
  }>();

  const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));
  // Detect if screen is mobile
  const isMobile = ref(false);
  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < 912;
  };

  onMounted(() => {
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateIsMobile);
  });

  // Dynamic pagination logic
  const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const { currentPage } = props;

    if (totalPages.value <= 7) {
      for (let i = 1; i <= totalPages.value; i++) pages.push(i);
      return pages;
    }

    if (isMobile.value) {
      const { currentPage } = props;
      const pages: (number | string)[] = [];

      pages.push(1); // always show first page

      if (currentPage <= 3) {
        // Near the beginning: show 1,2,3,...,81
        for (let i = 2; i <= 3; i++) {
          if (i < totalPages.value) pages.push(i);
        }
        if (totalPages.value > 4) pages.push('...');
      } else if (currentPage >= totalPages.value - 2) {
        // Near the end: show 1,..., totalPages-2, totalPages-1, totalPages
        if (totalPages.value > 4) pages.push('...');
        for (let i = totalPages.value - 2; i < totalPages.value; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // Middle: show 1, ..., currentPage, ..., totalPages
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      }

      if (!pages.includes(totalPages.value)) {
        pages.push(totalPages.value);
      }

      return pages;
    }

    // Desktop: full pagination logic
    pages.push(1);

    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5);
      pages.push('...');
    } else if (currentPage >= totalPages.value - 3) {
      pages.push('...');
      for (let i = totalPages.value - 4; i < totalPages.value; i++) {
        pages.push(i);
      }
    } else {
      pages.push('...');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('...');
    }

    if (!pages.includes(totalPages.value)) {
      pages.push(totalPages.value);
    }

    return pages;
  });
</script>

<style scoped>
  .pagination {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
  }

  button {
    padding: 0.6rem 1rem;
  }

  .pagination__page_button {
    border: none;
    border-radius: 0;
    background: none;
    cursor: pointer;

    &:hover {
      color: var(--color-gray-500);
      background-color: var(--color-white);
    }
  }

  .pagination__page_button.active {
    font-weight: var(--font-weight-bold);
    border-bottom: 2px solid var(--color-primary);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
