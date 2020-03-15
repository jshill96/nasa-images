<template>
  <div class="images">
    <div v-if="error" class="alert alert-danger error">
      There was a problem loading images from the NASA database.
    </div>

    <h1>NASA Images</h1>
    <p>Search the full collection of NASA's image library.</p>
    <div class="form-group d-flex">
      <input class="form-control" type="text" v-model="query" @keyup.enter="newSearch"/>
      <button class="btn btn-primary" @click="newSearch">Search</button>
    </div>

    <div v-if="loading" class="alert alert-info loading">Loading</div>

    <div class="results">
      <table class="table table-striped" v-if="images.length > 0">
        <thead>
          <tr>
            <td>Title</td>
            <td>Date Taken</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="image in images" :key="image.id">
            <td>
              <router-link :to="{ name: 'image', params: {id: image.data[0].nasa_id }}">
                {{ image.data[0].title }}
              </router-link>
            </td>
            <td>{{ formatDate(image.data[0].date_created) }}</td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="Pagination">
        <ul class="pagination d-flex justify-content-center">
          <li v-if="links.previous" class="page-item">
            <a
              class="page-link"
              :href="`/?q=${this.query}&page=${this.currentPage - 1}`"
            >
              Previous
            </a>
          </li>
          <li v-if="links.next" class="page-item">
            <a class="page-link" :href="`/?q=${this.query}&page=${this.currentPage + 1}`">Next</a>
          </li>
        </ul>
      </nav>
    </div>

    <div v-if="noResults" class="no-results">
      Hmm, there's nothing here.
    </div>
  </div>
</template>
<script>
import { format, parseJSON } from 'date-fns';
import ApiService from '../api/api.service';

export default {
  name: 'Images',
  props: {
    q: String,
    page: Number,
  },
  created() {
    if (this.page) {
      this.currentPage = this.page;
    }

    if (this.q) {
      this.query = this.q;
      this.fetchImages();
    }
  },
  data() {
    return {
      query: '',
      currentPage: 1,
      images: [],
      links: [],
      error: false,
      loading: false,
      noResults: false,
      api: new Image(),
    };
  },
  methods: {
    async newSearch() {
      this.loading = true;
      this.noResults = false;
      this.currentPage = 1;

      await this.fetchImages();

      this.loading = false;
      if (this.images.length === 0) {
        this.noResults = true;
      }
    },
    async fetchImages() {
      try {
        const imageData = await ApiService.query(this.query, { page: this.currentPage });
        this.images = imageData.items;
        this.links = imageData.links;
      } catch (e) {
        this.error = true;
      }
    },
    formatDate(dateString) {
      if (dateString) {
        return format(parseJSON(dateString), "do 'of' MMM, Y");
      }
      return '';
    },
  },
};
</script>
