import { Asset, Listing } from "@bloom-housing/backend-core/types"
import { FileServiceInterface, FileServiceProvider } from "@bloom-housing/shared-services"

export const cloudinaryUrlFromId = (publicId: string, cloudName: string, size = 400) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},c_limit,q_65/${publicId}.jpg`
}

export const imageUrlFromListing = (listing: Listing, size = 400) => {
  // Use the new `image` field
  const imageAssets =
    listing?.images?.length && listing.images[0].image ? [listing.images[0].image] : listing?.assets

  const fileService: FileServiceInterface = new FileServiceProvider().getService()

  // Fallback to `assets`
  const cloudinaryBuilding = imageAssets?.find(
    (asset: Asset) => asset.label == "cloudinaryBuilding"
  )?.fileId
  if (cloudinaryBuilding) return fileService.getDownloadUrlForPhoto(cloudinaryBuilding, size)

  return imageAssets?.find((asset: Asset) => asset.label == "building")?.fileId
}
