const withTM = require("next-transpile-modules");
const withSass = require('@zeit/next-sass')
const axios = require('axios');

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withSass(withTM({
  transpileModules: ["@dahlia"],
  // exportPathMap adapted from https://github.com/zeit/next.js/blob/canary/examples/with-static-export/next.config.js
  async exportPathMap () {
    // we fetch our list of listings, this allow us to dynamically generate the exported pages
    let listings = []

    try {
      const response = await axios.get('http://localhost:3001');
      listings = response.data.listings;
    } catch(error) {
      console.log(error);
    }

    // tranform the list of posts into a map of pages with the pathname `/post/:id`
    const pages = listings.reduce(
      (pages, listing) =>
        Object.assign({}, pages, {
          [`/listing/${listing.id}`]: {
            page: '/listing',
            query: { id: listing.id }
          }
        }),
      {}
    )

    // combine the map of post pages with the home
    return Object.assign({}, pages, {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/listings': { page: '/listings' }
    })
  }
}));
