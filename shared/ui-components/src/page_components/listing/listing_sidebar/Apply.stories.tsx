import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Apply from "./Apply"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import { Attachment } from "@bloom-housing/core"

export default {
  title: "Listing Sidebar|Apply",
  decorators: [withA11y],
}

const listing = Object.assign({}, Archer) as any

export const hardApplicationDeadline = () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.acceptsPostmarkedApplications = false

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const acceptsPostmarkedApplications = () => {
  listing.applicationDueDate = "2021-11-30T15:22:57.000-07:00"
  listing.acceptsPostmarkedApplications = true
  listing.postmarkedApplicationsReceivedByDate = "2021-12-05"

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listing} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const showsMultipleDownloadURLs = () => {
  const listingWithAttachments = Object.assign({}, listing)

  const testAttachment1: Attachment = {
    label: "English",
    fileUrl: "#english",
    type: 1,
  }
  const testAttachment2: Attachment = {
    label: "Spanish",
    fileUrl: "#spanish",
    type: 1,
  }

  listingWithAttachments.attachments = [testAttachment1, testAttachment2]

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listingWithAttachments} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}

export const linkDirectlyToExternalApplication = () => {
  const listingWithAttachments = Object.assign({}, listing)

  listingWithAttachments.acceptingOnlineApplications = true
  listingWithAttachments.acceptingApplicationsByPoBox = false
  listingWithAttachments.acceptingApplicationsAtLeasingAgent = false

  const externalAttachment: Attachment = {
    label: "External",
    fileUrl: "https://icann.org",
    type: 2,
  }

  listingWithAttachments.attachments = [externalAttachment]

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return <Apply listing={listingWithAttachments} />
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
}
