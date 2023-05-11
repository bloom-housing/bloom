import { AssetCreate, ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"

export const cloudinaryPdfFromId = (publicId: string, cloudName: string) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
}

/**
 * This function returns a URL that can be presented directly to the client for
 * a public-facing Asset (specifically a PDF).  This is purely for presentation
 * and has no bearing on any server-side functionality.
 *
 * Due to the way that assets are currently stored, not all assets contain a full
 * URL and so we must instead use additional information to generate a URL from
 * context.  This function is designed to work within the bounds of current logic
 * while still functioning as expected should this logic then be implemented on
 * the backend instead.
 *
 * This function is nearly identical to `getImageUrlFromAsset()` and they could
 * likely be combined with minimal effort.  They are kept separate to adhere to
 * the paradigm already established.
 *
 * Note that `cloudinaryCloudName` is a temporary (and optional) param used to
 * pass in the "cloud name" for the cloudinary instance to use.  While it would
 * not be unreasonable to use a `process.env` value directly on the function call,
 * this implements a reasonable default while providing an easy way to override
 * the value as needed without overly complcating the function signature.
 *
 * @param asset               The asset to get the URL for
 * @param cloudinaryCloudName The "cloud name" for assets in Cloudinary
 * @returns                   The URL to use to access the asset or null
 */
export const getPdfUrlFromAsset = (
  asset: AssetCreate,
  cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || "exygy"
): string | null => {
  const fileId = asset.fileId

  // if fileId is a url, just return it
  // putting this first enables us to enforce formatting on the backend
  if (fileId.match(/https?:\/\//)) {
    return fileId
  }

  // handle the specific case where it's a pdf stored in cloudinary
  if (asset.label == "cloudinaryPDF") {
    return cloudinaryPdfFromId(asset.fileId, cloudinaryCloudName)
  }

  // if we don't have anything by now, we don't know what else to do
  // log and return null since that's the previous default behavior
  console.log(`Could not resolve URL for PDF asset [${fileId}]`)
  return null
}

export const pdfUrlFromListingEvents = (
  events: ListingEvent[],
  listingEventType: ListingEventType
) => {
  const event = events.find((event) => event?.type === listingEventType)

  if (event) {
    if (event.file) {
      return getPdfUrlFromAsset(event.file)
    }

    if (event.url) {
      return event.url
    }
  }
  return null
}
