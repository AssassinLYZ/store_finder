// composables/useDebouncedWatch.ts
import { watch } from 'vue';
import type { WatchSource } from 'vue';

export function useDebouncedWatch<T>(
  source: WatchSource<T>,
  cb: (value: T, oldValue: T | undefined) => void,
  delay = 300,
  options: { immediate?: boolean } = {}
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return watch(
    source,
    (value, oldValue) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(value, oldValue);
      }, delay);
    },
    options
  );
}

