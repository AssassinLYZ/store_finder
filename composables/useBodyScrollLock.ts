import { watch } from 'vue';

export function useBodyScrollLock(locked: Ref<boolean>) {
  watch(locked, (val) => {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
}
