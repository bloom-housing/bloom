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
  const imageAssets =
    listing?.images?.length && listing.images[0].image
      ? listing.images
          .sort((imageA, imageB) => (imageA.ordinal ?? 10) - (imageB?.ordinal ?? 10))
          .map((imageObj) => imageObj.image)
      : listing?.assets

  console.log(imageAssets)

  const imageUrls = imageAssets
    ?.filter(
      (asset: Asset) => asset.label === CLOUDINARY_BUILDING_LABEL || asset.label === "building"
    )
    ?.map((asset: Asset) => {
      return asset.label === CLOUDINARY_BUILDING_LABEL
        ? cloudinaryUrlFromId(asset.fileId, size)
        : asset.fileId
    })
  console.log(imageUrls)
  return imageUrls?.length > 0 ? imageUrls : ["/images/detroitDefault.png"]
}
