import dotenv from "dotenv"
import "reflect-metadata"
import { createConnection } from "typeorm"
import { Listing } from "./entity/Listing"
import { Listing as OldListing } from "@bloom-housing/core"
import listingsLoader from "./lib/listings_loader"

const skipped = ["id", "units", "attachments", "preferences"]
let l
createConnection()
  // eslint-disable-next-line @typescript-eslint/require-await
  .then(async connection => {
    dotenv.config({ path: ".env" })
    const listings = (await listingsLoader("listings")) as OldListing[]

    for await (const listing of listings) {
      l = new Listing()
      for await (const key of Object.keys(listing)) {
        if (!skipped.includes(key)) {
          l[key] = listing[key]
        }
      }
      await connection.manager.save(l)
    }
  })
  .catch(error => console.log("TypeORM connection error: ", error))
