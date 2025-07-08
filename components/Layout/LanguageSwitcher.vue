<template>
  <div ref="switcherRef" class="language-switcher">
    <button
      class="language-switcher__button"
      :aria-label="$t('common.changeLanguage')"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <span class="language-switcher__flag">{{ currentLanguage.flag }}</span>
      <span class="language-switcher__code">{{ currentLanguage.code.toUpperCase() }}</span>
      <Icon
        name="heroicons:chevron-down"
        class="language-switcher__icon"
        :class="{ 'language-switcher__icon--open': isOpen }"
        size="16"
      />
    </button>

    <div v-if="isOpen" class="language-switcher__dropdown">
      <button
        v-for="language in availableLanguages"
        :key="language.code"
        class="language-switcher__option"
        :class="{
          'language-switcher__option--active': language.code === currentLanguage.code,
        }"
        @click="changeLanguage(language.code as Locale)"
      >
        <span class="language-switcher__flag">{{ language.flag }}</span>
        <span class="language-switcher__name">{{ language.name }}</span>
        <Icon
          v-if="language.code === currentLanguage.code"
          name="heroicons:check"
          class="language-switcher__check"
          size="16"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { LocaleObject } from '@nuxtjs/i18n';
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { Locale } from 'vue-i18n';

  interface Language {
    code: string;
    name: string;
    flag: string;
  }
  // Refs
  const switcherRef = ref<HTMLElement>();
  const isOpen = ref(false);

  // Composables
  const { locale, locales, setLocale } = useI18n();

  const localePath = useLocalePath();
  const route = useRoute();

  // Available languages with flags
  const languages: Language[] = [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  // Computed
  const currentLanguage = computed(() => {
    return languages.find((lang) => lang.code === locale.value) || languages[0];
  });

  const availableLanguages = computed(() => {
    return languages.filter((lang) =>
      (locales.value as LocaleObject[]).some((locale) => locale.code === lang.code),
    );
  });

  // Methods
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const changeLanguage = async (languageCode: Locale) => {
    if (languageCode !== locale.value) {
      await setLocale(languageCode);

      // Navigate to the same page in the new locale
      await navigateTo(localePath(route.path));
    }
    isOpen.value = false;
  };

  const closeDropdown = () => {
    isOpen.value = false;
  };

  // Click outside handler
  const handleClickOutside = (event: Event) => {
    if (switcherRef.value && !switcherRef.value.contains(event.target as Node)) {
      closeDropdown();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang="scss" scoped>
  .language-switcher {
    position: relative;

    &__button {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-white);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      font-size: var(--font-size-sm);
      font-family: var(--font-family-primary);
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--color-gray-100);
        border-color: var(--color-border-dark);
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(255, 209, 0, 0.1);
      }
    }

    &__flag {
      font-size: var(--font-size-base);
      line-height: 1;
    }

    &__code {
      font-weight: var(--font-weight-medium);
      color: var(--color-dark);
      min-width: 20px;
    }

    &__icon {
      color: var(--color-gray-500);
      transition: transform 0.2s ease;

      &--open {
        transform: rotate(180deg);
      }
    }

    &__dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: var(--spacing-xs);
      background-color: var(--color-white);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-dropdown);
      min-width: 150px;
      overflow: hidden;
    }

    &__option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      width: 100%;
      padding: var(--spacing-md);
      background: none;
      border: none;
      border-radius: var(--border-radius-xl);
      cursor: pointer;
      font-size: var(--font-size-sm);
      font-family: var(--font-family-primary);
      text-align: left;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--color-gray-100);
      }

      &--active {
        background-color: var(--color-gray-300);
        color: var(--color-dark);
      }
    }

    &__name {
      flex: 1;
      color: var(--color-dark);
    }

    &__check {
      color: var(--color-gray-700);
    }
  }
</style>
