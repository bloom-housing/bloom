import { importListing, ListingImport, UnitImport } from "./import-helpers"
import { createUnitsArray } from "./detroit-helpers"
import axios from "axios"
import { AddressCreate, ListingStatus, CSVFormattingType } from "../types/src/backend-swagger"

// Sample usage:
// $ yarn ts-node scripts/import-listings-from-detroit-arcgis.ts http://localhost:3100 admin@example.com:abcdef https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Affordable_Housing_Website_data_12_20/FeatureServer/0//query

async function main() {
  if (process.argv.length < 5) {
    console.log(
      "usage: yarn ts-node scripts/import-listings-from-detroit-arcgis.ts import_api_url email:password arcgis_url"
    )
    process.exit(1)
  }

  const [importApiUrl, userAndPassword, arcGisUrl] = process.argv.slice(2)
  const [email, password] = userAndPassword.split(":")

  const response = await axios.get(arcGisUrl, {
    params: { where: "1=1", f: "pjson", outFields: "*" },
  })

  const numListings: number = response.data.features.length
  for (let i = 0; i < numListings; i++) {
    const listingAttributes = response.data.features[i].attributes

    const address: AddressCreate = {
      street: listingAttributes.Project_Address,
      latitude: listingAttributes.Latitude,
      longitude: listingAttributes.Longitude,
      zipCode: listingAttributes.Zip,
      city: "Detroit",
      state: "MI",
    }

    let units: UnitImport[] = []
    if (listingAttributes.Number_0BR) {
      units = units.concat(createUnitsArray("studio", listingAttributes.Number_0BR))
    }
    if (listingAttributes.Number_1BR) {
      units = units.concat(createUnitsArray("oneBdrm", parseInt(listingAttributes.Number_1BR)))
    }
    if (listingAttributes.Number_2BR) {
      units = units.concat(createUnitsArray("twoBdrm", parseInt(listingAttributes.Number_2BR)))
    }
    if (listingAttributes.Number_3BR) {
      units = units.concat(createUnitsArray("threeBdrm", parseInt(listingAttributes.Number_3BR)))
    }
    if (listingAttributes.Number_4BR) {
      units = units.concat(createUnitsArray("fourBdrm", parseInt(listingAttributes.Number_4BR)))
    }
    if (listingAttributes.Number_5BR) {
      units = units.concat(createUnitsArray("fiveBdrm", parseInt(listingAttributes.Number_5BR)))
    }

    // The /listings/id view won't render if there isn't at least one unit; add a dummy "studio"
    if (units.length == 0) {
      units = createUnitsArray("studio", 1)
    }

    const leasingAgentAddress = {
      city: "Fake City",
      state: "XX",
      street: "123 Fake St",
      zipCode: "12345",

      // Add null id, createdAt, etc. to avoid compilation errors.
      // (These will be replaced by real values when the script uploads this address.)
      id: null,
      createdAt: null,
      updatedAt: null,
    }

    const listing: ListingImport = {
      name: listingAttributes.Project_Name,
      buildingAddress: address,
      units: units,
      leasingAgentName: listingAttributes.Manager_Contact,
      leasingAgentPhone: listingAttributes.Manager_Phone,
      leasingAgentAddress: leasingAgentAddress,
      phoneNumber: listingAttributes.Property_Phone,
      status: ListingStatus.active,
      jurisdictionName: "Detroit",

      // The following fields are only set because they are required
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
      console.log("New listing (" + newListing.name + ") created successfully.")
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
  console.log("\nSuccessfully created all " + numListings.toString() + " listings!")
}

void main()
