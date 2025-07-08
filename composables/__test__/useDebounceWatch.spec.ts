import { ref, nextTick } from 'vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebouncedWatch } from '../useDebounceWatch';

describe('useDebouncedWatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce the callback', async () => {
    const source = ref('w');
    const callback = vi.fn();

    useDebouncedWatch(source, callback, 300, { immediate: true });

    source.value = 'a';
    source.value = 'ab';
    source.value = 'abc';

    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    await vi.runAllTimers();
    await nextTick();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
