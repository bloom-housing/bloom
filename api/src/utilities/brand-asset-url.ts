// Branding assets are delivered as PNG at display quality, unlike the listing-image helper's
// jpg output. The S3 template mirrors S3Service.urlForPublic, which reads the same env.

const WIDTH = { logo: 400, favicon: 64 } as const;

export const brandAssetUrl = (
  fileId: string | null | undefined,
  kind: keyof typeof WIDTH,
): string | undefined => {
  if (!fileId) return undefined;

  if (process.env.USE_S3_FILE_STORAGE === 'TRUE') {
    return `https://${process.env.S3_PUBLIC_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileId}`;
  }

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/w_${WIDTH[kind]},c_limit,q_90,f_png/${fileId}`;
};
