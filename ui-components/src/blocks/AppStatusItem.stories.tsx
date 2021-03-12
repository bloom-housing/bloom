import React from "react"
import { AppStatusItem } from "./AppStatusItem"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import moment from "moment"
import { Application, Listing } from "@bloom-housing/backend-core/types"
const listing = Object.assign({}, ArcherListing) as Listing

export default {
  title: "Blocks/Application Status Item",
}

const application = {} as Application
let days = 10
listing.applicationDueDate = new Date(moment().add(days, "days").format())
application.listing = listing
application.updatedAt = new Date()

export const AppStatusItemSubmitted = () => (
  <AppStatusItem application={application} listing={listing}></AppStatusItem>
)
