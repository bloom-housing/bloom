import Application from "koa"
import cors from "@koa/cors"
import dotenv from "dotenv"
import "reflect-metadata"
import { createConnection } from "typeorm"
import { Listing } from "./entity/Listing"
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
      const listings = await connection
        .getRepository(Listing)
        .find({ relations: ["units", "attachments", "preferences"] })

      // Transform all the listings
      listings.forEach(listing => {
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
