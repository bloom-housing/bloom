// Branding assets are delivered as PNG at display quality, unlike the listing-image helper's
// jpg output. The S3 template mirrors S3Service.urlForPublic, which reads the same env.

const WIDTH = { logo: 400, favicon: 64 } as const;

const SAFE_FILE_ID = /^[A-Za-z0-9._\-/]+$/;

const escapesThePath = (fileId: string): boolean =>
  !SAFE_FILE_ID.test(fileId) || fileId.split('/').includes('..');

export const brandAssetUrl = (
  fileId: string | null | undefined,
  kind: keyof typeof WIDTH,
): string | undefined => {
  if (!fileId) return undefined;

  if (escapesThePath(fileId)) {
    console.error(`asset file id ${fileId} is not a usable storage key`);
    return undefined;
  }

  // A configured public bucket is what makes the api serve uploads from s3.
  const bucket = process.env.S3_PUBLIC_BUCKET;
  const region = process.env.S3_REGION;
  if (bucket) {
    if (!region) {
      console.error('S3_PUBLIC_BUCKET is set but S3_REGION is not');
      return undefined;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/${fileId}`;
  }

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_${WIDTH[kind]},c_limit,q_90,f_png/${fileId}`;
};
