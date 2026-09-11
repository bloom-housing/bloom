import { brandAssetUrl } from '../../../src/utilities/brand-asset-url';

describe('brandAssetUrl', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'exygy';
    delete process.env.USE_S3_FILE_STORAGE;
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
  ])('refuses %s, which is %s', (fileId) => {
    jest.spyOn(console, 'error').mockImplementation();

    expect(brandAssetUrl(fileId, 'logo')).toBeUndefined();
  });

  it('allows the slashes and dots a real storage key contains', () => {
    expect(brandAssetUrl('dev/bloom_logo.v2.png', 'logo')).toEqual(
      'https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_90,f_png/dev/bloom_logo.v2.png',
    );
  });

  it('builds an S3 url when that backend is configured', () => {
    process.env.USE_S3_FILE_STORAGE = 'TRUE';
    process.env.S3_PUBLIC_BUCKET = 'bloom-public';
    process.env.S3_REGION = 'us-west-2';

    expect(brandAssetUrl('key', 'logo')).toEqual(
      'https://bloom-public.s3.us-west-2.amazonaws.com/key',
    );
  });

  it('returns no url and logs when S3 is selected but not configured', () => {
    process.env.USE_S3_FILE_STORAGE = 'TRUE';
    delete process.env.S3_PUBLIC_BUCKET;
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
