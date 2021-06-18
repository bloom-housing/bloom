import * as React from "react"
import dayjs from "dayjs"
import { ApplicationSection } from "./ApplicationSection"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import { Listing } from "@bloom-housing/backend-core/types"

export default {
  component: ApplicationSection,
  title: "Listing Sidebar/Application Section",
}

export const dueSoon = () => {
  const listing = Object.assign({}, ArcherListing) as Listing
  const days = 10
  listing.applicationOpenDate = new Date(dayjs().format())
  listing.waitlistCurrentSize = 0
  listing.applicationDueDate = new Date(dayjs().add(days, "days").format())
  return <ApplicationSection listing={listing} internalFormRoute="/forms" />
}
