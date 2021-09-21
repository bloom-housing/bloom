import csv from "csv-parser"
import fs from "fs"
import { importListing, getDetroitJurisdiction } from "./listings-importer"
import {
  ListingCreate,
  AddressCreate,
  CSVFormattingType,
  ListingStatus,
} from "../types/src/backend-swagger"

// This script reads in listing data from a CSV file and sends requests to the backend to create
// the corresponding Listings. A few notes:
// - This script does not delete or modify any existing listings.
// - If one listing fails to be uploaded, the script will still attempt all the rest. At the end,
//   it will report how many failed (with error messages) and how many succeeded.
// - Each line in the CSV file is assumed to correspond to a distinct listing.
// - This script assumes particular heading names in the input CSV file (see listingFields["..."]
//   below).

// Sample usage:
// $ yarn ts-node scripts/import-listings-from-csv.ts http://localhost:3100 admin@example.com:abcdef path/to/file.csv

async function main() {
  if (process.argv.length < 5) {
    console.log(
      "usage: yarn ts-node scripts/import-listings-from-csv.ts import_api_url email:password csv_file_path"
    )
    process.exit(1)
  }

  const [importApiUrl, userAndPassword, csvFilePath] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  // Regex used to parse the AMI from an AMI column name
  const amiColumnRegex = /(\d+) Pct AMI/ // e.g. 30 Pct AMI

  // Read raw CSV data into memory.
  // Note: createReadStream creates ReadStream's whose on("data", ...) methods are called
  // asynchronously. To ensure that all CSV lines are read in before we start trying to upload
  // listings from it, we wrap this step in a Promise.
  const rawListingFields = []
  const promise = new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (listingFields) => {
        const listingName: string = listingFields["Project Name"]
        // Exclude listings that are not "regulated" affordable housing
        const affordabilityStatus: string = listingFields["Affordability status"]
        if (affordabilityStatus.toLowerCase() !== "regulated") {
          console.log(
            `Skipping listing because it is not *regulated* affordable housing: ${listingName}`
          )
          return
        }

        // Exclude listings that are not at the stage of housing people.
        // Some listings are in the "development pipeline" and should not yet be shown to
        // housing seekers. The "Development Pipeline Bucket" below is a code that is meaningful
        // within HRD.
        const projectType: string = listingFields["Project Type"]
        const developmentPipelineBucket: number = parseInt(
          listingFields["Development Pipeline Bucket"]
        )
        if (projectType.toLowerCase() !== "existing occupied" && developmentPipelineBucket < 3) {
          console.log(
            `Skipping listing because it is not far enough along in the development pipeline: ${listingName}`
          )
          return
        }

        rawListingFields.push(listingFields)
      })
      .on("end", resolve)
      .on("error", reject)
  })
  await promise

  console.log(`CSV file successfully read in; ${rawListingFields.length} listings to upload`)

  const jurisdiction = await getDetroitJurisdiction(importApiUrl, email, password)

  const uploadFailureMessages = []
  let numListingsSuccessfullyUploaded = 0
  for (const listingFields of rawListingFields) {
    const address: AddressCreate = {
      street: listingFields["Project Address"],
      zipCode: listingFields["Zip Code"],
      city: "Detroit",
      state: "MI",
      longitude: listingFields["Longitude"],
      latitude: listingFields["Latitude"],
    }

    // Add data about unitsSummaries
    const unitsSummaries = []
    if (listingFields["Number 0BR"]) {
      unitsSummaries.push({
        unitType: "studio",
        totalCount: Number(listingFields["Number 0BR"]),
      })
    }
    if (listingFields["Number 1BR"]) {
      unitsSummaries.push({
        unitType: "oneBdrm",
        totalCount: Number(listingFields["Number 1BR"]),
      })
    }
    if (listingFields["Number 2BR"]) {
      unitsSummaries.push({
        unitType: "twoBdrm",
        totalCount: Number(listingFields["Number 2BR"]),
      })
    }
    if (listingFields["Number 3BR"]) {
      unitsSummaries.push({
        unitType: "threeBdrm",
        totalCount: Number(listingFields["Number 3BR"]),
      })
    }
    // Lump 4BR and 5BR together as "fourBdrm"
    const numberFourBdrm = listingFields["Number 4BR"] ? parseInt(listingFields["Number 4BR"]) : 0
    const numberFiveBdrm = listingFields["Number 5BR"] ? parseInt(listingFields["Number 5BR"]) : 0
    if (numberFourBdrm + numberFiveBdrm > 0) {
      unitsSummaries.push({
        unitType: "fourBdrm",
        totalCount: numberFourBdrm + numberFiveBdrm,
      })
    }

    // Listing affordability details
    let amiPercentageMin, amiPercentageMax
    const listingFieldsArray = Object.entries(listingFields)
    const colStart = listingFieldsArray.findIndex((element) => element[0] === "15 Pct AMI")
    const colEnd = listingFieldsArray.findIndex((element) => element[0] === "80 Pct AMI")
    for (const [key, value] of listingFieldsArray.slice(colStart, colEnd + 1)) {
      if (!value) continue
      if (!amiPercentageMin) {
        amiPercentageMin = parseInt(amiColumnRegex.exec(key)[1])
      }
      amiPercentageMax = parseInt(amiColumnRegex.exec(key)[1])
    }

    let leasingAgentEmail = null
    if (listingFields["Manager Email"]) {
      leasingAgentEmail = listingFields["Manager Email"]
    }

    const listing: ListingCreate = {
      name: listingFields["Project Name"],
      hrdId: listingFields["HRDID"],
      buildingAddress: address,
      region: listingFields["Region"],
      ownerCompany: listingFields["Owner Company"],
      managementCompany: listingFields["Management Company"],
      leasingAgentName: listingFields["Manager Contact"],
      leasingAgentPhone: listingFields["Manager Phone"],
      managementWebsite: listingFields["Management Website"],
      leasingAgentEmail: leasingAgentEmail,
      phoneNumber: listingFields["Property Phone"],
      amiPercentageMin: amiPercentageMin,
      amiPercentageMax: amiPercentageMax,
      status: ListingStatus.active,
      unitsSummary: unitsSummaries,
      jurisdiction: jurisdiction,

      // The following fields are only set because they are required
      units: [],
      CSVFormattingType: CSVFormattingType.basic,
      applicationMethods: [],
      preferences: [],
      applicationDropOffAddress: null,
      applicationMailingAddress: null,
      events: [],
      assets: [],
      displayWaitlistSize: false,
    }

    try {
      const newListing = await importListing(importApiUrl, email, password, listing)
      console.log(`New listing uploaded successfully: ${newListing.name}`)
      numListingsSuccessfullyUploaded++
    } catch (e) {
      console.log(e)
      uploadFailureMessages.push(`Upload failed for ${listing.name}: ${e}`)
    }
  }

  console.log(`\nNumber of listings successfully uploaded: ${numListingsSuccessfullyUploaded}`)
  console.log(`Number of failed listing uploads: ${uploadFailureMessages.length}\n`)
  for (const failureMessage of uploadFailureMessages) {
    console.log(failureMessage)
  }
}

void main()
