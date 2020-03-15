import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Images from '../../src/views/Images.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('Images', () => {
  test('When the page loads, user should only see the search bar', async () => {
    const wrapper = shallowMount(Images, {
      localVue,
    });

    expect(wrapper.find('table').exists()).toBe(false);
    expect(wrapper.find('.loading').exists()).toBe(false);
  });

  test('When loading, user should not see results table', async () => {
    const wrapper = shallowMount(Images, {
      localVue,
    });

    wrapper.setData({ loading: true });
    await localVue.nextTick();

    expect(wrapper.find('table').exists()).toBe(false);
  });

  test('When there are images, they should be visible', async () => {
    const wrapper = shallowMount(Images, {
      localVue,
    });

    const images = [{ data: [{ date_created: new Date(), title: 'asdf', nasa_id: 'asdf_id' }] }];
    wrapper.setData({ images });
    await localVue.nextTick();

    expect(wrapper.find('table').isVisible()).toBe(true);
    expect(wrapper.findAll('tbody tr').length).toBe(1);
    expect(wrapper.html()).toContain(images[0].data[0].title);
  });

  test('If there are no results, the user should see a message', async () => {
    const wrapper = shallowMount(Images, {
      localVue,
    });

    expect(wrapper.find('.no-results').exists()).toBe(false);
    wrapper.setData({
      noResults: true,
    });
    await localVue.nextTick();
    expect(wrapper.find('.no-results').isVisible()).toBe(true);
  });

  test('If there are errors, the user should see an error message', async () => {
    const wrapper = shallowMount(Images, {
      localVue,
    });

    expect(wrapper.find('.error').exists()).toBe(false);
    wrapper.setData({
      error: true,
    });
    await localVue.nextTick();
    expect(wrapper.find('.error').isVisible()).toBe(true);
  });
});
