import fs from "fs"
import { plainToClass } from "class-transformer"
import { ApplicationMethod, ApplicationMethodType } from "./src/listings/entities/listing.entity"

if (process.argv.length < 3) {
  console.log("usage: listings-update-schema input_listing.json")
  process.exit(1)
}

const [listingFilePath] = process.argv.slice(2)

function convertApplicationMethods(listing: any) {
  const applicationMethods: Array<ApplicationMethod> = []
  if (listing.acceptsPostmarkedApplications) {
    applicationMethods.push(
      plainToClass(ApplicationMethod, {
        type: ApplicationMethodType.LeasingAgent,
        acceptsPostmarkedApplications: listing.acceptsPostmarkedApplications as boolean,
      })
    )
  }
  if (listing.acceptingApplicationsByPoBox) {
    applicationMethods.push(
      plainToClass(ApplicationMethod, {
        type: ApplicationMethodType.POBox,
        acceptsPostmarkedApplications: false,
      })
    )
  }
  if (listing.blankPaperApplicationCanBePickedUp) {
    applicationMethods.push(
      plainToClass(ApplicationMethod, {
        type: ApplicationMethodType.PaperPickup,
        acceptsPostmarkedApplications: false,
      })
    )
  }

  if ("attachments" in listing) {
    listing.attachments.forEach((attachment) => {
      if (attachment.type === 1) {
        applicationMethods.push(
          plainToClass(ApplicationMethod, {
            type: ApplicationMethodType.FileDownload,
            acceptsPostmarkedApplications: false,
            label: attachment.label,
            fileId: attachment.fileUrl,
          })
        )
      } else if (attachment.type === 2) {
        applicationMethods.push(
          plainToClass(ApplicationMethod, {
            type: ApplicationMethodType.ExternalLink,
            acceptsPostmarkedApplications: false,
            label: attachment.label,
            fileId: attachment.fileUrl,
          })
        )
      }
    })
    delete listing["attachments"]
  }

  ;[
    "acceptingApplicationsAtLeasingAgent",
    "acceptingApplicationsByPoBox",
    "acceptingOnlineApplications",
    "acceptsPostmarkedApplications",
    "blankPaperApplicationCanBePickedUp",
  ].forEach((key) => {
    delete listing[key]
  })

  listing.applicationMethods = applicationMethods

  return listing
}

function convertImageUrl(listing) {
  if (!("assets" in listing)) {
    listing.assets = []
  }

  if (listing.imageUrl !== null && listing.imageUrl != undefined) {
    listing.assets.push({
      referenceType: "Listing",
      referenceId: "",
      label: "building",
      fileId: listing.imageUrl,
    })
  }

  delete listing["imageUrl"]
  return listing
}

function main() {
  const listing = JSON.parse(fs.readFileSync(listingFilePath, "utf-8"))
  let newListing = convertApplicationMethods(listing)
  newListing = convertImageUrl(newListing)
  console.log(JSON.stringify(newListing, null, 2))
}

main()
