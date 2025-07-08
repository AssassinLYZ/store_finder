// composables/useFocusTrap.ts
import { onMounted, onUnmounted } from 'vue';

export function useFocusTrap(containerRef: Ref<HTMLElement | undefined>) {
  let focusableElements: HTMLElement[] = [];
  let firstFocusableElement: HTMLElement | null = null;
  let lastFocusableElement: HTMLElement | null = null;

  const setupFocusTrap = () => {
    if (!containerRef.value) return;

    focusableElements = Array.from(
      containerRef.value.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    if (focusableElements.length > 0) {
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];
      firstFocusableElement.focus();
    }
  };

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (!firstFocusableElement || !lastFocusableElement) return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  };

  onMounted(() => {
    setupFocusTrap();
    containerRef.value?.addEventListener('keydown', handleTabKey);
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener('keydown', handleTabKey);
  });

  return { setupFocusTrap };
}