import { Asset, Listing } from "@bloom-housing/backend-core/types"

export const cloudinaryUrlFromId = (publicId: string, size = 400) => {
  const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},c_limit,q_65/${publicId}.jpg`
}

export const imageUrlFromListing = (listing: Listing, size = 400) => {
  const cloudinaryBuilding = listing?.assets?.find(
    (asset: Asset) => asset.label == "cloudinaryBuilding"
  )?.fileId
  if (cloudinaryBuilding) return cloudinaryUrlFromId(cloudinaryBuilding, size)

  return listing?.assets?.find((asset: Asset) => asset.label == "building")?.fileId
}
