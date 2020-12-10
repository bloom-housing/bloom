import * as React from "react"

import { Apply } from "./Apply"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import {
  ApplicationMethod,
  ApplicationMethodType,
} from "@bloom-housing/core"

export default {
  title: "Listing Sidebar/Apply",
}

const listing = Object.assign({}, Archer) as any
const internalFormRoute = "/applications/start/choose-language"

export const hardApplicationDeadline = () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.applicationMethods[0].acceptsPostmarkedApplications = false

  return <Apply listing={listing} internalFormRoute={internalFormRoute} />
}

export const acceptsPostmarkedApplications = () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.applicationMethods[0].acceptsPostmarkedApplications = true
  listing.postmarkedApplicationsReceivedByDate = "2021-12-05"

  return <Apply listing={listing} internalFormRoute={internalFormRoute} />
}

export const showsMultipleDownloadURLs = () => {
  const listingWithDownloadMethods = Object.assign({}, listing)

  const testMethod1: ApplicationMethod = {
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    id: "",
    updatedAt: new Date(),
    label: "English",
    externalReference: "#english",
    type: ApplicationMethodType.FileDownload,
  }
  const testMethod2: ApplicationMethod = {
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    id: "",
    updatedAt: new Date(),
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
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    externalReference: "",
    id: "",
    label: "",
    updatedAt: new Date(),
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
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    externalReference: "",
    id: "",
    label: "",
    updatedAt: new Date(),
    type: ApplicationMethodType.Internal,
  }

  const downloadMethod: ApplicationMethod = {
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    id: "",
    updatedAt: new Date(),
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
    acceptsPostmarkedApplications: false,
    createdAt: new Date(),
    id: "",
    updatedAt: new Date(),
    label: "External",
    externalReference: "https://icann.org",
    type: ApplicationMethodType.ExternalLink,
  }

  listingWithMethodLinks.applicationMethods = listingWithMethodLinks.applicationMethods.concat([
    externalMethod,
  ])

  return <Apply listing={listingWithMethodLinks} internalFormRoute={internalFormRoute} />
}
