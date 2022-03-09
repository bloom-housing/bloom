import * as client from "../types/src/backend-swagger"
import yargs from "yargs"
import axios from "axios"
import { serviceOptions } from "../types/src/backend-swagger"
import { readFile, WorkBook } from "xlsx"

// To view usage:
// $ yarn ts-node scripts/import-amc-waitlist-report.ts --help

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
    describe: "The file path of the AMC waitlist report (in XLSX format).",
  },
  listingId: {
    type: "string",
    demandOption: true,
    describe: "The database ID of the listing being updated.",
  },
}).argv

async function main(): Promise<void> {
  const workBook: WorkBook = readFile(args.reportFilePath)

  // First, find the waitlist info we're looking for.
  let waitlistSize = -1
  for (const name of workBook.SheetNames) {
    const sheet = workBook.Sheets[name]
    for (const key in sheet) {
      if (Object.prototype.hasOwnProperty.call(sheet[key], "v")) {
        try {
          const match = sheet[key].v.match(/Total on Waitlist:\s*(\d*)/)
          if (match?.length > 0) {
            waitlistSize = Number.parseInt(match[1])
            break
          }
        } catch (err) {
          continue
        }
      }
    }
    if (waitlistSize >= 0) {
      break
    }
  }

  if (waitlistSize < 0) {
    console.log("Couldn't find waitlist size. Stopping.")
    return
  }

  console.log(`Found waitlist size: ${waitlistSize}`)

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
  // monthlyRentDeterminationType
  // EnumUnitsSummaryAmiLevelMonthlyRentDeterminationType
  const listingsService = new client.ListingsService()
  const listing = await listingsService.retrieve({ id: args.listingId })
  if (!listing.waitlistMaxSize) {
    // If there's no specified maximum waitlist size, we assume it's "unbounded".
    // Max int in SQL is 2 ** 31 - 1, so we use that to represent "unbounded".
    listing.waitlistMaxSize = 2 ** 31 - 1
  }
  listing.waitlistCurrentSize = waitlistSize
  console.log(
    `Updating "${listing.name}" listing with new waitlist size ${listing.waitlistCurrentSize} (out of ${listing.waitlistMaxSize})`
  )
  // await listingsService.update({ id: args.listingId, body: listing })
}

void main()
