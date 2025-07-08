import { ref, nextTick } from 'vue';
import { describe, it, expect, beforeEach } from 'vitest';
import { useBodyScrollLock } from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('should lock body scroll when locked is true', async () => {
    const locked = ref(false);
    useBodyScrollLock(locked);

    locked.value = true;
    await nextTick();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should unlock body scroll when locked is false', async () => {
    const locked = ref(true);
    useBodyScrollLock(locked);

    locked.value = false;
    await nextTick();

    expect(document.body.style.overflow).toBe('');
  });

  it('should update style correctly when locked toggles', async () => {
    const locked = ref(false);
    useBodyScrollLock(locked);

    locked.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');

    locked.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });
});
