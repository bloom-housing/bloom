import { ListingEvent, ListingEventsTypeEnum } from "../types/backend-swagger"

const configuredCloudName = (cloudName?: string) => {
  return cloudName || process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
}

export const cloudinaryPdfFromId = (publicId: string, cloudName?: string) => {
  const resolvedCloudName = configuredCloudName(cloudName)
  if (!resolvedCloudName) {
    return publicId
  }
  return `https://res.cloudinary.com/${resolvedCloudName}/image/upload/${publicId}.pdf`
}

export const pdfUrlFromListingEvents = (
  events: ListingEvent[],
  listingEventType: ListingEventsTypeEnum,
  cloudName?: string
) => {
  const event = events.find((event) => event?.type === listingEventType)
  if (event) {
    return event.assets?.label == "cloudinaryPDF"
      ? cloudinaryPdfFromId(event.assets.fileId, cloudName)
      : event.url ?? null
  }
  return null
}
