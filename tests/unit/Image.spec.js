import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Image from '../../src/views/Image.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('Image', () => {
  test('It has a nasa id', async () => {
    const wrapper = shallowMount(Image, {
      localVue,
    });

    const nasaId = 'Space Walk Photo';
    wrapper.setProps({ id: nasaId });
    await localVue.nextTick();
    expect(wrapper.html()).toContain(nasaId);
  });

  test('The user can see an image', async () => {
    const wrapper = shallowMount(Image, {
      localVue,
    });

    const assets = {
      small: 'https://link-small.jpg',
    };

    wrapper.setData({ assets });
    await localVue.nextTick();

    expect(wrapper.html()).toContain(assets.small);
  });

  test('If the image has a description, the user should see it', async () => {
    const wrapper = shallowMount(Image, {
      localVue,
    });

    const metadata = {
      description: 'This is a description',
    };

    wrapper.setData({ metadata });
    await localVue.nextTick();

    expect(wrapper.html()).toContain(metadata.description);
  });

  test('If the image does not have a description, users will be notified', async () => {
    const wrapper = shallowMount(Image, {
      localVue,
    });

    expect(wrapper.html()).toContain('No description for this image');
  });
});
