import * as client from "../types/src/backend-swagger"
import fs from "fs"
import yargs from "yargs"
import axios from "axios"
import { XMLParser } from "fast-xml-parser"
import { serviceOptions } from "../types/src/backend-swagger"

// To view usage:
// $ yarn ts-node scripts/import-realpages-availability-report.ts --help

const args = yargs.options({
  email: {
    type: "string",
    demandOption: true,
    describe:
      "The email of the user updating the listings. Must have admin or listing agent permissions.",
  },
  password: {
    type: "string",
    demandOption: true,
    describe: "The password of the user updating the listings.",
  },
  backendUrl: { type: "string", demandOption: true, describe: "The URL of the backend service." },
  reportFilePath: {
    type: "string",
    demandOption: true,
    describe: "The file path of the Realpages availability report (in XML format).",
  },
  listingId: {
    type: "string",
    demandOption: true,
    describe: "The database ID of the listing being updated.",
  },
  mapping: {
    type: "array",
    describe:
      'The mapping from floorplan code to unit type. E.g. "1.5 B:oneBdrm". Must be repeated for every floorplan code value.',
  },
}).argv

function attributeFetcher(unitXmlData, attribute: string): string {
  return unitXmlData[`@_${attribute}`]
}

function tagContentsFetcher(unitXmlData, tag: string): string {
  return unitXmlData[tag]
}

async function main(): Promise<void> {
  const fpCodeUnitTypeMap: Record<string, string> = args.mapping.reduce((a, m: string) => {
    return { ...a, [m.split(":")[0]]: m.split(":")[1] }
  }, {})

  const reportUnitData: any[] = new XMLParser({ ignoreAttributes: false }).parse(
    fs.readFileSync(args.reportFilePath, "utf-8")
  ).root.Response.FileContents.root.LeaseVariance.Row

  if (reportUnitData.length == 0) {
    console.log("No unit data to process. Aborting.")
    process.exit(0)
  }

  // Some reports contain the data in attributes, and others contain it in sub-tags.
  let infoFetcher: (unit: any, key: string) => string
  if (reportUnitData.every((u) => "@_fpCode" in u && "@_UnitAvailableBit" in u)) {
    infoFetcher = attributeFetcher
  } else if (reportUnitData.every((u) => "fpCode" in u && "UnitAvailableBit" in u)) {
    infoFetcher = tagContentsFetcher
  } else {
    throw "Missing fpCode or UnitAvailableBit information from unit data."
  }

  // Make sure there's a mapping for every fpCode in the XML before proceeding.
  const reportFpCodes = new Set(
    reportUnitData
      .map((u) => infoFetcher(u, "fpCode"))
      .filter((fpCode: string) => fpCode.length > 0)
  )
  const mappedFpCodes = new Set(Object.keys(fpCodeUnitTypeMap))
  for (const fpCode of reportFpCodes) {
    if (!mappedFpCodes.has(fpCode)) {
      throw `Missing fpCode "${fpCode}" from mapping.`
    }
  }

  serviceOptions.axios = axios.create({
    baseURL: args.backendUrl,
    timeout: 10000,
  })

  const { accessToken } = await new client.AuthService().login({
    body: {
      email: args.email,
      password: args.password,
    },
  })

  // Update the axios config so future requests include the access token in the header.
  serviceOptions.axios = axios.create({
    baseURL: args.backendUrl,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const unitTypes = await new client.UnitTypesService().list()

  // Make sure there's a unit type for every mapped unit type before proceeding.
  const unitTypeNames = new Set(unitTypes.map((u) => u.name))
  const mappedUnitTypeNames = new Set(Object.values(fpCodeUnitTypeMap))
  for (const mappedUnitTypeName of mappedUnitTypeNames) {
    if (!unitTypeNames.has(mappedUnitTypeName)) {
      throw `Unknown unit type "${mappedUnitTypeName}"`
    }
  }

  // const listingsService = new client.ListingsService()
  // const listing = await listingsService.retrieve({ id: args.listingId })
  // TODO: Update with new unit groups model
  // const listingUnitTypeNameSummaryMap = listing.unitsSummary.reduce((a, s) => {
  //   return { ...a, [s.unitType.name]: s }
  // }, {})
  // const listingUnitTypeNameSummaryMap = {}

  // Make sure that the listing has all specified mapped unit type names.
  /* const listingUnitTypeNames = new Set(Object.keys(listingUnitTypeNameSummaryMap))
  for (const mappedUnitTypeName of mappedUnitTypeNames) {
    if (!listingUnitTypeNames.has(mappedUnitTypeName)) {
      throw `Listing "${listing.name}" is missing unit type ${mappedUnitTypeName} from unit summaries.`
    }
  } */

  let newUnitTypeNameAvailabilityMap = {}
  for (const mappedUnitTypeName of mappedUnitTypeNames) {
    newUnitTypeNameAvailabilityMap = {
      ...newUnitTypeNameAvailabilityMap,
      [mappedUnitTypeName]: reportUnitData.filter(
        (u) =>
          fpCodeUnitTypeMap[infoFetcher(u, "fpCode")] === mappedUnitTypeName &&
          infoFetcher(u, "UnitAvailableBit") === "1"
      ).length,
    }
  }

  // Make sure that the availability count is < the total count.
  /* for (const unitTypeName in newUnitTypeNameAvailabilityMap) {
    if (
      newUnitTypeNameAvailabilityMap[unitTypeName] >
      listingUnitTypeNameSummaryMap[unitTypeName].totalCount
    ) {
      throw `New availability (${newUnitTypeNameAvailabilityMap[unitTypeName]}) for unit type ${unitTypeName} is greater than total (${listingUnitTypeNameSummaryMap[unitTypeName].totalCount})`
    }
  }

  // TODO: Update with new unit groups model
  // for (const unitSummary of listing.unitsSummary) {
  //   unitSummary.totalAvailable = newUnitTypeNameAvailabilityMap[unitSummary.unitType.name] || 0
  // }
  console.log(`Updating listing "${listing.name}" with new availabilities:`)
  console.log(newUnitTypeNameAvailabilityMap)
  await listingsService.update({ id: args.listingId, body: listing }) */
}

void main()
