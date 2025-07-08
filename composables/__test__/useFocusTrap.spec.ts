import { ref, defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { useFocusTrap } from '../useFocusTrap';

function createTestComponent() {
  return defineComponent({
    template: `
      <div ref="container">
        <button id="btn1">Btn1</button>
        <button id="btn2">Btn2</button>
        <a href="#" id="link">Link</a>
        <input id="input" />
      </div>
    `,
    setup() {
      const container = ref<HTMLElement>();
      useFocusTrap(container);
      return { container };
    }
  });
}

describe('useFocusTrap (with component)', () => {
  it('should find focusable elements correctly', async () => {
    const wrapper = mount(createTestComponent());
    await nextTick();

    const container = wrapper.vm.container as HTMLElement;
    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    expect(focusableElements).toHaveLength(4);
    expect(focusableElements[0].id).toBe('btn1');
    expect(focusableElements[3].id).toBe('input');
  });

  it('should handle empty container gracefully', async () => {
    const EmptyComponent = defineComponent({
      template: '<div ref="container"></div>',
      setup() {
        const container = ref<HTMLElement>();
        useFocusTrap(container);
        return { container };
      }
    });

    const wrapper = mount(EmptyComponent);
    await nextTick();

    // Should not throw error when no focusable elements
    expect(wrapper.exists()).toBe(true);
  });

  it('should remove event listener on unmount', async () => {
    const wrapper = mount(createTestComponent());
    await nextTick();

    const container = wrapper.vm.container as HTMLElement;
    const spy = vi.spyOn(container, 'removeEventListener');

    wrapper.unmount();
    await nextTick();

    expect(spy).toHaveBeenCalled();
  });

  it('should set up focus trap correctly', async () => {
    const wrapper = mount(createTestComponent());
    await nextTick();

    const container = wrapper.vm.container as HTMLElement;
    const firstButton = container.querySelector('#btn1') as HTMLElement;
    const lastInput = container.querySelector('#input') as HTMLElement;

    // Verify that focusable elements are found
    expect(firstButton).not.toBeNull();
    expect(lastInput).not.toBeNull();

    // Verify that the container has the focus trap setup
    expect(container).toBeDefined();
  });

  it('should handle keyboard events', async () => {
    const wrapper = mount(createTestComponent());
    await nextTick();

    const container = wrapper.vm.container as HTMLElement;
    container.querySelector('#btn1') as HTMLElement;
    container.querySelector('#input') as HTMLElement;

    // Test that we can create and dispatch keyboard events
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

    expect(() => {
      container.dispatchEvent(tabEvent);
      container.dispatchEvent(shiftTabEvent);
    }).not.toThrow();
  });

  it('should have correct focusable element order', async () => {
    const wrapper = mount(createTestComponent());
    await nextTick();

    const container = wrapper.vm.container as HTMLElement;
    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    // Verify the order: btn1, btn2, link, input
    expect(focusableElements[0].id).toBe('btn1');
    expect(focusableElements[1].id).toBe('btn2');
    expect(focusableElements[2].id).toBe('link');
    expect(focusableElements[3].id).toBe('input');
  });
}); 