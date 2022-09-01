import { Asset, Listing } from "@bloom-housing/backend-core/types"

export const CLOUDINARY_BUILDING_LABEL = "cloudinaryBuilding"

export const cloudinaryUrlFromId = (publicId: string, size = 400) => {
  const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},c_limit,q_65/${publicId}.jpg`
}

export const getUrlForListingImage = (image: Asset, size = 400) => {
  if (!image) return null

  if (image.label == CLOUDINARY_BUILDING_LABEL) {
    return cloudinaryUrlFromId(image.fileId, size)
  } else {
    return image.fileId
  }
}

export const imageUrlFromListing = (listing: Listing, size = 400): string[] => {
  // Use the new `images` field
  const imageAssets =
    listing?.images?.length && listing.images[0].image
      ? listing.images.map((imageObj) => imageObj.image)
      : listing?.assets

  const cloudinaryBuilding = imageAssets
    ?.filter((asset: Asset) => asset.label == CLOUDINARY_BUILDING_LABEL)
    ?.map((asset: Asset) => asset.fileId)

  if (cloudinaryBuilding?.length > 0)
    return cloudinaryBuilding.map((imageId) => cloudinaryUrlFromId(imageId, size))
  else {
    const assetStrs = imageAssets
      ?.filter((asset: Asset) => asset.label == "building")
      ?.map((asset) => asset.fileId)
    return assetStrs?.length > 0 ? assetStrs : ["/images/detroitDefault.png"]
  }
}
