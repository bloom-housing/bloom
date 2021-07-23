import * as React from "react"

import { Apply } from "./Apply"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"
import {
  ApplicationMethod,
  ApplicationMethodType,
  Listing,
} from "@bloom-housing/backend-core/types"

export default {
  title: "Listing Sidebar/Apply",
}

const listing = Object.assign({}, ArcherListing) as Listing
const internalFormRoute = "/applications/start/choose-language"

export const hardApplicationDeadline = () => {
  listing.applicationDueDate = new Date("2021-11-30T15:22:57.000-07:00")
  listing.applicationMailingAddress = {
    city: "San Jose",
    street: "98 Archer Street",
    zipCode: "95112",
    state: "CA",
    latitude: 37.36537,
    longitude: -121.91071,
  }

  return <Apply listing={listing} internalFormRoute={internalFormRoute} />
}

export const acceptsPostmarkedApplications = () => {
  listing.applicationDueDate = new Date("2021-11-30T15:22:57.000-07:00")
  listing.applicationMailingAddress = {
    city: "San Jose",
    street: "98 Archer Street",
    zipCode: "95112",
    state: "CA",
    latitude: 37.36537,
    longitude: -121.91071,
  }
  listing.postmarkedApplicationsReceivedByDate = new Date("2021-12-05")

  return <Apply listing={listing} internalFormRoute={internalFormRoute} />
}

export const showsMultipleDownloadURLs = () => {
  const listingWithDownloadMethods = Object.assign({}, listing)

  const testMethod1: ApplicationMethod = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "English",
    externalReference: "#english",
    type: ApplicationMethodType.FileDownload,
  }
  const testMethod2: ApplicationMethod = {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "Spanish",
    externalReference: "#spanish",
    type: ApplicationMethodType.FileDownload,
  }

  listingWithDownloadMethods.applicationMethods = listingWithDownloadMethods.applicationMethods.concat(
    [testMethod1, testMethod2]
  )

  return <Apply listing={listingWithDownloadMethods} internalFormRoute={internalFormRoute} />
}

export const linkDirectlyToInternalApplication = () => {
  const listingWithInternalLink = Object.assign({}, listing)

  const internalMethod: ApplicationMethod = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    externalReference: "",
    label: "",
    type: ApplicationMethodType.Internal,
  }

  listingWithInternalLink.applicationMethods = listingWithInternalLink.applicationMethods.concat([
    internalMethod,
  ])

  return <Apply listing={listingWithInternalLink} internalFormRoute={internalFormRoute} />
}

export const linkToInternalApplicationAndDownloads = () => {
  const listingWithInternalAndDownload = Object.assign({}, listing)

  const internalMethod: ApplicationMethod = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    externalReference: "",
    label: "",
    type: ApplicationMethodType.Internal,
  }

  const downloadMethod: ApplicationMethod = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "English",
    externalReference: "#english",
    type: ApplicationMethodType.FileDownload,
  }

  listingWithInternalAndDownload.applicationMethods = listingWithInternalAndDownload.applicationMethods.concat(
    [internalMethod, downloadMethod]
  )

  return <Apply listing={listingWithInternalAndDownload} internalFormRoute={internalFormRoute} />
}

export const linkDirectlyToExternalApplication = () => {
  const listingWithMethodLinks = Object.assign({}, listing)

  const externalMethod: ApplicationMethod = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    acceptsPostmarkedApplications: false,
    label: "External",
    externalReference: "https://icann.org",
    type: ApplicationMethodType.ExternalLink,
  }

  listingWithMethodLinks.applicationMethods = listingWithMethodLinks.applicationMethods.concat([
    externalMethod,
  ])

  return <Apply listing={listingWithMethodLinks} internalFormRoute={internalFormRoute} />
}
