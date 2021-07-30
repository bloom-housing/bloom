import * as React from "react"
import moment from "moment"
import { ApplicationSection } from "./ApplicationSection"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import {
  ApplicationMethod,
  ApplicationMethodType,
  Listing,
} from "@bloom-housing/backend-core/types"

export default {
  component: ApplicationSection,
  title: "Listing Sidebar/Application Section",
}

export const dueSoon = () => {
  const listing = Object.assign({}, ArcherListing) as Listing
  const days = 10
  listing.applicationOpenDate = new Date(moment().format())
  listing.waitlistCurrentSize = 0
  listing.applicationDueDate = new Date(moment().add(days, "days").format())
  return <ApplicationSection listing={listing} internalFormRoute="/forms" />
}

export const previewState = () => {
  const listing = Object.assign({}, ArcherListing) as Listing
  const days = 10
  listing.applicationOpenDate = new Date(moment().format())
  listing.waitlistCurrentSize = 0
  listing.applicationDueDate = new Date(moment().add(days, "days").format())

  const testMethod1: ApplicationMethod = {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "English",
    externalReference: "#english",
    type: ApplicationMethodType.FileDownload,
  }
  const testMethod2: ApplicationMethod = {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "Spanish",
    externalReference: "#spanish",
    type: ApplicationMethodType.FileDownload,
  }

  listing.applicationMethods = listing.applicationMethods.concat([testMethod1, testMethod2])

  return <ApplicationSection preview listing={listing} internalFormRoute="/forms" />
}

export const previewStateExternalLink = () => {
  const listing = Object.assign({}, ArcherListing) as Listing
  const days = 10
  listing.applicationOpenDate = new Date(moment().format())
  listing.waitlistCurrentSize = 0
  listing.applicationDueDate = new Date(moment().add(days, "days").format())

  const linkMethod: ApplicationMethod = {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    externalReference: "https://www.exygy.com",
    type: ApplicationMethodType.ExternalLink,
  }

  listing.applicationMethods = listing.applicationMethods.concat([linkMethod])

  return <ApplicationSection preview listing={listing} internalFormRoute="/forms" />
}

/*
const listing2 = Object.assign({}, Archer) as any
listing2.applicationOpenDate = moment().add(5, "days").format()
listing2.applicationDueDate = moment().add(10, "days").format()
listing2.waitlistCurrentSize = 0
export const openSoon = () => <ApplicationSection listing={listing2} />

const listing3 = Object.assign({}, Archer) as any
listing3.applicationOpenDate = moment().subtract(5, "days").format()
listing3.applicationDueDate = moment().add(10, "days").format()
listing3.waitlistCurrentSize = 0
export const openedAlready = () => <ApplicationSection listing={listing3} />

const listing4 = Object.assign({}, Archer) as any
listing4.applicationOpenDate = moment().subtract(15, "days").format()
listing4.waitlistCurrentSize = 0
listing4.applicationDueDate = ""
export const openedWithNoDue = () => <ApplicationSection listing={listing4} />

const listing5 = Object.assign({}, Archer) as any
listing5.applicationDueDate = moment().add(10, "days").format()
listing5.waitlistCurrentSize = 0
export const withOpenWaitlist = () => <ApplicationSection listing={listing5} />

const listing6 = Object.assign({}, Archer) as any
listing6.applicationDueDate = moment().add(10, "days").format()
listing6.waitlistCurrentSize = 0
listing6.unitsAvailable = 2
export const withOpenWaitlistAndUnits = () => <ApplicationSection listing={listing6} />

const listing7 = Object.assign({}, Archer) as any
listing7.applicationDueDate = moment().add(10, "days").format()
export const closedWaitlist = () => <ApplicationSection listing={listing7} />
*/
