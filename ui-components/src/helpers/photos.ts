import { Asset, Listing } from "@bloom-housing/backend-core/types"

export const cloudinaryUrlFromId = (publicId: string, size = 400, resourceType = "image") => {
  const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  let url = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/w_${size},c_limit,q_65/${publicId}`
  url = resourceType === "raw" ? url : url + ".jpg"
  return url
}

export const imageUrlFromListing = (listing: Listing, size = 400) => {
  // Use the new `image` field
  const imageAssets = listing?.image ? [listing.image] : listing?.assets

  // Fallback to `assets`
  const cloudinaryBuilding = imageAssets?.find(
    (asset: Asset) => asset.label == "cloudinaryBuilding"
  )?.fileId
  if (cloudinaryBuilding) return cloudinaryUrlFromId(cloudinaryBuilding, size)

  return imageAssets?.find((asset: Asset) => asset.label == "building")?.fileId
}
