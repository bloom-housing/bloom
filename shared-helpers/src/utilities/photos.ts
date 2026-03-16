import { Asset, Listing } from "../types/backend-swagger"

export const CLOUDINARY_BUILDING_LABEL = "cloudinaryBuilding"
export const IMAGE_FALLBACK_URL = "/images/listing-fallback.png"

export const cloudinaryUrlFromId = (publicId: string, size = 400) => {
  const cloudinaryCloudName: string | undefined =
    process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudinaryCloudName) {
    return publicId
  }
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/w_${size},c_limit,q_65/${publicId}.jpg`
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
  let imageAssets: Asset[] = []

  if (listing?.listingImages?.length && listing.listingImages[0].assets) {
    imageAssets = listing.listingImages
      .sort((imageA, imageB) => (imageA.ordinal ?? 10) - (imageB?.ordinal ?? 10))
      .map((imageObj) => imageObj.assets)
  } else if (Array.isArray(listing?.assets)) {
    imageAssets = listing.assets
  }
  const cloudinaryCloudName: string | undefined =
    process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME

  let imageUrls = imageAssets
  if (cloudinaryCloudName) {
    imageUrls = imageUrls.filter(
      (asset: Asset) => asset.label === CLOUDINARY_BUILDING_LABEL || asset.label === "building"
    )
  }
  const assets = imageUrls?.map((asset: Asset) => getUrlForListingImage(asset, size) || "")

  return assets?.length > 0 ? assets : [IMAGE_FALLBACK_URL]
}
