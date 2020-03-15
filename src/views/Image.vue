<template>
  <div class="mt-3">
    <router-link href="#" :to="{ name: 'images'}">Go Back</router-link>
    <div v-if="errors">
      <div v-for="error in errors" :key="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>

    <div class="image">
      <h1>{{ metadata.title }}</h1>
      <img class="img-fluid mb-3" :src="assets.small || assets.original" :alt="id" />

      <h2 class="mt-3">About this image</h2>
      <p v-if="metadata.keywords">
        Tags:
        <span
          v-for="keyword in metadata.keywords"
          :key="keyword"
          class="mr-2 badge badge-primary"
        >
          {{ keyword }}
        </span>
      </p>
      <p>Created on: {{ formatDate(metadata.dateCreated) || 'not given' }}</p>
      <p>{{ metadata.description || 'No description for this image' }}</p>
    </div>
  </div>
</template>

<script>
import { format, parse } from 'date-fns';
import ApiService from '../api/api.service';

export default {
  props: {
    id: String,
  },
  data() {
    return {
      assets: {},
      metadata: {},
      errors: [],
      loaded: false,
    };
  },
  created() {
    this.getImage();
  },
  methods: {
    async getImage() {
      try {
        const image = await ApiService.get(this.id);
        this.assets = image.assets;
        this.metadata = image.metadata;
      } catch (e) {
        this.errors.push('there was a problem loading this image');
      }
    },
    formatDate(dateString) {
      // Try our best to handle the multiple formats the API gives us
      // Fallback to whatever they gave us if necessary
      if (dateString) {
        let dateFormat = '';
        if (dateString.match(/^.{4}:.{2}:.{2}$/)) {
          dateFormat = 'yyyy:MM:dd';
        } else if (dateString.match(/^.{4}:.{2}:.{2}/)) {
          dateFormat = 'yyyy:MM:dd HH:mm:ss';
        } else {
          return dateString;
        }

        return format(parse(dateString, dateFormat, new Date()), "do 'of' MMM, Y");
      }
      return '';
    },
  },
};
</script>
