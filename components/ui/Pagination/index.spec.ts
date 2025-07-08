import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Pagination from './index.vue';

describe('Pagination', () => {
  const factory = (props = {}) => {
    return mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 100,
        ...props,
      },
    });
  };

  it('renders correct number of page buttons for less than 7 pages', () => {
    const wrapper = factory({ totalItems: 50 }); // 5 pages total
    const pageButtons = wrapper.findAll('.pagination__page_button');
    expect(pageButtons.length).toBe(5);
    expect(pageButtons[0].text()).toBe('1');
    expect(pageButtons[4].text()).toBe('5');
  });

  it('renders ellipsis when pages are more than 7', () => {
    const wrapper = factory({ totalItems: 100 }); // 10 pages total
    const pageButtons = wrapper.findAll('.pagination__page_button');
    expect(pageButtons.some(btn => btn.text() === '...')).toBe(true);
  });

  it('emits "change-page" event with correct page when page button clicked', async () => {
    const wrapper = factory();
    const pageButtons = wrapper.findAll('.pagination__page_button');
    await pageButtons[2].trigger('click');
    expect(wrapper.emitted('change-page')).toBeTruthy();
    expect(wrapper.emitted('change-page')![0]).toEqual([3]);
  });

  it('previous and next buttons exist and work', async () => {
    const wrapper = factory({ currentPage: 2 });

    const buttons = wrapper.findAll('button');
    const prev = buttons[0]; // previous button
    const next = buttons[buttons.length - 1]; // next button

    expect(prev.exists()).toBe(true);
    expect(next.exists()).toBe(true);

    await prev.trigger('click');
    expect(wrapper.emitted('change-page')![0]).toEqual([1]);

    await next.trigger('click');
    expect(wrapper.emitted('change-page')![1]).toEqual([3]);
  });
});
