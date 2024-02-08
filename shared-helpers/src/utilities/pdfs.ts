import { ListingEvent, ListingEventsTypeEnum } from "../types/backend-swagger"

export const cloudinaryPdfFromId = (publicId: string, cloudName: string) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
}

export const pdfUrlFromListingEvents = (
  events: ListingEvent[],
  listingEventType: ListingEventsTypeEnum,
  cloudName: string
) => {
  const event = events.find((event) => event?.type === listingEventType)
  if (event) {
    return event.assets?.label == "cloudinaryPDF"
      ? cloudinaryPdfFromId(event.assets.fileId, cloudName)
      : event.url ?? null
  }
  return null
}
