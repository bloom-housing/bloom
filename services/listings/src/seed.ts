import dotenv from "dotenv"
import { Listing as OldListing } from "@bloom-housing/core"
import listingsLoader from "./lib/listings_loader"
import { PrismaClient, Listing } from "@prisma/client"

const skipped = [
  "id",
  "units",
  "attachments",
  "preferences",
  "applicationAddress",
  "leasingAgentAddress",
  "buildingAddress",
  "createdAt",
  "updatedAt"
]

const relations = ["applicationAddress", "leasingAgentAddress", "buildingAddress", "units"]
const prisma = new PrismaClient()
async function main() {
  dotenv.config({ path: ".env" })
  const listings = (await listingsLoader("listings")) as OldListing[]

  for await (const listing of listings) {
    const l = {}
    const entities = {}
    for await (const key of Object.keys(listing)) {
      if (!skipped.includes(key)) {
        l[key] = listing[key]
      } else {
        if (key != "id") {
          entities[key] = listing[key]
        }
      }
    }

    for (const relation of relations) {
      let value = listing[relation]
      if (value instanceof Array) {
        value = (value as any).map(obj => {
          delete obj["id"]
          delete obj["listingId"]
          delete obj["updateAt"]
          delete obj["createdAt"]
          return obj
        })
      } else {
        delete value["id"]
        delete value["listingId"]
        delete value["updateAt"]
        delete value["createdAt"]
      }
      l[relation] = { create: value }
    }

    const listed = await prisma.listing.create({
      data: l
    })
    console.log(listed)
  }
}

main()
  .catch(e => {
    throw e
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.disconnect()
  })
