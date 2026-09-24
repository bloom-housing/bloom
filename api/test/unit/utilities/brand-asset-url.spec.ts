import {
  brandAssetUrl,
  isUsableFileId,
} from '../../../src/utilities/brand-asset-url';

describe('brandAssetUrl', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'exygy';
    delete process.env.S3_PUBLIC_BUCKET;
    delete process.env.S3_REGION;
    jest.restoreAllMocks();
  });

  it('builds a Cloudinary url with the kind width', () => {
    expect(brandAssetUrl('logo-id', 'logo')).toEqual(
      'https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_90,f_png/logo-id',
    );
    expect(brandAssetUrl('favicon-id', 'favicon')).toEqual(
      'https://res.cloudinary.com/exygy/image/upload/w_64,c_limit,q_90,f_png/favicon-id',
    );
  });

  it.each([
    [
      '../../../../attackercloud/image/upload/evil.png',
      'traversal to another account',
    ],
    ['..', 'a bare traversal segment'],
    ['logo?x=1', 'a query string'],
    ['logo#frag', 'a fragment'],
    ['logo\\evil', 'a backslash'],
    ['logo evil', 'a space'],
    [
      'https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a',
      'a full url rather than a storage key',
    ],
  ])('refuses %s, which is %s', (fileId) => {
    jest.spyOn(console, 'error').mockImplementation();

    expect(brandAssetUrl(fileId, 'logo')).toBeUndefined();
  });

  it('allows the slashes and dots a real storage key contains', () => {
    expect(brandAssetUrl('dev/bloom_logo.v2.png', 'logo')).toEqual(
      'https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_90,f_png/dev/bloom_logo.v2.png',
    );
  });

  it('builds an S3 url when a public bucket is configured', () => {
    process.env.S3_PUBLIC_BUCKET = 'bloom-public';
    process.env.S3_REGION = 'us-west-2';

    expect(brandAssetUrl('key', 'logo')).toEqual(
      'https://bloom-public.s3.us-west-2.amazonaws.com/key',
    );
  });

  it('returns no url and logs when the bucket has no region', () => {
    process.env.S3_PUBLIC_BUCKET = 'bloom-public';
    delete process.env.S3_REGION;
    const error = jest.spyOn(console, 'error').mockImplementation();

    expect(brandAssetUrl('key', 'logo')).toBeUndefined();
    expect(error).toHaveBeenCalled();
  });

  it('returns no url without a file id', () => {
    expect(brandAssetUrl(null, 'logo')).toBeUndefined();
    expect(brandAssetUrl(undefined, 'favicon')).toBeUndefined();
  });
});

describe('isUsableFileId', () => {
  it('accepts the storage keys each backend produces', () => {
    // The uuid s3 returns from createS3UploadUrl, and a Cloudinary public id.
    expect(isUsableFileId('9f1c2e3a-7b4d-4c1e-9a2f-5d6e7f8a9b0c')).toBe(true);
    expect(isUsableFileId('dev/bloom_logo.v2.png')).toBe(true);
  });

  it('refuses a full url, which is what an s3 upload reports as its id', () => {
    expect(
      isUsableFileId(
        'https://bloom-public.s3.us-west-2.amazonaws.com/9f1c2e3a',
      ),
    ).toBe(false);
  });

  it('refuses a traversal segment', () => {
    expect(isUsableFileId('../../secrets')).toBe(false);
  });
});
