import { Asset, AssetCreate, Listing } from "../types/backend-swagger"

export const CLOUDINARY_BUILDING_LABEL = "cloudinaryBuilding"
export const IMAGE_FALLBACK_URL = "/images/listing-fallback.png"

export const cloudinaryUrlFromId = (publicId: string, cloudName: string, size = 400) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${size},c_limit,q_65/${publicId}.jpg`
}

/**
 * This function returns a URL that can be presented directly to the client for
 * a public-facing Asset (specifically a listing image).  This is purely for
 * presentation and has no bearing on any server-side functionality.
 *
 * Due to the way that assets are currently stored, not all assets contain a full
 * URL and so we must instead use additional information to generate a URL from
 * context.  This function is designed to work within the bounds of current logic
 * while still functioning as expected should this logic then be implemented on
 * the backend instead.
 *
 * This function is nearly identical to `getPdfUrlFromAsset()` and they could
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
 * @param size                The size of the image (cloudinary only)
 * @param cloudinaryCloudName The "cloud name" for assets in Cloudinary
 * @returns                   The URL to use to access the asset or null
 */
export const getImageUrlFromAsset = (
  asset: AssetCreate,
  size = 400,
  cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || "exygy"
): string => {
  // ): string | null => {
  const fileId = asset.fileId

  // if fileId is a url, just return it
  // putting this first enables us to enforce formatting on the backend
  if (fileId.match(/https?:\/\//)) {
    return fileId
  }

  // // handle the case outlined in test "should return correct id when falling back to old field"
  if (asset.label == "building") {
    return fileId
  }

  //// TODO: fix external listings' asset label; remember to unskip tests.
  return cloudinaryUrlFromId(asset.fileId, cloudinaryCloudName, size)
  // // handle the specific case where it's an image stored in cloudinary
  // if (asset.label == "cloudinaryBuilding") {
  //   return cloudinaryUrlFromId(asset.fileId, cloudinaryCloudName, size)
  // }

  // // if we don't have anything by now, we don't know what else to do
  // // log and return null since that's the previous default behavior
  // console.log(`Could not resolve URL for image asset [${fileId}]`)
  // return null
}

// export const getUrlForListingImage = (image: Asset, size = 400) => {
//   if (!image) return null

//   if (image.label == CLOUDINARY_BUILDING_LABEL) {
//     return cloudinaryUrlFromId(image.fileId, CLOUDINARY_BUILDING_LABEL, size)
//   } else {
//     return image.fileId
//   }
// }

export const imageUrlFromListing = (listing: Listing, size = 400): string[] => {
  let imageAssets: Asset[] = []

  if (listing?.listingImages?.length && listing.listingImages[0].assets) {
    imageAssets = listing.listingImages
      .sort((imageA, imageB) => (imageA.ordinal ?? 10) - (imageB?.ordinal ?? 10))
      .map((imageObj) => imageObj.assets)
  } else if (Array.isArray(listing?.assets)) {
    imageAssets = listing.assets
  }

  const imageUrls = imageAssets
    ?.filter(
      (asset: Asset) => asset.label === CLOUDINARY_BUILDING_LABEL || asset.label === "building"
    )
    ?.map((asset: Asset) => {
      return asset ? getImageUrlFromAsset(asset, size) : ""
    })

  return imageUrls?.length > 0 ? imageUrls : [IMAGE_FALLBACK_URL]
  // we can omit this by searching for both "cloudinaryBuilding" and "building" above
  //return imageAssets?.find((asset: Asset) => asset.label == "building")?.fileId
}
