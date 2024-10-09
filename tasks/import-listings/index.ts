import { Runner, JurisdictionResolver, Extractor, Transformer, Loader, defaultMap } from "./src/etl"
import { DbConfig, UrlInfo } from "./src/types"
import { knex } from "knex"
import axios from "axios"

const jurisdictionIncludeString = process.env.JURISDICTION_INCLUDE_LIST || ""
const jurisdictionIncludeList = jurisdictionIncludeString.split(",").map((name) => name.trim())

// This is also unlikely to change during the lifetime of this task
const listingsEndpoint: UrlInfo = {
  base: process.env.EXTERNAL_API_BASE,
  path: process.env.LISTINGS_ENDPOINT_PATH || "/listings",
}

const jurisdictionsEndpoint: UrlInfo = {
  base: process.env.EXTERNAL_API_BASE,
  path: process.env.JURISDICTIONS_ENDPOINT_PATH || "/jurisdictions",
}

// Set the listing view
// The only valid values are "base" and "full"; default to "base"
const permittedViews = ["base", "full"]
const listingView = permittedViews.includes(process.env.LISTING_VIEW)
  ? process.env.LISTING_VIEW
  : "base"

console.log(`Using listing view [${listingView}]; requested [${process.env.LISTING_VIEW}]`)

const dbConfig: DbConfig = {
  client: "pg",
  connection: process.env.DATABASE_URL,
}

/* 
This is set in api, and since changing a table name is a significant
effort, it's assumed that 1) it is very unlikely to happen over the short 
lifetime of this task and 2) changing a var somewhere in the same repo is 
actually less intrusive than changing an env var elsewhere.
*/
const tableName = "external_listings"

const runner = new Runner(
  new JurisdictionResolver(axios, jurisdictionsEndpoint, jurisdictionIncludeList),
  new Extractor(axios, listingsEndpoint, listingView),
  new Transformer(defaultMap),
  new Loader(knex(dbConfig), tableName)
)

void runner.run()
