const withTM = require("next-transpile-modules")
const withSass = require("@zeit/next-sass")
const withMDX = require("@next/mdx")()
const axios = require("axios")

// Tell webpack to compile the ui components package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withMDX(
  withSass(
    withTM({
      transpileModules: ["@dahlia"],
      // exportPathMap adapted from https://github.com/zeit/next.js/blob/canary/examples/with-static-export/next.config.js
      async exportPathMap() {
        // we fetch our list of listings, this allow us to dynamically generate the exported pages
        let listings = []

        try {
          const response = await axios.get("http://localhost:3001")
          listings = response.data.listings
        } catch (error) {
          console.log(error)
        }

        // tranform the list of posts into a map of pages with the pathname `/post/:id`
        const listingPaths = listings.reduce(
          (listingPaths, listing) =>
            Object.assign({}, listingPaths, {
              [`/listing/${listing.id}`]: {
                page: "/listing",
                query: { id: listing.id }
              }
            }),
          {}
        )

        // define page paths for various available languages
        const translatablePaths = {
          "/": { page: "/" },
          "/listings": { page: "/listings" }
        }
        const languages = ["es"] // add new language codes here
        const languagePaths = {}
        Object.entries(translatablePaths).forEach(([key, value]) => {
          languagePaths[key] = value
          languages.forEach(language => {
            languagePaths[`/${language}${key.replace(/^\/$/, "")}`] = {
              ...value,
              query: { language }
            }
          })
        })

        // combine the map of all various types of page paths
        return Object.assign({}, listingPaths, languagePaths, {
          "/disclaimer": { page: "disclaimer" },
          "/privacy": { page: "/privacy" }
        })
      }
    })
  )
)
