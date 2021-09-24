import { importListing, ListingImport } from "./import-helpers"
import fs from "fs"
import { Listing } from "../types/src/backend-swagger"

// Example usage (from within /backend/core):
// $ yarn ts-node scripts/import-listing-from-json-file.ts http://localhost:3100 admin@example.com:abcdef scripts/minimal-listing.json

async function main() {
  if (process.argv.length < 5) {
    console.log(
      "usage: yarn ts-node scripts/import-listing-from-json-file.ts api_url email:password input_listing.json"
    )
    process.exit(1)
  }

  const [apiUrl, userAndPassword, listingFilePath] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  const listing: ListingImport = JSON.parse(fs.readFileSync(listingFilePath, "utf-8"))
  listing.jurisdictionName = "Alameda"

  let newListing: Listing
  try {
    newListing = await importListing(apiUrl, email, password, listing)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }

  console.log(newListing)
  console.log("Success! New listing created.")
}

void main()
