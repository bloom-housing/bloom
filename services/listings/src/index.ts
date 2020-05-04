import Application from "koa"
import cors from "@koa/cors"
import dotenv from "dotenv"
import jp from "jsonpath"
import "reflect-metadata"
import { createConnection } from "typeorm"
// import { Listing } from "./entity/Listing"
import { Listing as OldListing } from "@bloom-housing/core"
import listingsLoader from "./lib/listings_loader"
import { transformUnits } from "./lib/unit_transformations"
import { listingUrlSlug } from "./lib/url_helper"
import { amiCharts } from "./lib/ami_charts"

createConnection()
  // eslint-disable-next-line @typescript-eslint/require-await
  .then(async connection => {
    dotenv.config({ path: ".env" })

    const config = {
      port: parseInt(process.env.PORT || "3001", 10)
    }

    const app = new Application()

    // TODO: app.use(logger(winston));
    app.use(cors())

    app.use(async ctx => {
      let listings = (await listingsLoader("listings")) as OldListing[]

      if (ctx.request.query.jsonpath) {
        // e.g. http://localhost:3001/?jsonpath=%24%5B%3F(%40.applicationAddress.city%3D%3D%22San+Jose%22)%5D
        listings = jp.query(listings, ctx.request.query.jsonpath)
      }

      // let l
      // Transform all the listings
      listings.forEach(listing => {
        // console.log("New listing adding")
        // l = new Listing()
        // Object.entries(listing).forEach(([key, value]) => (l[key] = value))
        // connection.manager.save(l)
        // console.log(l)

        listing.unitsSummarized = transformUnits(listing.units, amiCharts)
        listing.urlSlug = listingUrlSlug(listing)
      })

      const data = {
        status: "ok",
        listings: listings,
        amiCharts: amiCharts
      }

      ctx.body = data
    })

    app.listen(config.port)
    console.log(`Server running on port ${config.port}`)
  })
  .catch(error => console.log("TypeORM connection error: ", error))
