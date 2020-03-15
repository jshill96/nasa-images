import axios from 'axios';

const IMAGE_API = 'https://images-api.nasa.gov';
const ASSET_API = 'https://images-assets.nasa.gov';

/**
 * format image metadata for ease of use
 * @param {Object} response
 */
function parseMetadata(response) {
  const metadata = response.data;
  const cleanedMetadata = {};
  if (metadata['AVAIL:Title']) cleanedMetadata.title = metadata['AVAIL:Title'];
  if (metadata['AVAIL:DateCreated']) cleanedMetadata.dateCreated = metadata['AVAIL:DateCreated'];
  if (metadata['AVAIL:Description508'] || metadata['AVAIL:Description']) {
    cleanedMetadata.description = metadata['AVAIL:Description508'] || metadata['AVAIL:Description'];
  }
  if (metadata['AVAIL:Keywords']) cleanedMetadata.keywords = metadata['AVAIL:Keywords'];

  return cleanedMetadata;
}

/**
 * format image assets for ease of use
 * @param {Object} response
 */
function parseAssets(response) {
  const assets = response.data.collection.items;
  const cleanedAsset = {};

  /* eslint no-restricted-syntax: ["error"] */
  for (const asset of assets) {
    if (asset.href.includes('orig')) cleanedAsset.original = asset.href;
    if (asset.href.includes('large')) cleanedAsset.large = asset.href;
    if (asset.href.includes('medium')) cleanedAsset.medium = asset.href;
    if (asset.href.includes('small')) cleanedAsset.small = asset.href;
  }
  return cleanedAsset;
}

/**
 * Define a common interface for making requests to the NASA API
 */
const ApiService = {

  /**
   * Search for images
   * @param {String} image A user's search query
   * @param {Object} params Additional parameters to include as query parameters in the request
   *
   * @return {Object}
   */
  async query(image, params = {}) {
    let path = `${IMAGE_API}/search?media_type=image&q=${image}`;
    if (params.page) path += `&page=${params.page}`;

    try {
      const res = await axios.get(path);

      if (res.data.collection.items.length === 0) {
        return {
          items: [],
          links: {},
        };
      }

      const previous = res.data.collection.links.filter((l) => l.rel === 'prev');
      const next = res.data.collection.links.filter((l) => l.rel === 'next');
      return {
        items: res.data.collection.items,
        links: {
          previous: previous.length ? previous[0] : null,
          next: next.length ? next[0] : null,
        },
      };
    } catch (e) {
      throw new Error(`[App] ApiService Error: ${e}`);
    }
  },

  /**
   * Request a single image's assets and metadata
   * @param {String} id an image's unique nasa_id
   *
   * @return {Object}
   */
  async get(id) {
    const metadataRequest = axios.get(`${ASSET_API}/image/${id}/metadata.json`);
    const assetRequest = axios.get(`${IMAGE_API}/asset/${id}`);
    const requests = [metadataRequest, assetRequest];
    try {
      const responses = await Promise.all(requests);
      const metadataResponse = responses[0];
      const assetResponse = responses[1];

      return {
        metadata: parseMetadata(metadataResponse),
        assets: parseAssets(assetResponse),
      };
    } catch (e) {
      throw new Error(`[App] ApiService error: ${e}`);
    }
  },
};

export default ApiService;
