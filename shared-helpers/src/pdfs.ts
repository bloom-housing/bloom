import { ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"

export const cloudinaryPdfFromId = (publicId: string, cloudName: string) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
}

export const pdfUrlFromListingEvents = (
  events: ListingEvent[],
  listingType: ListingEventType,
  cloudName: string
) => {
  const event = events.find((event) => event.type === listingType)
  if (event) {
    return event.file?.label == "cloudinaryPDF"
      ? cloudinaryPdfFromId(event.file.fileId, cloudName)
      : event.url
  }
  return null
}
