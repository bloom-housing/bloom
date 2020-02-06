import Application from "koa"
import cors from "@koa/cors"
import dotenv from "dotenv"
import jp from "jsonpath"
import { Listing } from "@bloom-housing/core/src/listings"
import listingsLoader from "./lib/listings_loader"
import { transformUnits } from "./lib/unit_transformations"
import { amiCharts } from "./lib/ami_charts"

dotenv.config({ path: ".env" })

const config = {
  port: parseInt(process.env.PORT || "3001", 10)
}

const app = new Application()

// TODO: app.use(logger(winston));
app.use(cors())

app.use(async ctx => {
  let listings = (await listingsLoader("listings")) as Listing[]

  if (ctx.request.query.jsonpath) {
    // e.g. http://localhost:3001/?jsonpath=%24%5B%3F(%40.applicationAddress.city%3D%3D%22San+Jose%22)%5D
    listings = jp.query(listings, ctx.request.query.jsonpath)
  }

  // Transform all the listings
  listings.forEach(listing => {
    listing.unitsSummarized = transformUnits(listing.units, amiCharts)
  })

  const data = {
    status: "ok",
    listings: listings,
    amiCharts: amiCharts
  }

  ctx.body = data
})

export default app.listen(config.port)
console.log(`Server running on port ${config.port}`)
