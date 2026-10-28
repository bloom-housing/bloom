/**
 * Returns the appropriate fileId for a Cloudinary asset based on the
 * DBSEED_USE_FULL_CLOUDINARY_URL_AS_FILE_ID environment variable.
 *
 * When the env var is set, returns the full Cloudinary URL:
 *   https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/<IMAGE_ID>.jpg
 *
 * Otherwise, returns the image ID as-is.
 */
export function assetFileId(imageId: string): string {
  if (process.env.DBSEED_USE_FULL_CLOUDINARY_URL_AS_FILE_ID) {
    const size = process.env.LISTING_PHOTO_SIZE || '1302';
    return `https://res.cloudinary.com/exygy/image/upload/w_${size},c_limit,q_65/${imageId}.jpg`;
  }
  return imageId;
}
